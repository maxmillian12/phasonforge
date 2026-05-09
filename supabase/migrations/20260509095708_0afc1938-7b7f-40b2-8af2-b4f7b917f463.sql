drop policy if exists "Anyone can submit contact messages" on public.contact_messages;

create policy "Anyone can submit valid contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (
    length(trim(name)) between 1 and 100
    and length(trim(subject)) between 1 and 200
    and length(trim(message)) between 1 and 2000
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and (phone is null or length(phone) <= 40)
    and status = 'new'
  );