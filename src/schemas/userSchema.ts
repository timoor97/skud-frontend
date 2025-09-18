import { z } from 'zod';

type TranslationFunction = (key: string) => string;

export const userSchema = (t: TranslationFunction) => z.object({
  first_name: z.string()
    .min(1, t('errors.requiredField'))
    .max(255, 'First name must be at most 255 characters'),

  last_name: z.string()
    .max(255, 'Last name must be at most 255 characters')
    .optional(),

  login: z.string()
    .min(1, t('errors.requiredField'))
    .max(255, 'Login must be at most 255 characters'),

  phone: z.string()
    .max(20, 'Phone number must be at most 20 characters')
    .optional(),

  role_id: z.string()
    .min(1, t('errors.requiredField')),

  password: z.string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: 'Password must be at least 6 characters'
    })
    .refine((val) => !val || val.length <= 255, {
      message: 'Password must be at most 255 characters'
    }),

  status: z.boolean().optional(),

  image: z.any()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val) return true; // Allow null/undefined
      if (typeof val === 'string') return true; // Allow string URLs
      if (val instanceof File) {
        // Validate file type
        if (!val.type.match(/^image\/(jpeg|png)$/)) {
          return false;
        }
        // Validate file size (1MB = 1024KB)
        if (val.size > 1024 * 1024) {
          return false;
        }
        return true;
      }
      return false;
    }, {
      message: 'Image must be a JPEG or PNG file under 1MB'
    }),
});

export type UserSchema = z.infer<ReturnType<typeof userSchema>>;
