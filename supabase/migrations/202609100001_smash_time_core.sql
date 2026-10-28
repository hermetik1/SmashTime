-- SmashTime core schema
-- The migration is intentionally ticketing-agnostic. Ticket checkout is handled by an external provider.

create extension if not exists "pgcrypto";

create type public.event_status as enum ('draft', 'announced', 'published', 'completed', 'cancelled');
create type public.profile_status as enum ('pending', 'approved', 'paused', 'blocked', 'archived');
create type public.application_status as enum ('draft', 'submitted', 'review', 'needs_info', 'accepted', 'rejected', 'withdrawn');
create type public.fight_status as enum ('draft', 'scheduled', 'confirmed', 'cancelled', 'result_published');
create type public.result_type as enum ('win', 'loss', 'draw', 'no_contest', 'stoppage', 'disqualification');

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in ('superadmin', 'admin', 'matchmaker', 'editor', 'event_staff', 'fighter')),
  label text not null,
  created_at timestamptz not null default now()
);

insert into public.roles (key, label) values
  ('superadmin', 'Superadmin'), ('admin', 'Admin'), ('matchmaker', 'Matchmaker'),
  ('editor', 'Editor'), ('event_staff', 'Event-Staff'), ('fighter', 'Kämpfer:in')
on conflict (key) do nothing;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  first_name text,
  last_name text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table public.gyms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  country_code text default 'AT',
  website_url text,
  created_at timestamptz not null default now()
);

create table public.fighter_profiles (
  id uuid primary key default gen_random_uuid(),
  account_user_id uuid unique references public.profiles(id) on delete set null,
  first_name text not null,
  last_name text not null,
  nickname text,
  slug text not null unique,
  origin_country_code text,
  origin_city text,
  gym_id uuid references public.gyms(id) on delete set null,
  profile_image_path text,
  discipline text,
  weight_class text,
  birth_date date,
  height_cm integer check (height_cm is null or height_cm between 100 and 250),
  wins integer not null default 0 check (wins >= 0),
  losses integer not null default 0 check (losses >= 0),
  draws integer not null default 0 check (draws >= 0),
  profile_status public.profile_status not null default 'pending',
  public_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.disciplines (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.weight_classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  discipline_id uuid references public.disciplines(id) on delete set null,
  max_weight_kg numeric(6,2),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address_line text,
  postal_code text,
  city text,
  country_code text default 'AT',
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  event_type text,
  description text,
  starts_at timestamptz not null,
  doors_open_at timestamptz,
  venue_id uuid references public.venues(id) on delete set null,
  status public.event_status not null default 'draft',
  poster_path text,
  hero_image_path text,
  external_ticket_url text,
  applications_open boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_applications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  fighter_id uuid not null references public.fighter_profiles(id) on delete cascade,
  requested_discipline_id uuid references public.disciplines(id) on delete set null,
  requested_weight_class_id uuid references public.weight_classes(id) on delete set null,
  availability_notes text,
  additional_information text,
  status public.application_status not null default 'draft',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, fighter_id)
);

create table public.fight_cards (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null unique references public.events(id) on delete cascade,
  status public.fight_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fights (
  id uuid primary key default gen_random_uuid(),
  fight_card_id uuid not null references public.fight_cards(id) on delete cascade,
  display_order integer not null check (display_order > 0),
  fighter_one_id uuid references public.fighter_profiles(id) on delete set null,
  fighter_two_id uuid references public.fighter_profiles(id) on delete set null,
  discipline_id uuid references public.disciplines(id) on delete set null,
  weight_class_id uuid references public.weight_classes(id) on delete set null,
  fight_type text,
  rounds smallint check (rounds is null or rounds between 1 and 15),
  round_duration_seconds smallint check (round_duration_seconds is null or round_duration_seconds between 30 and 600),
  is_title_fight boolean not null default false,
  status public.fight_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (fight_card_id, display_order)
);

create table public.fight_results (
  id uuid primary key default gen_random_uuid(),
  fight_id uuid not null unique references public.fights(id) on delete cascade,
  winner_fighter_id uuid references public.fighter_profiles(id) on delete set null,
  result_type public.result_type not null,
  method text,
  round smallint,
  notes text,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_value jsonb,
  after_value jsonb,
  created_at timestamptz not null default now()
);

create index fighter_profiles_status_idx on public.fighter_profiles(profile_status, public_visible);
create index events_status_starts_at_idx on public.events(status, starts_at);
create index applications_event_status_idx on public.event_applications(event_id, status);
create index fights_card_order_idx on public.fights(fight_card_id, display_order);
create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);

-- Every table in the exposed public schema is protected by RLS.
alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.gyms enable row level security;
alter table public.fighter_profiles enable row level security;
alter table public.disciplines enable row level security;
alter table public.weight_classes enable row level security;
alter table public.venues enable row level security;
alter table public.events enable row level security;
alter table public.event_applications enable row level security;
alter table public.fight_cards enable row level security;
alter table public.fights enable row level security;
alter table public.fight_results enable row level security;
alter table public.audit_logs enable row level security;

-- Public read model: only explicitly published content is exposed.
create policy "published events are public" on public.events for select to anon, authenticated using (status = 'published');
create policy "published fighter profiles are public" on public.fighter_profiles for select to anon, authenticated using (profile_status = 'approved' and public_visible = true);
create policy "published fight cards are public" on public.fight_cards for select to anon, authenticated using (exists (select 1 from public.events e where e.id = event_id and e.status = 'published'));
create policy "published fights are public" on public.fights for select to anon, authenticated using (exists (select 1 from public.fight_cards fc join public.events e on e.id = fc.event_id where fc.id = fight_card_id and e.status = 'published' and fc.status in ('scheduled', 'confirmed', 'result_published')));
create policy "published results are public" on public.fight_results for select to anon, authenticated using (published_at is not null);
create policy "active disciplines are readable" on public.disciplines for select to anon, authenticated using (is_active = true);
create policy "active weight classes are readable" on public.weight_classes for select to anon, authenticated using (is_active = true);
create policy "venues are readable" on public.venues for select to anon, authenticated using (true);
create policy "gyms are readable" on public.gyms for select to anon, authenticated using (true);

-- A fighter may read and update their own profile; operational roles can manage it server-side.
create policy "fighters can read own profile" on public.fighter_profiles for select to authenticated using (account_user_id = (select auth.uid()));
create policy "fighters can update own profile" on public.fighter_profiles for update to authenticated using (account_user_id = (select auth.uid())) with check (account_user_id = (select auth.uid()));
create policy "users can read own profile" on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "users can update own profile" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "fighters can manage own applications" on public.event_applications for all to authenticated using (exists (select 1 from public.fighter_profiles fp where fp.id = fighter_id and fp.account_user_id = (select auth.uid()))) with check (exists (select 1 from public.fighter_profiles fp where fp.id = fighter_id and fp.account_user_id = (select auth.uid())));

-- The first admin policies are intentionally explicit and server-auditable.
create policy "admins can manage events" on public.events for all to authenticated using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker'))) with check (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker')));
create policy "admins can manage fight cards" on public.fight_cards for all to authenticated using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker'))) with check (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker')));
create policy "admins can manage fights" on public.fights for all to authenticated using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker'))) with check (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker')));
create policy "admins can manage fighter profiles" on public.fighter_profiles for all to authenticated using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker'))) with check (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker')));
create policy "admins can manage disciplines" on public.disciplines for all to authenticated using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'editor'))) with check (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'editor')));
create policy "admins can manage weight classes" on public.weight_classes for all to authenticated using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker'))) with check (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker')));
create policy "admins can manage gyms" on public.gyms for all to authenticated using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker'))) with check (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker')));
create policy "admins can manage venues" on public.venues for all to authenticated using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker'))) with check (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker')));
create policy "admins can review applications" on public.event_applications for select to authenticated using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin', 'matchmaker')));
create policy "admins can write audit logs" on public.audit_logs for insert to authenticated with check (actor_user_id = (select auth.uid()));
create policy "admins can read audit logs" on public.audit_logs for select to authenticated using (exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id where ur.user_id = (select auth.uid()) and r.key in ('superadmin', 'admin')));

grant select on public.events, public.fighter_profiles, public.fight_cards, public.fights, public.fight_results to anon;
grant select on public.disciplines, public.weight_classes, public.gyms, public.venues to anon, authenticated;
grant select on public.events, public.fighter_profiles, public.fight_cards, public.fights, public.fight_results, public.profiles to authenticated;
grant select, insert, update, delete on public.event_applications to authenticated;
grant insert, update, delete on public.disciplines, public.weight_classes, public.gyms, public.venues to authenticated;
