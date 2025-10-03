import { addSingleUserToDevices } from "@/services/faceDeviceUsersService";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const locale = req.headers.get('Accept-Language') || 'ru';
    const body = await req.json();

    const { face_device_id, user_id } = body;

    // Validate required fields
    if (!face_device_id || !Array.isArray(face_device_id) || face_device_id.length === 0) {
      return NextResponse.json(
        { message: "face_device_id must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!user_id || typeof user_id !== 'number') {
      return NextResponse.json(
        { message: "user_id must be a number" },
        { status: 400 }
      );
    }

    const res = await addSingleUserToDevices(locale, user_id, face_device_id);
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error adding single user to devices:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
