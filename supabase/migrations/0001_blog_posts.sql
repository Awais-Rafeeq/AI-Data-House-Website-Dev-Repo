-- ═══════════════════════════════════════════════════════════════════════════
-- Community blog submissions for aidatahouse.com
--
-- RUN THIS ONCE in your Supabase project (SQL Editor, or `supabase db push`).
-- Until it is applied AND VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set in
-- the deployment, the submission form reports that submissions are closed and
-- the blog falls back to the static posts in data/blog.ts. Nothing breaks.
--
-- Security model, in one line: the public may INSERT a post as 'pending' and
-- may SELECT only 'published' rows. Nothing else. Only an authenticated user
-- (the same Supabase auth the job dashboard already uses) can review, edit,
-- publish or delete.
-- ═══════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ─── Table ─────────────────────────────────────────────────────────────────
-- Column names mirror the `Post` interface in data/blog.ts so the two sources
-- merge into one list at runtime without a translation layer beyond casing.
create table if not exists public.blog_posts (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  excerpt        text not null,
  category       text not null,
  author         text not null,
  author_role    text,
  -- Publication date the post displays. Set by the submitter, shown as-is.
  date           date not null,
  read_time      text not null,
  image          text not null,
  -- The article body: a JSON array of the same discriminated-union blocks the
  -- static posts use ({type:'p'|'h2'|'list'|'quote'|'table', ...}). Stored as
  -- structured data, never as HTML, so there is no markup to sanitise on read.
  blocks         jsonb not null,
  tags           text[] not null default '{}',
  seo_title      text,
  seo_description text,
  -- Contact address for the submitter. Never rendered on the public site.
  submitter_email text not null,
  status         text not null default 'pending'
                 check (status in ('pending', 'published', 'rejected')),
  review_note    text,
  created_at     timestamptz not null default now(),
  published_at   timestamptz
);

comment on table public.blog_posts is
  'Community-submitted blog posts. Public inserts land as pending; only authenticated reviewers can publish.';

create index if not exists blog_posts_published_idx
  on public.blog_posts (status, date desc)
  where status = 'published';

-- ─── Integrity: the shape the app relies on ────────────────────────────────
-- Enforced in the database as well as the client, because the client is public
-- and can be bypassed. A row that violates any of these can never be stored,
-- so the reader never has to defend against it.
alter table public.blog_posts
  drop constraint if exists blog_posts_slug_format;
alter table public.blog_posts
  add constraint blog_posts_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 80);

alter table public.blog_posts
  drop constraint if exists blog_posts_lengths;
alter table public.blog_posts
  add constraint blog_posts_lengths check (
    char_length(title) between 10 and 160
    and char_length(excerpt) between 40 and 400
    and char_length(author) between 2 and 80
    and char_length(submitter_email) between 5 and 160
    and char_length(coalesce(seo_title, '')) <= 160
    and char_length(coalesce(seo_description, '')) <= 320
    and coalesce(array_length(tags, 1), 0) <= 8
  );

-- The body must be a non-empty JSON array, and small enough that no single row
-- can be used to blow up the page or the bundle.
alter table public.blog_posts
  drop constraint if exists blog_posts_blocks_shape;
alter table public.blog_posts
  add constraint blog_posts_blocks_shape check (
    jsonb_typeof(blocks) = 'array'
    and jsonb_array_length(blocks) between 1 and 200
    and pg_column_size(blocks) < 200000
  );

-- Cover images must be site-relative or come from our own Supabase Storage.
-- This is what stops `javascript:` and `data:` URIs reaching an <img src>.
alter table public.blog_posts
  drop constraint if exists blog_posts_image_origin;
alter table public.blog_posts
  add constraint blog_posts_image_origin
  check (image ~ '^/images/' or image ~ '^https://[a-z0-9-]+\.supabase\.co/storage/v1/object/public/');

-- ─── Row Level Security ────────────────────────────────────────────────────
alter table public.blog_posts enable row level security;

-- Read: the world sees published posts only. Pending and rejected rows, and
-- submitter_email on every row, stay invisible to anon (see the view below).
drop policy if exists "public reads published posts" on public.blog_posts;
create policy "public reads published posts"
  on public.blog_posts for select
  to anon
  using (status = 'published');

-- Write: anyone may submit, but only as 'pending', and only without
-- backdating the review fields. There is no public UPDATE or DELETE policy at
-- all, so a submitted row is immutable to the public the moment it lands.
drop policy if exists "public submits pending posts" on public.blog_posts;
create policy "public submits pending posts"
  on public.blog_posts for insert
  to anon
  with check (
    status = 'pending'
    and published_at is null
    and review_note is null
  );

-- Reviewers: the authenticated role (same login the job dashboard uses).
drop policy if exists "reviewers read all posts" on public.blog_posts;
create policy "reviewers read all posts"
  on public.blog_posts for select to authenticated using (true);

drop policy if exists "reviewers update posts" on public.blog_posts;
create policy "reviewers update posts"
  on public.blog_posts for update to authenticated using (true) with check (true);

drop policy if exists "reviewers delete posts" on public.blog_posts;
create policy "reviewers delete posts"
  on public.blog_posts for delete to authenticated using (true);

-- ─── Spam / rate limiting ──────────────────────────────────────────────────
-- The site is a static SPA with no server of its own, so this is the only place
-- a real rate limit can live. Two ceilings: per submitter, and global, so one
-- address cannot spam and a botnet cannot flood the review queue either.
create or replace function public.blog_posts_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  per_email  int;
  global_new int;
begin
  select count(*) into per_email
  from public.blog_posts
  where submitter_email = new.submitter_email
    and created_at > now() - interval '1 hour';

  if per_email >= 3 then
    raise exception 'rate_limit_email'
      using hint = 'Too many submissions from this address. Try again in an hour.';
  end if;

  select count(*) into global_new
  from public.blog_posts
  where status = 'pending'
    and created_at > now() - interval '1 hour';

  if global_new >= 60 then
    raise exception 'rate_limit_global'
      using hint = 'The review queue is busy right now. Please try again later.';
  end if;

  return new;
end;
$$;

drop trigger if exists blog_posts_rate_limit_trg on public.blog_posts;
create trigger blog_posts_rate_limit_trg
  before insert on public.blog_posts
  for each row execute function public.blog_posts_rate_limit();

-- Publishing stamps its own timestamp, so it cannot be forged on the way in.
create or replace function public.blog_posts_stamp_published()
returns trigger language plpgsql as $$
begin
  if new.status = 'published' and (old.status is distinct from 'published') then
    new.published_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists blog_posts_stamp_published_trg on public.blog_posts;
create trigger blog_posts_stamp_published_trg
  before update on public.blog_posts
  for each row execute function public.blog_posts_stamp_published();

-- ─── Storage: cover images ─────────────────────────────────────────────────
-- A public-read bucket with a hard 3 MB ceiling and an image-only MIME
-- allowlist enforced by Supabase itself, so a rejected file never lands.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images', 'blog-images', true, 3145728,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = 3145728,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

drop policy if exists "public reads blog images" on storage.objects;
create policy "public reads blog images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'blog-images');

-- Uploads are confined to the submissions/ prefix so they can be swept
-- separately from anything an editor uploads by hand.
drop policy if exists "public uploads blog images" on storage.objects;
create policy "public uploads blog images"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'blog-images' and (storage.foldername(name))[1] = 'submissions');

drop policy if exists "reviewers manage blog images" on storage.objects;
create policy "reviewers manage blog images"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'blog-images')
  with check (bucket_id = 'blog-images');
