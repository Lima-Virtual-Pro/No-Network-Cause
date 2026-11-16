-- Índices UNIQUE não parciais para o on_conflict do PostgREST.
drop index if exists public.noc_diagnostics_user_client_event_uidx;
create unique index if not exists noc_diagnostics_user_client_event_uidx
  on public.noc_diagnostics(user_id, client_event_id);
drop index if exists public.noc_events_user_client_event_uidx;
create unique index if not exists noc_events_user_client_event_uidx
  on public.noc_events(user_id, client_event_id);
