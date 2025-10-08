-- Fix security issue: Set search_path for the function
drop function if exists public.increment_vote_count(uuid);

create or replace function public.increment_vote_count(image_uuid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.voting_images
  set vote_count = vote_count + 1
  where id = image_uuid;
end;
$$;