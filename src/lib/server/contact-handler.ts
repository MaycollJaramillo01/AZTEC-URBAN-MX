import { createHash, randomBytes } from "node:crypto";
import { validateContact, type ContactPayload } from "@/lib/contact";
import { readSmtpConfig, deliverContact, type SmtpConfig } from "./smtp";

type Dependencies = {
  config?: () => SmtpConfig | null;
  deliver?: (config: SmtpConfig, payload: ContactPayload) => Promise<void>;
  now?: () => number;
};
export function json(
  body: object,
  status: number,
  extra: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...extra },
  });
}
export async function readBody(request: Request, limit: number) {
  if (Number(request.headers.get("content-length")) > limit)
    throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    total += part.value.byteLength;
    if (total > limit) {
      await reader.cancel();
      throw new RangeError();
    }
    chunks.push(part.value);
  }
  return Buffer.concat(chunks);
}
// Same-origin, content-type and attempt checks shared by the form endpoints.
export function requestGuard(now: () => number) {
  // Per-process protection. A public Vercel deployment also needs a platform-wide WAF rate rule.
  const attempts = new Map<string, { count: number; expires: number }>();
  const salt = randomBytes(32);
  return (request: Request, type: string) => {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin)
      return json({ ok: false, code: "forbidden" }, 403);
    if (request.headers.get("content-type")?.split(";")[0].trim() !== type)
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
    return null;
  };
}
export function createContactHandler(dependencies: Dependencies = {}) {
  const config = dependencies.config || readSmtpConfig;
  const deliver = dependencies.deliver || deliverContact;
  const guard = requestGuard(dependencies.now || Date.now);
  return async (request: Request) => {
    const refused = guard(request, "application/json");
    if (refused) return refused;
    const smtp = config();
    if (!smtp) return json({ ok: false, code: "unavailable" }, 503);
    let value: unknown;
    try {
      value = JSON.parse((await readBody(request, 16384)).toString("utf8"));
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
