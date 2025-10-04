import { z } from "zod"

export const setPushUrlSchema = z.object({
  url: z.string().min(1, "URL is required"),
  protocol_type: z.enum(['HTTP', 'HTTPS']),
  addressing_format_type: z.enum(['hostname', 'ipaddress']),
  host_name: z.string().min(1, "Host name is required"),
  port_no: z.string().min(1, "Port number is required").regex(/^\d+$/, "Port must be a number")
})
