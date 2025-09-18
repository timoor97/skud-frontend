import { z } from 'zod';

type TranslationFunction = (key: string) => string;

export const loginSchema = (t: TranslationFunction) => z.object({
  login: z.string()
    .nonempty(t('errors.requiredField')),

  password: z.string()
    .nonempty(t('errors.requiredField')),
});

export type LoginSchema = z.infer<ReturnType<typeof loginSchema>>;
