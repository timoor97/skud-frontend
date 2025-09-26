import { getUsers, createUser } from "@/services/usersService";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const locale = req.headers.get('Accept-Language') || 'ru';

    const res = await getUsers(locale, page);
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const locale = req.headers.get('Accept-Language') || 'ru';
    // Always expect form-data
    const formData = await req.formData();
    const userData = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      phone: formData.get('phone') as string,
      card_number: formData.get('card_number') as string,
      role_id: parseInt(formData.get('role_id') as string),
      status: formData.get('status') === 'true',
      image: formData.get('image') as File | string | null
    };


    const res = await createUser(userData, locale);
    return NextResponse.json(res.data);
  } catch (error: unknown) {
    console.error("Error creating user:", error);

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
