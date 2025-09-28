import { getFaceDevice, updateFaceDevice, deleteFaceDevice } from "@/services/faceDevicesService"
import { NextResponse } from "next/server"

export const GET = async (req: Request, props: { params: Promise<{ deviceId: string }> }) => {
  try {
    const params = await props.params;
    const { deviceId } = params;
    const locale = req.headers.get('Accept-Language') || 'ru';

    const res = await getFaceDevice(locale, Number(deviceId));
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching face device:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const PUT = async (req: Request, props: { params: Promise<{ deviceId: string }> }) => {
  try {
    const params = await props.params;
    const { name, type, status, ip, port, username, password } = await req.json()
    const { deviceId } = params
    const locale = req.headers.get('Accept-Language') || 'ru';
    
    const res = await updateFaceDevice({ name, type, status, ip, port, username, password }, Number(deviceId), locale)
    return NextResponse.json(res.data)
  } catch (error: unknown) {
    console.error("Error updating face device:", error);

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

export const DELETE = async (req: Request, props: { params: Promise<{ deviceId: string }> }) => {
  try {
    const params = await props.params;
    const { deviceId } = params
    const locale = req.headers.get('Accept-Language') || 'ru';
    
    const res = await deleteFaceDevice(Number(deviceId), locale)
    return NextResponse.json(res.data)
  } catch (error) {
    console.error("Error deleting face device:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
