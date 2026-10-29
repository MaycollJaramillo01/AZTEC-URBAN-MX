import { createCareersHandlers } from "@/lib/server/careers-handler";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
const handlers = createCareersHandlers();
export function GET() {
  return handlers.GET();
}
export async function POST(request: Request) {
  return handlers.POST(request);
}
