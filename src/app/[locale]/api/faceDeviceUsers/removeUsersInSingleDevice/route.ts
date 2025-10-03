import { removeUsersFromSingleDevice } from "@/services/faceDeviceUsersService";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const locale = req.headers.get('Accept-Language') || 'ru';
    const body = await req.json();

    const { face_device_id, user_id } = body;

    if (!face_device_id || !user_id) {
      return NextResponse.json(
        { message: "face_device_id and user_id are required" },
        { status: 400 }
      );
    }

    const result = await removeUsersFromSingleDevice(locale, face_device_id, user_id);
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error removing users from single device:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
