create table if not exists public.app_data (
  id text primary key,
  data jsonb
);

-- Habilitar acceso anónimo público sin RLS (solo para esta demo)
alter table public.app_data disable row level security;
