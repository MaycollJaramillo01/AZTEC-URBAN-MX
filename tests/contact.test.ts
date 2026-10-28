import test from "node:test";
import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import { validateContact } from "@/lib/contact";
import {
  buildContactEmail,
  readSmtpConfig,
  type SmtpConfig,
} from "@/lib/server/smtp";
import { createContactHandler } from "@/lib/server/contact-handler";

const payload = {
  name: "Test Visitor",
  email: "visitor@example.test",
  message: "A development test message, never sent externally.",
  consent: true,
  locale: "es",
  locationId: "broadway-2127",
  website: "",
};
const smtp: SmtpConfig = {
  host: "smtp.example.test",
  port: 587,
  secure: false,
  user: "test-only",
  pass: "test-only",
  from: "website@example.test",
  to: "inbox@example.test",
};
function request(
  body: unknown = payload,
  headers: Record<string, string> = {},
) {
  return new Request("https://aztec.example.test/api/contact", {
    method: "POST",
    headers: {
      origin: "https://aztec.example.test",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

test("contact rejects header injection, invalid email, missing consent, spam and future locations", () => {
  assert.equal(validateContact(payload).ok, true);
  for (const change of [
    { name: "Test\r\nBcc: other@example.test" },
    { email: "test@@example.test" },
    { email: "test@example.test\r\nBcc: other@example.test" },
    { consent: false },
    { website: "spam.example.test" },
    { locationId: "fifth-street" },
    { message: "short" },
    { message: "x".repeat(4001) },
  ])
    assert.equal(validateContact({ ...payload, ...change }).ok, false);
});

test("SMTP stays off until enabled with complete server configuration and keeps TLS verification", () => {
  const env = {
    CONTACT_FORM_ENABLED: "true",
    SMTP_HOST: "smtp.example.test",
    SMTP_USER: "test-only",
    SMTP_PASS: "test-only",
    SMTP_FROM: "website@example.test",
  };
  assert.equal(readSmtpConfig({}), null);
  assert.equal(readSmtpConfig({ ...env, CONTACT_FORM_ENABLED: "false" }), null);
  assert.equal(readSmtpConfig({ ...env, SMTP_PASS: "" }), null);
  assert.equal(readSmtpConfig({ ...env, SMTP_PORT: "25" }), null);
  assert.equal(
    readSmtpConfig({
      ...env,
      SMTP_FROM: "visitor@example.test\r\nBcc: other@example.test",
    }),
    null,
  );
  assert.equal(readSmtpConfig(env)?.secure, false);
  assert.equal(readSmtpConfig({ ...env, SMTP_PORT: "465" })?.secure, true);
  assert.equal(
    readSmtpConfig({ ...env, SMTP_PORT: "465", SMTP_SECURE: "false" }),
    null,
  );
});

test("contact email uses a fixed destination/from and puts the visitor only in Reply-To", async () => {
  const validated = validateContact({
    ...payload,
    to: "attacker@example.test",
    from: "attacker@example.test",
  });
  assert.ok(validated.ok);
  const mail = buildContactEmail(smtp, validated.data);
  assert.equal(mail.to, smtp.to);
  assert.deepEqual(mail.from, { name: "Aztec Urban MX", address: smtp.from });
  assert.deepEqual(mail.replyTo, {
    name: payload.name,
    address: payload.email,
  });
  assert.ok(String(mail.text).includes("2127 S. Broadway"));
  // Nodemailer builds an actual MIME message in memory; it cannot contact any mailbox.
  const transport = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
    newline: "unix",
  });
  const result = await transport.sendMail(mail);
  assert.match(
    result.message.toString(),
    /Reply-To: Test Visitor <visitor@example.test>/,
  );
  assert.match(result.message.toString(), /To: inbox@example.test/);
});

test("API refuses unavailable SMTP, foreign origins and malformed payloads without sending", async () => {
  let sends = 0;
  const deliver = async () => {
    sends++;
  };
  const off = createContactHandler({ config: () => null, deliver });
  assert.equal((await off(request())).status, 503);
  const handler = createContactHandler({ config: () => smtp, deliver });
  assert.equal(
    (
      await handler(
        request(payload, { origin: "https://elsewhere.example.test" }),
      )
    ).status,
    403,
  );
  assert.equal(
    (await handler(request(payload, { "content-type": "text/plain" }))).status,
    415,
  );
  assert.equal(
    (await handler(request({ ...payload, consent: false }))).status,
    422,
  );
  assert.equal((await handler(request("x".repeat(17000)))).status, 413);
  assert.equal(sends, 0);
});

test("API waits for delivery acceptance and never reports success on a provider failure", async () => {
  let accept: () => void = () => {};
  const accepted = new Promise<void>((resolve) => {
    accept = resolve;
  });
  const handler = createContactHandler({
    config: () => smtp,
    deliver: async () => accepted,
  });
  let returned = false;
  const response = handler(request()).then((value) => {
    returned = true;
    return value;
  });
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(returned, false);
  accept();
  assert.deepEqual(await (await response).json(), { ok: true });
  const failure = createContactHandler({
    config: () => smtp,
    deliver: async () => {
      throw new Error("Provider rejected the test");
    },
  });
  const failed = await failure(request());
  assert.equal(failed.status, 502);
  assert.deepEqual(await failed.json(), { ok: false, code: "send_failed" });
});

test("API rate limit blocks repeated submissions and expires after fifteen minutes", async () => {
  let timestamp = 0;
  const handler = createContactHandler({
    config: () => smtp,
    deliver: async () => {},
    now: () => timestamp,
  });
  for (let i = 0; i < 5; i++)
    assert.equal((await handler(request())).status, 200);
  const blocked = await handler(request());
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get("Retry-After"), "900");
  timestamp = 900001;
  assert.equal((await handler(request())).status, 200);
});
