import { z } from 'zod';

type TranslationFunction = (key: string) => string;

export const securitySchema = (t: TranslationFunction) => z.object({
  login: z.string()
    .max(255, t('errors.usernameMaxLength'))
    .optional()
    .or(z.literal('')),

  password: z.string()
    .min(6, t('errors.passwordMinLength'))
    .max(255, t('errors.passwordMaxLength'))
    .optional()
    .or(z.literal('')),

  password_confirmation: z.string().optional().or(z.literal('')),

  can_login: z.boolean().optional(),

  role_id: z.number().optional(),
}).refine((data) => {
  // Password confirmation must match password only if password is provided
  if (data.password && data.password.length > 0) {
    return data.password === data.password_confirmation;
  }
  return true;
}, {
  message: t('errors.passwordMismatch'),
  path: ['password_confirmation'],
}).refine((data) => {
  // Password must be at least 6 characters if provided
  if (data.password && data.password.length > 0) {
    return data.password.length >= 6;
  }
  return true;
}, {
  message: t('errors.passwordMinLength'),
  path: ['password'],
});

export type SecuritySchema = z.infer<ReturnType<typeof securitySchema>>;
