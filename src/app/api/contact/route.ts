import { createContactHandler } from "@/lib/server/contact-handler";
import { readSmtpConfig } from "@/lib/server/smtp";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
export function GET() {
  return Response.json(
    { available: Boolean(readSmtpConfig()) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
const handlePost = createContactHandler();
export async function POST(request: Request) {
  return handlePost(request);
}
