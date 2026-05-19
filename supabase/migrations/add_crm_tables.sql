-- CRM: clients, works, tasks

create table if not exists crm_clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table if not exists crm_works (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references crm_clients(id) on delete cascade not null,
  title text not null,
  deadline date,
  done boolean default false,
  created_at timestamptz default now()
);

create table if not exists crm_tasks (
  id uuid primary key default gen_random_uuid(),
  work_id uuid references crm_works(id) on delete cascade not null,
  title text not null,
  done boolean default false,
  created_at timestamptz default now()
);
