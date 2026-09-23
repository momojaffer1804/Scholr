import * as React from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6">
      {eyebrow && (
        <p className="text-xs font-bold tracking-widest uppercase text-purple-700 dark:text-purple-400 mb-2">
          {eyebrow}
        </p>
      )}
      <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </header>
  );
}
