import { changePassword } from "@/services/usersService"
import { NextResponse } from "next/server"

export const PATCH = async (req: Request, props: { params: Promise<{ userId: string }> }) => {
  try {
    const params = await props.params;
    const { userId } = params
    const locale = req.headers.get('Accept-Language') || 'ru';
    
    const body = await req.json();
    const res = await changePassword(body, Number(userId), locale)
    return NextResponse.json(res.data)
  } catch (error: unknown) {
    console.error("Error changing password:", error);

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
}
