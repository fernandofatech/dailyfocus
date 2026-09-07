# Setup — Vercel + Cloudflare

Connect this repository to Vercel and expose it on `dailyfocus.moretes.com` via
Cloudflare DNS.

## 1. Create the Vercel project

1. Sign in at https://vercel.com with the GitHub account that owns this repo.
2. Click **Add New… → Project** and import `fernandofatech/dailyfocus`.
3. **Framework preset:** auto-detected.
4. **Root directory:** `.`.
5. **Build command:** auto-detected from `package.json`.
6. Click **Deploy** to confirm the first build works.

## 2. Capture the Vercel IDs

In **Settings → General**, copy:

- `Project ID` → `VERCEL_PROJECT_ID`
- `Team ID` (or personal account ID) → `VERCEL_ORG_ID`

Create a token at https://vercel.com/account/tokens → `VERCEL_TOKEN`.

## 3. Configure GitHub Actions secrets

```bash
gh secret set VERCEL_TOKEN      --body "<token>" -R fernandofatech/dailyfocus
gh secret set VERCEL_ORG_ID     --body "<org-id>" -R fernandofatech/dailyfocus
gh secret set VERCEL_PROJECT_ID --body "<project-id>" -R fernandofatech/dailyfocus
```

## 4. Attach the custom subdomain

In Vercel: **Settings → Domains → Add** → `dailyfocus.moretes.com`.

## 5. Cloudflare DNS

In the Cloudflare dashboard for `moretes.com`:

- **Type:** CNAME
- **Name:** `dailyfocus`
- **Target:** `cname.vercel-dns.com`
- **Proxy status:** **DNS only** (gray cloud) — required so Vercel can issue
  the TLS certificate.

## 6. Verify

```bash
curl -I https://dailyfocus.moretes.com
```

Expect `HTTP/2 200` and `server: Vercel`.
