export interface FaceDevice {
  id: number;
  name: string;
  type: 'enter' | 'exit';
  status: 'active' | 'not_active';
  ip: string;
  port: string;
  username: string;
  password: string;
  last_checked_at?: string;
  createdAt?: string;
  updatedAt?: string;
  push_url?: {
    url: string;
    protocol_type: 'HTTP' | 'HTTPS';
    addressing_format_type: 'hostname' | 'ipaddress';
    host_name: string;
    port_no: string;
  };
}

export interface CreateFaceDeviceRequest {
  name: string;
  type: 'enter' | 'exit';
  status: 'active' | 'not_active';
  ip: string;
  port: string;
  username: string;
  password: string;
}

export interface SetPushUrlRequest {
  url: string;
  protocol_type: 'HTTP' | 'HTTPS';
  addressing_format_type: 'hostname' | 'ipaddress';
  host_name: string;
  port_no: string;
}

export interface UpdateFaceDeviceRequest extends Partial<CreateFaceDeviceRequest> {
  id: number;
}

export interface FaceDeviceResponse {
  data: FaceDevice[];
  success: boolean;
  message: string;
}

export interface SingleFaceDeviceResponse {
  data: FaceDevice;
  success: boolean;
  message: string;
}

export interface FaceDeviceFilters {
  name?: string;
  type?: 'enter' | 'exit' | '';
  status?: 'active' | 'not_active' | '';
}

export interface FaceDeviceFormData {
  name: string;
  type: 'enter' | 'exit' | '';
  status: 'active' | 'not_active';
  ip: string;
  port: string;
  username: string;
  password: string;
}

export interface MetaData {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    links: {
        next: string | null;
        previous: string | null;
    };
}