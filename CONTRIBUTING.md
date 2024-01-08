# Clone the Repo

1. Install `pnpm`: https://pnpm.io/installation
2. Clone the repo:
```
git clone https://github.com/reductoai/remembrall.git && cd remembrall
```
3. Create a file `.env` and copy the contents of `.env.example`:
```
cp .env.example .env
```
4. Add your own `NEXTAUTH_SECRET` and `SUPABASE_URL` to `.env`(These keys are needed to start Remembrall; others can be added later as and when required)
5. Install dependencies:
```
pnpm i
```
6. Run the app:
```
pnpm run dev
```

