import { z } from 'zod';

type TranslationFunction = (key: string) => string;

export const changePasswordSchema = (t: TranslationFunction) => z.object({
  password: z.string()
    .min(6, t('errors.passwordMinLength'))
    .max(255, t('errors.passwordMaxLength')),

  password_confirmation: z.string(),
}).refine((data) => {
  // Password confirmation must match password
  return data.password === data.password_confirmation;
}, {
  message: t('errors.passwordMismatch'),
  path: ['password_confirmation'],
});

export type ChangePasswordSchema = z.infer<ReturnType<typeof changePasswordSchema>>;
