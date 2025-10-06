import { getUserRecords } from "@/services/faceDeviceUsersService";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const page = searchParams.get('page') || '1';
    const name = searchParams.get('name');
    const limit = searchParams.get('limit') || '10';
    const locale = req.headers.get('Accept-Language') || 'ru';

    if (!userId) {
      return NextResponse.json(
        { message: "user_id parameter is required" },
        { status: 400 }
      );
    }

    const res = await getUserRecords(locale, Number(userId), Number(page), name || undefined, Number(limit));
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching user records:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
