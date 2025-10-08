-- Create storage bucket for voting images
insert into storage.buckets (id, name, public)
values ('voting-images', 'voting-images', true);

-- Create users table to track voters
create table public.voters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now()
);

alter table public.voters enable row level security;

create policy "Anyone can view voters"
  on public.voters for select
  using (true);

create policy "Anyone can insert voters"
  on public.voters for insert
  with check (true);

-- Create images table
create table public.voting_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  uploaded_at timestamp with time zone default now(),
  vote_count integer default 0
);

alter table public.voting_images enable row level security;

create policy "Anyone can view images"
  on public.voting_images for select
  using (true);

create policy "Anyone can insert images"
  on public.voting_images for insert
  with check (true);

create policy "Anyone can update images"
  on public.voting_images for update
  using (true);

-- Create votes table to track who voted for what
create table public.votes (
  id uuid primary key default gen_random_uuid(),
  voter_id uuid references public.voters(id) on delete cascade not null,
  image_id uuid references public.voting_images(id) on delete cascade not null,
  voted_at timestamp with time zone default now(),
  unique(voter_id, image_id)
);

alter table public.votes enable row level security;

create policy "Anyone can view votes"
  on public.votes for select
  using (true);

create policy "Anyone can insert votes"
  on public.votes for insert
  with check (true);

-- Create function to increment vote count
create or replace function public.increment_vote_count(image_uuid uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.voting_images
  set vote_count = vote_count + 1
  where id = image_uuid;
end;
$$;

-- Storage policies for voting images
create policy "Anyone can view voting images"
  on storage.objects for select
  using (bucket_id = 'voting-images');

create policy "Anyone can upload voting images"
  on storage.objects for insert
  with check (bucket_id = 'voting-images');

-- Enable realtime for tables
alter publication supabase_realtime add table voting_images;
alter publication supabase_realtime add table votes;