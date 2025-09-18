import { getRole, updateRole, deleteRole } from "@/services/roleService"
import { NextResponse } from "next/server"

export const GET = async (req: Request, props: { params: Promise<{ roleId: string }> }) => {
  try {
    const params = await props.params;
    const { roleId } = params;
    const locale = req.headers.get('Accept-Language') || 'ru';

    const res = await getRole(locale, Number(roleId));
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const PUT = async (req: Request, props: { params: Promise<{ roleId: string }> }) => {
  try {
    const params = await props.params;
    const { name, description, permissions, key } = await req.json()
    const { roleId } = params
    const locale = req.headers.get('Accept-Language') || 'ru';
    
    const res = await updateRole({ name, description, permissions, key }, Number(roleId), locale)
    return NextResponse.json(res.data)
  } catch (error: unknown) {
    console.error("Error updating role:", error);

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

export const DELETE = async (req: Request, props: { params: Promise<{ roleId: string }> }) => {
  try {
    const params = await props.params;
    const { roleId } = params
    const locale = req.headers.get('Accept-Language') || 'ru';
    
    const res = await deleteRole(Number(roleId), locale)
    return NextResponse.json(res.data)
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}