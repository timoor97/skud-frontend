import { getPermissions } from "@/services/permissionsService";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const locale = req.headers.get('Accept-Language') || 'ru';

    const res = await getPermissions(locale, page);
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
