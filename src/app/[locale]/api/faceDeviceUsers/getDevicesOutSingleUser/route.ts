import { getDevicesOutSingleUser } from "@/services/faceDeviceUsersService";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const locale = req.headers.get('Accept-Language') || 'ru';

    if (!userId) {
      return NextResponse.json(
        { message: "user_id parameter is required" },
        { status: 400 }
      );
    }

    const res = await getDevicesOutSingleUser(locale, Number(userId));
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching devices out single user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
