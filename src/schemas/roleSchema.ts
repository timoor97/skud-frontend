import { z } from 'zod'

type TranslationFunction = (key: string) => string;

export const roleSchema = (t: TranslationFunction) => z.object({
    name: z.object({
        uz: z.string().optional(),
        ru: z.string().optional(),
        en: z.string().optional()
    }).refine(
        (data) => {
            return data.uz || data.ru || data.en;
        },
        {
            message: t('errors.requiredField'),
            path: ['name']
        }
    ),
    description: z.object({
        uz: z.string().optional(),
        ru: z.string().optional(),
        en: z.string().optional()
    }).optional(),
    permissions: z.array(z.number()).default([]),
    key: z.string().min(1, t('errors.requiredField'))
})

export type RoleSchema = z.infer<ReturnType<typeof roleSchema>>
