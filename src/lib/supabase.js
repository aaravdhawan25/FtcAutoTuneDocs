import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

/*
  Setup (one-time, ~2 minutes):

  1. Create a free project at https://supabase.com
  2. In the SQL editor run:

      create table comments (
        id          uuid        default gen_random_uuid() primary key,
        name        text        not null,
        message     text        not null,
        rating      integer     not null check (rating >= 1 and rating <= 5),
        created_at  timestamptz default now()
      );

      alter table comments enable row level security;
      create policy "public read"   on comments for select using (true);
      create policy "public insert" on comments for insert with check (true);

  3. Add these env vars to your Vercel project settings:
       VITE_SUPABASE_URL  = https://<your-project>.supabase.co
       VITE_SUPABASE_ANON_KEY = <your anon/public key>

  While env vars are missing the widget is hidden (no errors, no crashes).
*/
export const supabase = url && key ? createClient(url, key) : null
