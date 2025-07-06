'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function CompaniesPage() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t.companies.title}</h1>
      <p className="text-gray-600">{t.companies.subtitle}</p>
    </div>
  );
}