# Clone the Repo

1. Install `pnpm`: https://pnpm.io/installation
2. Clone the repo:
```
git clone https://github.com/raunakdoesdev/remembrall.git && cd remembrall
```
3. Install Infisical (secret mgmt):
```
brew install infisical/get-cli/infisical
infisical login
```
4. Install dependencies:
```
pnpm i
```
5. Run the app:
```
infisical run -- pnpm run dev
```
