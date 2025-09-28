import { getFaceDevices, createFaceDevice } from "@/services/faceDevicesService";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const name = searchParams.get('name');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const locale = req.headers.get('Accept-Language') || 'ru';

    const res = await getFaceDevices(locale, page, name || undefined, type || undefined, status || undefined);
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching face devices:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const { name, type, status, ip, port, username, password } = await req.json();
    const locale = req.headers.get('Accept-Language') || 'ru';

    const res = await createFaceDevice({ name, type, status, ip, port, username, password }, locale);

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    console.error("Error creating face device:", error);

    // If it's a validation error from the backend, pass it through
    if (error && typeof error === 'object' && ('status' in error || 'statusCode' in error)) {
      const errorObj = error as { status?: number; statusCode?: number; data?: unknown; message?: string };
      if (errorObj.status === 422 || errorObj.statusCode === 422) {
        return NextResponse.json(
          errorObj.data || errorObj.message || { message: "Validation failed" },
          { status: 422 }
        );
      }
    }

    // For other errors, return generic error
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
