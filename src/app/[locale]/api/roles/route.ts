import { getRoles, createRole } from "@/services/roleService";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const locale = req.headers.get('Accept-Language') || 'ru';

    const res = await getRoles(locale, page);
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const { name, description, permissions, key } = await req.json();
    const locale = req.headers.get('Accept-Language') || 'ru';

    const res = await createRole({ name, description, permissions, key }, locale);

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    console.error("Error creating role:", error);

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