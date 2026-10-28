import { createHash, randomBytes } from "node:crypto";
import { validateContact, type ContactPayload } from "@/lib/contact";
import { readSmtpConfig, deliverContact, type SmtpConfig } from "./smtp";

type Dependencies = {
  config?: () => SmtpConfig | null;
  deliver?: (config: SmtpConfig, payload: ContactPayload) => Promise<void>;
  now?: () => number;
};
function json(
  body: object,
  status: number,
  extra: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...extra },
  });
}
async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > 16384)
    throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    total += part.value.byteLength;
    if (total > 16384) {
      await reader.cancel();
      throw new RangeError();
    }
    chunks.push(part.value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export function createContactHandler(dependencies: Dependencies = {}) {
  const config = dependencies.config || readSmtpConfig;
  const deliver = dependencies.deliver || deliverContact;
  const now = dependencies.now || Date.now;
  // Per-process protection. A public Vercel deployment also needs a platform-wide WAF rate rule.
  const attempts = new Map<string, { count: number; expires: number }>();
  const salt = randomBytes(32);
  return async (request: Request) => {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin)
      return json({ ok: false, code: "forbidden" }, 403);
    if (
      request.headers.get("content-type")?.split(";")[0].trim() !==
      "application/json"
    )
      return json({ ok: false, code: "invalid" }, 415);
    const timestamp = now();
    for (const [key, bucket] of attempts)
      if (bucket.expires <= timestamp) attempts.delete(key);
    const address =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
    const key = createHash("sha256").update(salt).update(address).digest("hex");
    const previous = attempts.get(key);
    if (previous && previous.count >= 5)
      return json({ ok: false, code: "rate_limited" }, 429, {
        "Retry-After": String(Math.ceil((previous.expires - timestamp) / 1000)),
      });
    if (!previous && attempts.size >= 5000)
      return json({ ok: false, code: "rate_limited" }, 429, {
        "Retry-After": "900",
      });
    attempts.set(key, {
      count: (previous?.count || 0) + 1,
      expires: previous?.expires || timestamp + 900000,
    });
    const smtp = config();
    if (!smtp) return json({ ok: false, code: "unavailable" }, 503);
    let value: unknown;
    try {
      value = await readBody(request);
    } catch (error) {
      return json(
        {
          ok: false,
          code: error instanceof RangeError ? "too_large" : "invalid",
        },
        error instanceof RangeError ? 413 : 400,
      );
    }
    const result = validateContact(value);
    if (!result.ok)
      return json({ ok: false, code: "invalid", fields: result.fields }, 422);
    try {
      await deliver(smtp, result.data);
      return json({ ok: true }, 200);
    } catch {
      // No SMTP details, credentials, or message contents are exposed or logged.
      return json({ ok: false, code: "send_failed" }, 502);
    }
  };
}
