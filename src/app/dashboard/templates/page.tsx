'use client';

import { WEBSITE_TEMPLATES } from '@shared/constants';

export default function TemplatesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-bold">Templates</h1>
        <p className="text-sm text-zinc-500 mt-1">Choose a template or let AI create a custom design</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {WEBSITE_TEMPLATES.map((t) => (
          <div key={t.id} className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition group cursor-pointer">
            <div className="text-4xl mb-4">{t.icon}</div>
            <h3 className="font-semibold group-hover:text-primary transition">{t.name}</h3>
            <p className="text-sm text-zinc-500 mt-2">{t.preview}</p>
            <div className="mt-4">
              <span className="px-3 py-1 bg-surface text-xs text-zinc-400 rounded-full">{t.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
