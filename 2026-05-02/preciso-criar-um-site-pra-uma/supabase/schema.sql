create extension if not exists pgcrypto;

create table if not exists public.products (
  id text primary key,
  title text not null,
  category text not null,
  description text,
  price_cents integer not null check (price_cents > 0),
  image_path text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired', 'canceled')),
  items jsonb not null,
  amount_subtotal_cents integer not null check (amount_subtotal_cents >= 0),
  delivery_fee_cents integer not null default 0 check (delivery_fee_cents >= 0),
  amount_total_cents integer not null check (amount_total_cents >= 0),
  stripe_session_id text,
  stripe_payment_intent text,
  customer_email text,
  customer_phone text,
  shipping_details jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (active = true);

insert into public.products (id, title, category, description, price_cents, image_path, active)
values
  ('narguile', 'Narguile Completo', 'Narguile', 'Kit pronto para a sessao.', 8990, 'assets/product-narguile.jpg', true),
  ('longneck', 'Bebida Long Neck', 'Bebidas', 'Gelada e pronta para sair.', 1250, 'assets/product-longneck.jpg', true),
  ('dose', 'Dose Promocional', 'Doses', 'Dose da casa para pedido rapido.', 1800, 'assets/product-dose.jpg', true),
  ('copao', 'Copao + Refri', 'Copao', 'Combo pratico para fechar a noite.', 2990, 'assets/product-copao.jpg', true)
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  description = excluded.description,
  price_cents = excluded.price_cents,
  image_path = excluded.image_path,
  active = excluded.active;
