import { z } from 'zod';

type TranslationFunction = (key: string) => string;

export const userSchema = (t: TranslationFunction) => z.object({
  first_name: z.string()
    .min(1, t('errors.requiredField'))
    .max(255, t('errors.firstNameMaxLength')),

  last_name: z.string()
    .max(255, t('errors.lastNameMaxLength'))
    .optional(),

  phone: z.string()
    .max(20, t('errors.phoneMaxLength'))
    .optional(),

  card_number: z.string()
    .optional()
    .refine((val) => !val || /^\d+$/.test(val), {
      message: t('errors.cardNumberDigits')
    })
    .refine((val) => !val || val.length <= 20, {
      message: t('errors.cardNumberMaxLength')
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
      message: t('errors.imageFormat')
    }),
});

export type UserSchema = z.infer<ReturnType<typeof userSchema>>;
