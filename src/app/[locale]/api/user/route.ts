import { getCurrentUser } from "@/services/currentUserService";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const locale = req.headers.get('Accept-Language') || 'ru';
    const res = await getCurrentUser(locale);
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
