-- ──────────────────────────────────────────────────────────────────
-- Football IQ · esquema de Supabase
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase.
-- Con esto, el progreso del coach se sincroniza en la nube y entre
-- dispositivos. Sin Supabase configurado, la app usa el modo demo local.
-- ──────────────────────────────────────────────────────────────────

-- Progreso por usuario (1 fila por usuario)
create table if not exists public.progress (
  user_id              uuid primary key references auth.users on delete cascade,
  display_name         text,
  xp                   integer not null default 0,
  level                integer not null default 1,
  streak               integer not null default 0,
  quizzes_completed    integer not null default 0,
  scenarios_completed  integer not null default 0,
  modules_completed    integer not null default 0,
  tactics_saved        integer not null default 0,
  perfect_quizzes      integer not null default 0,
  is_premium           boolean not null default false,
  last_active_day      text,
  completed_module_ids text[]  not null default '{}',
  updated_at           timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Cada usuario solo lee/escribe SU fila
create policy "progress_select_own"
  on public.progress for select using (auth.uid() = user_id);
create policy "progress_insert_own"
  on public.progress for insert with check (auth.uid() = user_id);
create policy "progress_update_own"
  on public.progress for update using (auth.uid() = user_id);

-- Tácticas guardadas (opcional: para sincronizar la galería)
create table if not exists public.tactics (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  name        text not null,
  formation   text not null,
  data        jsonb not null,          -- { players, arrows, frames, showAway }
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.tactics enable row level security;
create policy "tactics_all_own"
  on public.tactics for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────────────
-- Leaderboard global (solo nombre + xp + nivel, nada sensible)
-- Función RPC con security definer para exponer el top sin filtrar RLS.
-- ──────────────────────────────────────────────────────────────────
create or replace function public.leaderboard(limit_count integer default 50)
returns table (display_name text, xp integer, level integer)
language sql
security definer
set search_path = public
as $$
  select coalesce(display_name, 'Coach') as display_name, xp, level
  from public.progress
  order by xp desc
  limit limit_count;
$$;

grant execute on function public.leaderboard(integer) to anon, authenticated;
