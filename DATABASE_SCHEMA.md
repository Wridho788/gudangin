# Gudangin Database Schema & RPC Functions

This document outlines the required database schema and RPC functions for Gudangin ERP system.

## Database Tables

### 1. user_profiles
```sql
create table user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'staff')),
  full_name text not null,
  created_at timestamptz default now()
);

-- RLS Policies
alter table user_profiles enable row level security;

create policy "Users can view all profiles"
  on user_profiles for select
  using (true);

create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = user_id);
```

### 2. products
```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text unique not null,
  stock integer not null default 0 check (stock >= 0),
  min_stock integer not null default 10,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies
alter table products enable row level security;

create policy "Everyone can view products"
  on products for select
  using (true);

-- Only owner/admin can modify (via RPC)
```

### 3. orders
```sql
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  status text not null check (status in ('draft','submitted','approved','rejected','completed')),
  created_by uuid references auth.users(id) not null,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies
alter table orders enable row level security;

create policy "Users can view all orders"
  on orders for select
  using (true);

-- Modifications via RPC only
```

### 4. order_items
```sql
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  qty integer not null check (qty > 0),
  created_at timestamptz default now()
);

-- RLS Policies
alter table order_items enable row level security;

create policy "Users can view all order items"
  on order_items for select
  using (true);
```

### 5. stock_mutations
```sql
create table stock_mutations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) not null,
  source_type text not null check (source_type in ('order','adjustment','opname')),
  source_id uuid,
  qty_before integer not null,
  qty_change integer not null,
  qty_after integer not null,
  actor_id uuid references auth.users(id) not null,
  reason text,
  created_at timestamptz default now()
);

-- RLS Policies
alter table stock_mutations enable row level security;

create policy "Users can view stock mutations"
  on stock_mutations for select
  using (true);
```

### 6. activity_logs
```sql
create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) not null,
  actor_role text not null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz default now()
);

-- RLS Policies
alter table activity_logs enable row level security;

create policy "Users can view activity logs"
  on activity_logs for select
  using (true);
```

## Database Views

### v_orders
```sql
create or replace view v_orders as
select
  o.id,
  o.order_number,
  o.status,
  o.created_by,
  p.full_name as created_by_name,
  o.approved_by,
  o.approved_at,
  o.completed_at,
  o.notes,
  o.created_at,
  o.updated_at,
  (
    select json_agg(
      json_build_object(
        'id', oi.id,
        'product_id', oi.product_id,
        'product_name', pr.name,
        'qty', oi.qty,
        'created_at', oi.created_at
      )
    )
    from order_items oi
    join products pr on pr.id = oi.product_id
    where oi.order_id = o.id
  ) as items
from orders o
left join user_profiles p on p.user_id = o.created_by
order by o.created_at desc;
```

### v_products
```sql
create or replace view v_products as
select
  id,
  name,
  sku,
  stock,
  min_stock,
  (stock <= min_stock) as is_low_stock,
  created_at,
  updated_at
from products
order by name;
```

### v_stock_ledger
```sql
create or replace view v_stock_ledger as
select
  sm.id,
  sm.product_id,
  p.name as product_name,
  sm.source_type,
  sm.source_id,
  sm.qty_before,
  sm.qty_change,
  sm.qty_after,
  sm.actor_id,
  up.full_name as actor_name,
  sm.reason,
  sm.created_at
from stock_mutations sm
join products p on p.id = sm.product_id
left join user_profiles up on up.user_id = sm.actor_id
order by sm.created_at desc;
```

## RPC Functions

### 1. create_order
```sql
create or replace function create_order(
  p_items jsonb
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_item record;
begin
  -- Generate order number
  v_order_number := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::text, 4, '0');

  -- Create order
  insert into orders (order_number, status, created_by)
  values (v_order_number, 'draft', auth.uid())
  returning id into v_order_id;

  -- Add items
  for v_item in select * from jsonb_to_recordset(p_items) as x(product_id uuid, qty integer)
  loop
    insert into order_items (order_id, product_id, qty)
    values (v_order_id, v_item.product_id, v_item.qty);
  end loop;

  -- Log activity
  insert into activity_logs (actor_id, actor_role, entity_type, entity_id, action)
  select auth.uid(), role, 'order', v_order_id, 'create'
  from user_profiles where user_id = auth.uid();

  return v_order_id;
end;
$$;
```

### 2. submit_order
```sql
create or replace function submit_order(p_order_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_before jsonb;
  v_after jsonb;
begin
  -- Get before state
  select to_jsonb(o) into v_before from orders o where id = p_order_id;

  -- Update order
  update orders
  set status = 'submitted', updated_at = now()
  where id = p_order_id and status = 'draft';

  if not found then
    raise exception 'Order not found or not in draft status';
  end if;

  -- Get after state
  select to_jsonb(o) into v_after from orders o where id = p_order_id;

  -- Log activity
  insert into activity_logs (actor_id, actor_role, entity_type, entity_id, action, before_state, after_state)
  select auth.uid(), role, 'order', p_order_id, 'submit', v_before, v_after
  from user_profiles where user_id = auth.uid();
end;
$$;
```

### 3. approve_order
```sql
create or replace function approve_order(p_order_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_role text;
begin
  -- Check role
  select role into v_role from user_profiles where user_id = auth.uid();

  if v_role not in ('owner', 'admin') then
    raise exception 'Only owner or admin can approve orders';
  end if;

  -- Update order
  update orders
  set
    status = 'approved',
    approved_by = auth.uid(),
    approved_at = now(),
    updated_at = now()
  where id = p_order_id and status = 'submitted';

  if not found then
    raise exception 'Order not found or not in submitted status';
  end if;

  -- Log activity
  insert into activity_logs (actor_id, actor_role, entity_type, entity_id, action)
  values (auth.uid(), v_role, 'order', p_order_id, 'approve');
end;
$$;
```

### 4. reject_order
```sql
create or replace function reject_order(p_order_id uuid, p_reason text)
returns void
language plpgsql
security definer
as $$
declare
  v_role text;
begin
  -- Check role
  select role into v_role from user_profiles where user_id = auth.uid();

  if v_role not in ('owner', 'admin') then
    raise exception 'Only owner or admin can reject orders';
  end if;

  -- Update order
  update orders
  set
    status = 'rejected',
    notes = p_reason,
    updated_at = now()
  where id = p_order_id and status = 'submitted';

  if not found then
    raise exception 'Order not found or not in submitted status';
  end if;

  -- Log activity
  insert into activity_logs (actor_id, actor_role, entity_type, entity_id, action, after_state)
  values (auth.uid(), v_role, 'order', p_order_id, 'reject', jsonb_build_object('reason', p_reason));
end;
$$;
```

### 5. complete_order
```sql
create or replace function complete_order(p_order_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_role text;
  v_item record;
  v_current_stock integer;
begin
  -- Check role
  select role into v_role from user_profiles where user_id = auth.uid();

  if v_role not in ('owner', 'admin') then
    raise exception 'Only owner or admin can complete orders';
  end if;

  -- Check order status
  if not exists (select 1 from orders where id = p_order_id and status = 'approved') then
    raise exception 'Order not found or not in approved status';
  end if;

  -- Process each item
  for v_item in
    select product_id, qty
    from order_items
    where order_id = p_order_id
  loop
    -- Get current stock
    select stock into v_current_stock
    from products
    where id = v_item.product_id;

    -- Check sufficient stock
    if v_current_stock < v_item.qty then
      raise exception 'Insufficient stock for product %', v_item.product_id;
    end if;

    -- Create stock mutation record
    insert into stock_mutations (
      product_id, source_type, source_id,
      qty_before, qty_change, qty_after, actor_id
    )
    values (
      v_item.product_id, 'order', p_order_id,
      v_current_stock, -v_item.qty, v_current_stock - v_item.qty, auth.uid()
    );

    -- Update product stock
    update products
    set stock = stock - v_item.qty, updated_at = now()
    where id = v_item.product_id;
  end loop;

  -- Update order status
  update orders
  set status = 'completed', completed_at = now(), updated_at = now()
  where id = p_order_id;

  -- Log activity
  insert into activity_logs (actor_id, actor_role, entity_type, entity_id, action)
  values (auth.uid(), v_role, 'order', p_order_id, 'complete');
end;
$$;
```

### 6. cancel_order
```sql
create or replace function cancel_order(p_order_id uuid, p_reason text)
returns void
language plpgsql
security definer
as $$
begin
  -- Update order
  update orders
  set
    status = 'cancelled',
    notes = p_reason,
    updated_at = now()
  where id = p_order_id and status in ('draft', 'submitted');

  if not found then
    raise exception 'Order not found or cannot be cancelled';
  end if;

  -- Log activity
  insert into activity_logs (actor_id, actor_role, entity_type, entity_id, action, after_state)
  select auth.uid(), role, 'order', p_order_id, 'cancel', jsonb_build_object('reason', p_reason)
  from user_profiles where user_id = auth.uid();
end;
$$;
```

### 7. adjust_stock
```sql
create or replace function adjust_stock(
  p_product_id uuid,
  p_qty_change integer,
  p_reason text
)
returns void
language plpgsql
security definer
as $$
declare
  v_role text;
  v_current_stock integer;
  v_new_stock integer;
begin
  -- Check role
  select role into v_role from user_profiles where user_id = auth.uid();

  if v_role not in ('owner', 'admin') then
    raise exception 'Only owner or admin can adjust stock';
  end if;

  -- Get current stock
  select stock into v_current_stock from products where id = p_product_id;

  if not found then
    raise exception 'Product not found';
  end if;

  v_new_stock := v_current_stock + p_qty_change;

  if v_new_stock < 0 then
    raise exception 'Adjustment would result in negative stock';
  end if;

  -- Create mutation record
  insert into stock_mutations (
    product_id, source_type,
    qty_before, qty_change, qty_after,
    actor_id, reason
  )
  values (
    p_product_id, 'adjustment',
    v_current_stock, p_qty_change, v_new_stock,
    auth.uid(), p_reason
  );

  -- Update product stock
  update products
  set stock = v_new_stock, updated_at = now()
  where id = p_product_id;

  -- Log activity
  insert into activity_logs (actor_id, actor_role, entity_type, entity_id, action)
  values (auth.uid(), v_role, 'product', p_product_id, 'adjust_stock');
end;
$$;
```

### 8. submit_stock_opname
```sql
create or replace function submit_stock_opname(
  p_product_id uuid,
  p_actual_qty integer,
  p_reason text
)
returns void
language plpgsql
security definer
as $$
declare
  v_role text;
  v_current_stock integer;
  v_difference integer;
begin
  -- Check role
  select role into v_role from user_profiles where user_id = auth.uid();

  if v_role not in ('owner', 'admin') then
    raise exception 'Only owner or admin can perform stock opname';
  end if;

  -- Get current stock
  select stock into v_current_stock from products where id = p_product_id;

  if not found then
    raise exception 'Product not found';
  end if;

  v_difference := p_actual_qty - v_current_stock;

  if v_difference = 0 then
    return; -- No change needed
  end if;

  -- Create mutation record
  insert into stock_mutations (
    product_id, source_type,
    qty_before, qty_change, qty_after,
    actor_id, reason
  )
  values (
    p_product_id, 'opname',
    v_current_stock, v_difference, p_actual_qty,
    auth.uid(), p_reason
  );

  -- Update product stock
  update products
  set stock = p_actual_qty, updated_at = now()
  where id = p_product_id;

  -- Log activity
  insert into activity_logs (actor_id, actor_role, entity_type, entity_id, action)
  values (auth.uid(), v_role, 'product', p_product_id, 'stock_opname');
end;
$$;
```

## Database Indexes (Performance)

```sql
-- Orders
create index idx_orders_status on orders(status);
create index idx_orders_created_at on orders(created_at desc);
create index idx_orders_created_by on orders(created_by);

-- Order Items
create index idx_order_items_order_id on order_items(order_id);
create index idx_order_items_product_id on order_items(product_id);

-- Stock Mutations
create index idx_stock_mutations_product_id on stock_mutations(product_id);
create index idx_stock_mutations_created_at on stock_mutations(created_at desc);
create index idx_stock_mutations_source on stock_mutations(source_type, source_id);

-- Activity Logs
create index idx_activity_logs_entity on activity_logs(entity_type, entity_id);
create index idx_activity_logs_actor on activity_logs(actor_id);
create index idx_activity_logs_created_at on activity_logs(created_at desc);

-- Products
create index idx_products_sku on products(sku);
create index idx_products_low_stock on products(stock) where stock <= min_stock;
```

## Setup Instructions

1. Run the table creation scripts in order
2. Create the views
3. Create the RPC functions
4. Create the indexes
5. Insert initial data (products, user profiles)

## Testing

After setup, test each RPC function:

```sql
-- Test create_order
select create_order('[{"product_id": "uuid-here", "qty": 5}]'::jsonb);

-- Test submit_order
select submit_order('order-uuid-here');

-- Test approve_order (as admin/owner)
select approve_order('order-uuid-here');

-- Test complete_order (as admin/owner)
select complete_order('order-uuid-here');

-- Verify stock mutations
select * from v_stock_ledger order by created_at desc limit 10;

-- Verify activity logs
select * from activity_logs order by created_at desc limit 10;
```
