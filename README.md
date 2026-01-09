# Gudangin ERP

Enterprise-grade Warehouse Management System built with Vue 3, TypeScript, and Supabase.

## Architecture Principles

### ❌ FORBIDDEN
- **NO** direct table access from frontend (`supabase.from('table')`)
- **NO** query builder in frontend code
- **NO** business logic in components
- **NO** inline SQL in frontend

### ✅ REQUIRED
- All **READ** operations via REST Views
- All **WRITE** operations via RPC Functions
- All business logic in backend (SQL functions)
- Frontend is pure consumer (HTTP boundary)

## Tech Stack

### Frontend
- **Vue 3** - Composition API with `<script setup>`
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **@tanstack/vue-query** - Server state management
- **Pinia** - Client state management
- **Axios** - HTTP client
- **Vue Router** - Navigation
- **Lucide Vue** - Icons

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **PostgREST** - REST API
- **Row Level Security (RLS)** - Authorization
- **PL/pgSQL** - Business logic

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_ANON_KEY=your_key

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Database Setup

See `DATABASE_SCHEMA.md` for complete database setup instructions including:
- Tables
- Views  
- RPC Functions
- Indexes
- RLS Policies

## Features

✅ Order Management (create, submit, approve, complete)
✅ Inventory Management (stock levels, mutations, opname)
✅ Activity Logging & Audit Trail
✅ Role-Based Access Control (Owner, Admin, Staff)
✅ Dashboard with KPIs
✅ Responsive Admin UI
✅ Density Mode (Comfortable/Compact)

## Development Rules

### Frontend Rules (NON-NEGOTIABLE)

```typescript
❌ WRONG: supabase.from('orders').select('*')
✅ RIGHT: OrderAPI.list() // Uses Axios + REST view

❌ WRONG: supabase.from('orders').update({...})
✅ RIGHT: OrderAPI.submit(orderId) // Calls RPC
```

### Code Review Checklist
- [ ] No `.from()` calls in frontend
- [ ] All reads via REST views
- [ ] All writes via RPC
- [ ] Proper TypeScript types
- [ ] Loading & empty states
- [ ] Error handling

## Project Structure

```
src/
├── components/ui/        # Reusable UI components
├── composables/          # Vue Query hooks
├── layouts/              # Layout components
├── lib/                  # Core utilities (axios, supabase)
├── services/             # API service layer
├── stores/               # Pinia stores
├── types/                # TypeScript types
├── views/                # Page components
└── main.ts
```

## License

MIT
