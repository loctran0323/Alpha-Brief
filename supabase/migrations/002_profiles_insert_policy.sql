-- Allow users to insert their own profile row if the signup trigger did not run.

create policy "Users insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);
