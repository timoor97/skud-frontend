import { getFaceDeviceRecords } from "@/services/faceDeviceUsersService";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const faceDeviceId = searchParams.get('face_device_id');
    const page = searchParams.get('page') || '1';
    const name = searchParams.get('name');
    const limit = searchParams.get('limit') || '10';
    const locale = req.headers.get('Accept-Language') || 'ru';

    if (!faceDeviceId) {
      return NextResponse.json(
        { message: "face_device_id parameter is required" },
        { status: 400 }
      );
    }

    const res = await getFaceDeviceRecords(locale, Number(faceDeviceId), Number(page), name || undefined, Number(limit));
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching face device records:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
