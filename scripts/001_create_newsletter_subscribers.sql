-- Create newsletter_subscribers table
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  first_name text not null,
  email text not null,
  preferences text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'pending', 'unsubscribed')),
  source text not null default 'unknown',
  unsubscribed_at timestamptz,
  ip text,
  token text unique
);

-- Unique email index (case-insensitive)
create unique index if not exists newsletter_subscribers_email_idx on newsletter_subscribers (lower(email));

-- Auto-update updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop existing trigger if exists and recreate
drop trigger if exists newsletter_updated_at on newsletter_subscribers;

create trigger newsletter_updated_at
  before update on newsletter_subscribers
  for each row execute function update_updated_at();
