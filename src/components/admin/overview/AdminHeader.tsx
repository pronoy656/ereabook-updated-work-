'use client';

import React from 'react';
import { useTranslations } from "next-intl";

export function AdminHeader() {
  const t = useTranslations("admin_overview");

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">
          {t("admin_dashboard")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">{t("dashboard_subtitle")}</p>
      </div>
    </div>
  );
}
