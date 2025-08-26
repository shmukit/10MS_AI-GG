# Supabase Setup & Local Development

## Environment Variables
The project uses a `.env` file with the following variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `VITE_AUTH_REDIRECT_URL`: Authentication callback URL

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will run on `http://localhost:5173`

### 3. Test Supabase Connection
Open browser console to see environment variable status and any connection errors.

## Project Structure
- `src/lib/supabase.ts` - Supabase client configuration
- `src/lib/useAuth.ts` - Authentication hook
- `src/lib/AuthContext.tsx` - Auth context provider
- `src/components/Auth/LoginPage.tsx` - Updated with Supabase auth

## Next Steps for Production
- Set up proper database tables in Supabase
- Configure authentication policies
- Set up environment variables in hosting platform
