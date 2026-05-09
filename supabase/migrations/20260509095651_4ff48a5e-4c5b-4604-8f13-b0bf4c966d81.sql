create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 100),
  email text not null check (length(email) between 3 and 255),
  phone text check (phone is null or length(phone) <= 40),
  subject text not null check (length(subject) between 1 and 200),
  message text not null check (length(message) between 1 and 2000),
  user_agent text,
  status text not null default 'new' check (status in ('new','read','archived')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Anyone (including unauthenticated visitors) may submit a message.
create policy "Anyone can submit contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated admins (via has_role) may read or update messages.
create policy "Admins can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update contact messages"
  on public.contact_messages
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create index contact_messages_created_at_idx
  on public.contact_messages (created_at desc);