import test from "node:test";
import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import { maxCvBytes, validateApplication } from "@/lib/careers";
import { createChallenge, verifyChallenge } from "@/lib/server/captcha";
import { createCareersHandlers } from "@/lib/server/careers-handler";
import {
  buildApplicationEmail,
  readSmtpConfig,
  type SmtpConfig,
} from "@/lib/server/smtp";

const secret = "test-only-secret-with-more-than-32-characters";
const smtp: SmtpConfig = {
  host: "smtp.example.test",
  port: 587,
  secure: false,
  user: "test-only",
  pass: "test-only",
  from: "website@example.test",
  to: "inbox@example.test",
};
const pdf = () =>
  new File(["%PDF-1.7 test fixture"], "my cv.pdf", { type: "application/pdf" });
function solve(challenge: { question: string }) {
  const [a, b] = challenge.question.split(" + ").map(Number);
  return String(a + b);
}
function form(changes: Record<string, string | File> = {}) {
  const data = new FormData();
  const fields: Record<string, string | File> = {
    name: "Test Applicant",
    email: "applicant@example.test",
    phone: "+1 (903) 555-0100",
    position: "kitchen",
    locationId: "broadway-7918",
    message: "Available on weekends.",
    consent: "on",
    website: "",
    locale: "es",
    captcha: "7",
    captchaToken: "",
    cv: pdf(),
    ...changes,
  };
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}
function request(body: FormData, headers: Record<string, string> = {}) {
  return new Request("https://aztec.example.test/api/careers", {
    method: "POST",
    headers: { origin: "https://aztec.example.test", ...headers },
    body,
  });
}

test("native captcha accepts only the signed answer before it expires", () => {
  const challenge = createChallenge(secret, 0);
  const answer = solve(challenge);
  assert.ok(verifyChallenge(secret, challenge.token, answer, 1000));
  assert.equal(
    verifyChallenge(secret, challenge.token, String(+answer + 1), 1000),
    null,
  );
  assert.equal(verifyChallenge(`${secret}x`, challenge.token, answer, 1000), null);
  assert.equal(verifyChallenge(secret, challenge.token, answer, 1800001), null);
  assert.equal(
    verifyChallenge(
      secret,
      challenge.token.replace(/^\d+/, "1799999"),
      answer,
      1000,
    ),
    null,
  );
  assert.equal(verifyChallenge(secret, challenge.token, "x", 1000), null);
});

test("applications reject injection, spam, future locations and unsupported files", () => {
  assert.equal(validateApplication(form()).ok, true);
  for (const change of <Record<string, string | File>[]>[
    { name: "Test\r\nBcc: other@example.test" },
    { email: "test@@example.test" },
    { phone: "call me" },
    { position: "chef" },
    { locationId: "fifth-street" },
    { message: "x".repeat(2001) },
    { consent: "off" },
    { website: "spam.example.test" },
    { locale: "fr" },
    { captcha: "" },
    { cv: new File(["MZ"], "cv.exe") },
    { cv: new File([], "cv.pdf") },
    { cv: new File([new Uint8Array(maxCvBytes + 1)], "cv.pdf") },
  ])
    assert.equal(validateApplication(form(change)).ok, false);
});

test("application email keeps fixed sender and inbox and attaches the CV under a rebuilt name", async () => {
  const result = validateApplication(
    form({
      name: "José Pérez/../x",
      message: "<script>alert(1)</script>\nWeekends",
    }),
  );
  assert.ok(result.ok);
  const env = {
    CONTACT_FORM_ENABLED: "true",
    SMTP_HOST: "smtp.example.test",
    SMTP_USER: "test-only",
    SMTP_PASS: "test-only",
    SMTP_FROM: "website@example.test",
  };
  assert.equal(readSmtpConfig(env)?.careersCc, undefined);
  assert.equal(
    readSmtpConfig({ ...env, CAREERS_CC: "copy@example.test\r\nBcc: x@example.test" }),
    null,
  );
  const config = readSmtpConfig({ ...env, CAREERS_CC: "copy@example.test" })!;
  const mail = buildApplicationEmail({ ...smtp, careersCc: config.careersCc }, result.data, {
    content: Buffer.from("%PDF-1.7 test fixture"),
    extension: "pdf",
    type: "application/pdf",
  });
  assert.equal(mail.to, smtp.to);
  assert.equal(mail.cc, "copy@example.test");
  assert.deepEqual(mail.from, { name: "Aztec Urban MX", address: smtp.from });
  assert.deepEqual(mail.replyTo, {
    name: "José Pérez/../x",
    address: "applicant@example.test",
  });
  assert.match(String(mail.text), /Area \/ Área: Kitchen \/ Cocina/);
  assert.match(String(mail.text), /Location \/ Sucursal: 7918 S\. Broadway/);
  // Applicant input is escaped in the HTML version; only the template adds markup.
  const html = String(mail.html);
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&#60;script&#62;alert(1)&#60;/script&#62;<br>Weekends"));
  assert.ok(html.includes("CV adjunto: CV-Jose-Perez-x.pdf"));
  assert.ok(html.includes('href="tel:+19035550100"'));
  assert.match(html, /href="mailto:applicant@example\.test\?subject=Tu%20solicitud/);
  // Nodemailer builds the MIME message in memory; it cannot contact any mailbox.
  const transport = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
    newline: "unix",
  });
  const message = (await transport.sendMail(mail)).message.toString();
  assert.match(message, /filename="?CV-Jose-Perez-x\.pdf"?/);
  assert.match(message, /Content-Type: application\/pdf/);
  assert.match(message, /Cc: copy@example\.test/);
  assert.match(message, /Content-Type: text\/html/);
});

test("careers API checks origin, file signature and single-use captcha before sending", async () => {
  const sent: string[] = [];
  const handlers = createCareersHandlers({
    config: () => smtp,
    secret: () => secret,
    deliver: async (_config, payload, cv) => {
      sent.push(`${payload.name}:${cv.extension}`);
    },
  });
  assert.deepEqual(
    await createCareersHandlers({ config: () => null }).GET().json(),
    { available: false },
  );
  const challenge = (await handlers.GET().json()).challenge;
  const solved = { captcha: solve(challenge), captchaToken: challenge.token };
  assert.equal((await handlers.POST(request(form(solved)))).status, 200);
  assert.deepEqual(sent, ["Test Applicant:pdf"]);
  const replay = await handlers.POST(request(form(solved)));
  assert.equal(replay.status, 422);
  assert.equal((await replay.json()).code, "captcha");
  const fresh = (await handlers.GET().json()).challenge;
  const wrong = await handlers.POST(
    request(
      form({ captcha: String(+solve(fresh) + 1), captchaToken: fresh.token }),
    ),
  );
  assert.equal((await wrong.json()).code, "captcha");
  const fake = await handlers.POST(
    request(form({ ...solved, cv: new File(["MZ fake"], "cv.pdf") })),
  );
  assert.deepEqual((await fake.json()).fields, ["cv"]);
  assert.equal(
    (
      await handlers.POST(
        request(form(solved), { origin: "https://elsewhere.example.test" }),
      )
    ).status,
    403,
  );
  const huge = await handlers.POST(
    request(form({ cv: new File([new Uint8Array(maxCvBytes + 70000)], "cv.pdf") })),
  );
  assert.equal(huge.status, 413);
  assert.equal((await handlers.POST(request(form(solved)))).status, 429);
  assert.equal(sent.length, 1);
  const failing = createCareersHandlers({
    config: () => smtp,
    secret: () => secret,
    deliver: async () => {
      throw new Error("Provider rejected the test");
    },
  });
  const next = (await failing.GET().json()).challenge;
  const failed = await failing.POST(
    request(form({ captcha: solve(next), captchaToken: next.token })),
  );
  assert.equal(failed.status, 502);
  assert.deepEqual(await failed.json(), { ok: false, code: "send_failed" });
});
