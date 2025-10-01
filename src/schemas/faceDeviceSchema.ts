import { z } from "zod";

export const faceDeviceSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(255, "Name must be at most 255 characters"),
  type: z.enum(['enter', 'exit'], {
    message: "Type must be either 'enter' or 'exit'"
  }),
  status: z.enum(['active', 'not_active'], {
    message: "Status must be either 'active' or 'not_active'"
  }),
  ip: z.string()
    .min(1, "IP address is required")
    .regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, "Invalid IP address format"),
  port: z.string()
    .min(1, "Port is required")
    .regex(/^\d+$/, "Port must contain only digits")
    .refine((val) => {
      const portNum = parseInt(val);
      return portNum >= 1 && portNum <= 65535;
    }, "Port must be between 1 and 65535"),
  username: z.string()
    .min(1, "Username is required")
    .max(255, "Username must be at most 255 characters"),
  password: z.string()
    .min(1, "Password is required")
    .max(255, "Password must be at most 255 characters")
});

export const faceDeviceUpdateSchema = faceDeviceSchema.partial().extend({
  id: z.number().positive("ID must be a positive number")
});

export type FaceDeviceFormData = z.infer<typeof faceDeviceSchema>;
export type FaceDeviceUpdateData = z.infer<typeof faceDeviceUpdateSchema>;
