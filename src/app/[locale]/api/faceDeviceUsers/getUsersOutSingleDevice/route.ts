import { getUsersOutSingleDevice } from "@/services/faceDeviceUsersService";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const faceDeviceId = searchParams.get('face_device_id');
    const locale = req.headers.get('Accept-Language') || 'ru';

    if (!faceDeviceId) {
      return NextResponse.json(
        { message: "face_device_id parameter is required" },
        { status: 400 }
      );
    }

    // Extract additional query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const name = searchParams.get('name') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10');

    const res = await getUsersOutSingleDevice(locale, Number(faceDeviceId), page, name, limit);
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching users out single device:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
