import {
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

const lifetime = 30 * 60 * 1000;
// ponytail: per-process fallback; serverless instances reject each other's challenges until CAPTCHA_SECRET is set.
const fallback = randomBytes(32).toString("base64url");
export function readCaptchaSecret(
  env: Record<string, string | undefined> = process.env,
) {
  const secret = env.CAPTCHA_SECRET?.trim();
  return secret && secret.length >= 32 ? secret : fallback;
}
function sign(secret: string, body: string, answer: string) {
  return createHmac("sha256", secret)
    .update(`${body}.${answer}`)
    .digest("base64url");
}
// Native arithmetic challenge. The answer only travels inside the HMAC, so no state or third party is needed.
export function createChallenge(secret: string, now = Date.now()) {
  const a = randomInt(2, 10);
  const b = randomInt(1, 10);
  const body = `${now + lifetime}.${randomBytes(12).toString("base64url")}`;
  return {
    question: `${a} + ${b}`,
    token: `${body}.${sign(secret, body, String(a + b))}`,
  };
}
// Returns the challenge identifier while it is unexpired and correctly answered, so callers can refuse reuse.
export function verifyChallenge(
  secret: string,
  token: string,
  answer: string,
  now = Date.now(),
) {
  const [expires, nonce, signature, ...rest] = token.split(".");
  const expiresAt = Number(expires);
  if (
    rest.length ||
    !nonce ||
    !signature ||
    !/^\d{1,3}$/.test(answer) ||
    !(expiresAt > now && expiresAt <= now + lifetime)
  )
    return null;
  const expected = Buffer.from(
    sign(secret, `${expires}.${nonce}`, String(Number(answer))),
  );
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given)
    ? { nonce, expiresAt }
    : null;
}
