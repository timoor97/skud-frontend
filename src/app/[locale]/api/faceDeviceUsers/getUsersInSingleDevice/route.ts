import { getUsersInSingleDevice } from "@/services/faceDeviceUsersService";
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

    const res = await getUsersInSingleDevice(locale, Number(faceDeviceId));
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching users in single device:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
