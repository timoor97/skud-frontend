'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { FC } from 'react';
import { Globe } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    // SelectValue,
} from "@/components/ui/select";

const languages = [
    { name: 'English', value: 'en' },
    { name: 'Русский', value: 'ru' },
    { name: 'O\'zbekcha', value: 'uz' }
];

const LanguageSwitcher: FC = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleChange = (newLocale: string) => {
        if (newLocale !== locale) {
            router.push({ pathname }, { locale: newLocale });
        }
    };

    const currentLanguage = languages.find(lang => lang.value === locale);

    return (
        <Select value={locale} onValueChange={handleChange}>
            <SelectTrigger className="w-[140px] h-9 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border rounded-lg shadow-sm transition-all duration-200">
                <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">
                        {currentLanguage?.name}
                    </span>
                </div>
            </SelectTrigger>
            <SelectContent className="bg-background border border-border rounded-lg shadow-lg">
                {languages.map((lang) => (
                    <SelectItem 
                        key={lang.value} 
                        value={lang.value}
                        className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    >
                        <span className="font-medium">{lang.name}</span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default LanguageSwitcher;
