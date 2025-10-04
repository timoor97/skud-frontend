import { NextResponse } from "next/server"

export const PATCH = async (req: Request, props: { params: Promise<{ deviceId: string }> }) => {
  try {
    const params = await props.params;
    const { deviceId } = params
    const { url, protocol_type, addressing_format_type, host_name, port_no } = await req.json()
    const locale = req.headers.get('Accept-Language') || 'ru';
    
    // Make the API call to the backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const response = await fetch(`${backendUrl}/faceDevices/${deviceId}/set-push-url`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': locale,
        'Authorization': req.headers.get('Authorization') || '',
        'Cookie': req.headers.get('Cookie') || ''
      },
      body: JSON.stringify({
        url,
        protocol_type,
        addressing_format_type,
        host_name,
        port_no
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error("Error setting push URL:", error);

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
