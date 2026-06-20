# m81 Wallet — ABP fork of AirGap Wallet

The real air-gapped self-custody wallet at **m81.gerrydekens.com**, the eventual
on-chain settlement destination for the gerrydekens GD-VEW trading profit.

- **Upstream:** `airgap-it/airgap-wallet` (MIT, Papers GmbH) — kept as the `upstream`
  git remote. Pull their security/dep updates regularly: `git fetch upstream && git merge upstream/master`.
- **Model:** AirGap is **non-custodial + air-gapped** — keys live on an offline
  **AirGap Vault** device; this Wallet app is watch-only (builds + broadcasts tx,
  holds no secrets; signing crosses the air-gap by QR). We keep that model intact.
  The accrued-profit **ledger** (yina-trader → m81 wallet credit / MAM) stays the
  accounting view; the wallet shows the **real on-chain balance** once the treasury
  settles profit on-chain to the m81 address (separate, later).

## What this fork CHANGES (identity + brand + deploy only — engine untouched)
- `capacitor.config.ts` — appId `com.gerrydekens.m81wallet`, appName "m81 Wallet"
- `ionic.config.json` — name "m81 Wallet"
- `package.json` — name `m81-wallet`, author ABP
- `src/index.html` — `<title>m81 Wallet</title>`
- `src/theme/variables.scss` — primary → ABP green `#7cb342` (was AirGap teal `#00e8cc`)
- `k8s/.../production/ingress.yaml` — public host → `m81.gerrydekens.com` (+ TLS secret)

## What is INTENTIONALLY UNTOUCHED
- The wallet **engine**: `airgap-coin-lib`, isolated modules, protocols — so upstream
  pulls stay clean and signing/broadcast stays audited.
- References to **"AirGap Vault"** in UI/onboarding strings — that's the real companion
  signing app our users use; do NOT rename those. (Only the wallet's own product name
  was changed.)

## Still TODO (follow-ups)
- App **icons + splash** (binary assets under `resources/`, `icons/`) — regenerate with the m81 logo.
- Deep **UI strings** that say "AirGap Wallet" as the product (onboarding/about) — selective rename to "m81 Wallet" (leave "AirGap Vault" refs).
- **Deploy on gig.tech**: build the container from the included `Dockerfile` (handles native deps + Chromium in-container), serve the static SPA via `nginx.conf`; finalize the k8s manifests for the gig.tech cluster (the `__CI_PROJECT_NAME__` placeholders are papers' GitLab-CI templating — substitute for our naming) or wrap in the estate's compose/Caddy like the other apps. DNS: `m81` CNAME under gerrydekens.com.
- **m81 asset/network**: AirGap natively covers BTC, ETH + ERC-20 (USDT), BNB Chain. If the m81 balance must be **USDT on Tron (TRC-20)** (common for MEXC), build an Isolated Module (`@airgap/module-kit`) — else use ERC-20/BEP-20 USDT.
- **On-chain settlement wiring**: treasury → the m81 AirGap-controlled address (the real "credit"), which the wallet then shows natively.
