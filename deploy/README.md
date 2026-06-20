# m81 Wallet — estate deploy runbook

Stand up the rebranded AirGap wallet at **m81.gerrydekens.com** on octera-estate
(185.69.165.68), the same way TPW / yina-trader are deployed (Docker build +
Caddy reverse-proxy). Static, non-custodial — no DB, no secrets server-side.

> ⚠️ The build is HEAVY: a full `npm install --legacy-peer-deps` of the AirGap
> Ionic app + Chromium install + `ng build --configuration production`. Expect
> ~10–30 min and significant CPU/RAM on the first build (cached after).

## Steps (on octera-estate, 185.69.165.68)

```bash
# 1. clone the fork into the estate deploy-root
cd ~/deploy-root
git clone https://github.com/ABPTechnologies/m81-wallet.git
cd m81-wallet

# 2. build + run (joins the accept estate network; serves on 8100 internally)
docker compose -p octera-estate-accept -f deploy/docker-compose.estate.yml up -d --build m81-wallet
docker logs --tail 20 estate-m81-wallet      # expect node-static serving on 8100

# 3. Caddy route → m81.gerrydekens.com (append the snippet, then reload)
#    find the estate Caddyfile (mounted into the caddy container), append:
#        m81.gerrydekens.com { reverse_proxy estate-m81-wallet:8100 }
#    (see deploy/Caddyfile.m81.snippet)
docker compose -p octera-estate-accept exec caddy caddy reload --config /etc/caddy/Caddyfile

# 4. DNS (GoDaddy, gerrydekens.com zone): add CNAME
#       Host: m81   →   the same target as yina (yina-trader-accept.octera.cloud)
#    (or an A record to the estate IP)
```

Verify: `https://m81.gerrydekens.com` loads the m81-branded AirGap wallet UI.

## Notes
- Pulling AirGap security updates later: `git fetch upstream && git merge upstream/master` (engine untouched, so merges stay clean), then rebuild step 2.
- Updating the app: `git pull` on the box, re-run step 2 (`--build`).
- This is the watch-only Wallet app; users sign with **AirGap Vault** on an offline
  device (QR). The wallet shows real on-chain balances once profit is settled
  on-chain to the m81 address (separate, later step).
