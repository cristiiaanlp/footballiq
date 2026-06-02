"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GLOSSARY } from "@/data/glossary";

export default function GlossaryPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return GLOSSARY;
    return GLOSSARY.filter(
      (g) =>
        g.term.toLowerCase().includes(term) ||
        g.short.toLowerCase().includes(term) ||
        g.def.toLowerCase().includes(term) ||
        g.category.toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <div>
      <PageHeader
        badge={<Badge tone="sky"><BookOpen className="h-3.5 w-3.5" /> Glosario</Badge>}
        title="Glosario táctico"
        subtitle="Los conceptos clave del fútbol, explicados en una línea."
      />

      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Busca un término…"
          className="h-11 w-full rounded-xl border border-white/10 bg-ink-800/60 pl-10 pr-4 text-sm text-chalk placeholder:text-muted focus:border-pitch/50 focus:outline-none focus:ring-2 focus:ring-pitch/30"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((g) => (
          <Card key={g.term} className="p-4">
            <div className="mb-1 flex items-center justify-between gap-2">
              <h3 className="font-bold">{g.term}</h3>
              <Badge tone="neutral">{g.category}</Badge>
            </div>
            <p className="text-xs font-medium text-pitch-light">{g.short}</p>
            <p className="mt-1.5 text-sm text-haze">{g.def}</p>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted">
          Sin resultados para “{q}”.
        </p>
      )}
    </div>
  );
}
