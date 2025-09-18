import { getUser, updateUser, deleteUser } from "@/services/usersService"
import { NextResponse } from "next/server"

export const GET = async (req: Request, props: { params: Promise<{ userId: string }> }) => {
  try {
    const params = await props.params;
    const { userId } = params;
    const locale = req.headers.get('Accept-Language') || 'ru';

    const res = await getUser(locale, Number(userId));
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const PUT = async (req: Request, props: { params: Promise<{ userId: string }> }) => {
  try {
    const params = await props.params;
    const { userId } = params
    const locale = req.headers.get('Accept-Language') || 'ru';
    
    // Always expect form-data
    const formData = await req.formData();
    const updateData = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      phone: formData.get('phone') as string,
      role_id: parseInt(formData.get('role_id') as string),
      login: formData.get('login') as string,
      password: formData.get('password') as string,
      status: formData.get('status') === 'true',
      image: formData.get('image') as File | string | null
    };
    
    const res = await updateUser(updateData, Number(userId), locale)
    return NextResponse.json(res.data)
  } catch (error: unknown) {
    console.error("Error updating user:", error);

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

export const POST = async (req: Request, props: { params: Promise<{ userId: string }> }) => {
  try {
    const params = await props.params;
    const { userId } = params
    const locale = req.headers.get('Accept-Language') || 'ru';
    
    // Always expect form-data with _method = PUT
    const formData = await req.formData();
    const method = formData.get('_method') as string;
    
    if (method === 'PUT') {
      const updateData = {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        phone: formData.get('phone') as string,
        role_id: parseInt(formData.get('role_id') as string),
        login: formData.get('login') as string,
        password: formData.get('password') as string,
        status: formData.get('status') === 'true',
        image: formData.get('image') as File | string | null
      };
      
      const res = await updateUser(updateData, Number(userId), locale)
      return NextResponse.json(res.data)
    }
    
    // If not a PUT method override, return method not allowed
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  } catch (error: unknown) {
    console.error("Error updating user:", error);

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

export const DELETE = async (req: Request, props: { params: Promise<{ userId: string }> }) => {
  try {
    const params = await props.params;
    const { userId } = params
    const locale = req.headers.get('Accept-Language') || 'ru';
    
    const res = await deleteUser(Number(userId), locale)
    return NextResponse.json(res.data)
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}