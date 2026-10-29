import {
  cvFormats,
  maxCvBytes,
  validateApplication,
  type ApplicationPayload,
} from "@/lib/careers";
import { createChallenge, readCaptchaSecret, verifyChallenge } from "./captcha";
import { json, readBody, requestGuard } from "./contact-handler";
import {
  readSmtpConfig,
  deliverApplication,
  type CvAttachment,
  type SmtpConfig,
} from "./smtp";

type Dependencies = {
  config?: () => SmtpConfig | null;
  secret?: () => string;
  deliver?: (
    config: SmtpConfig,
    payload: ApplicationPayload,
    cv: CvAttachment,
  ) => Promise<void>;
  now?: () => number;
};
export function createCareersHandlers(dependencies: Dependencies = {}) {
  const config = dependencies.config || readSmtpConfig;
  const secret = dependencies.secret || readCaptchaSecret;
  const deliver = dependencies.deliver || deliverApplication;
  const now = dependencies.now || Date.now;
  const guard = requestGuard(now);
  // Solved challenges are single use within this process.
  const spent = new Map<string, number>();
  return {
    GET() {
      return config()
        ? json({ available: true, challenge: createChallenge(secret(), now()) }, 200)
        : json({ available: false }, 200);
    },
    async POST(request: Request) {
      const refused = guard(request, "multipart/form-data");
      if (refused) return refused;
      const smtp = config();
      if (!smtp) return json({ ok: false, code: "unavailable" }, 503);
      let form: FormData;
      try {
        // Multipart is parsed only after the bounded read, so oversized uploads are cut off early.
        form = await new Response(await readBody(request, maxCvBytes + 65536), {
          headers: { "content-type": request.headers.get("content-type")! },
        }).formData();
      } catch (error) {
        return json(
          {
            ok: false,
            code: error instanceof RangeError ? "too_large" : "invalid",
          },
          error instanceof RangeError ? 413 : 400,
        );
      }
      const result = validateApplication(form);
      if (!result.ok)
        return json({ ok: false, code: "invalid", fields: result.fields }, 422);
      const content = Buffer.from(await result.cv.arrayBuffer());
      const head = content.subarray(0, 8).toString("hex");
      const format = cvFormats.find((item) => head.startsWith(item.magic));
      if (!format)
        return json({ ok: false, code: "invalid", fields: ["cv"] }, 422);
      const timestamp = now();
      for (const [nonce, expires] of spent)
        if (expires <= timestamp) spent.delete(nonce);
      const solved = verifyChallenge(
        secret(),
        String(form.get("captchaToken")),
        String(form.get("captcha")).trim(),
        timestamp,
      );
      if (!solved || spent.has(solved.nonce))
        return json({ ok: false, code: "captcha", fields: ["captcha"] }, 422);
      spent.set(solved.nonce, solved.expiresAt);
      try {
        await deliver(smtp, result.data, {
          content,
          extension: format.extension,
          type: format.type,
        });
        return json({ ok: true }, 200);
      } catch {
        // No SMTP details, credentials, applicant data, or files are exposed or logged.
        return json({ ok: false, code: "send_failed" }, 502);
      }
    },
  };
}
