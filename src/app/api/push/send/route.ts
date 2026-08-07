import { NextRequest, NextResponse } from "next/server";
import { sendPushToDevice } from "@/lib/push/send";

// Manual trigger for now — POST { deviceId, title, body, url }. A real
// streak-reminder/badge-alert scheduler (e.g. a Vercel Cron hitting this
// per due device) isn't built yet; this just proves the send path works.
export async function POST(request: NextRequest) {
  const { deviceId, title, body, url } = await request.json();

  if (!deviceId || !title || !body) {
    return NextResponse.json({ error: "deviceId, title, and body are required" }, { status: 400 });
  }

  try {
    const result = await sendPushToDevice(deviceId, { title, body, url });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
