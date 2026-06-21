# syntax=docker/dockerfile:1.7

FROM node:26.3.1-alpine@sha256:a2dc166a387cc6ca1e62d0c8e265e49ca985d6e60abc9fe6e6c3d6ce8e63f606 AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# git: the `prepare` script runs `lefthook install` (and the l10n build uses
# simple-git). Node 26 no longer bundles corepack, so install the pinned pnpm
# directly (matches packageManager/devEngines — nothing re-downloads at install).
RUN apk add --no-cache git && npm install -g pnpm@11.8.0 && pnpm config set store-dir /pnpm/store

WORKDIR /app

# pnpm-workspace.yaml carries overrides / allowBuilds / minimumReleaseAge in
# pnpm 11, so it must be present for the frozen install to match the lockfile.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
# The `prepare` script runs `lefthook install`, which needs a git repo. The real
# .git is (correctly) dockerignored, so init a throwaway one just for the build.
RUN git init -q && pnpm install --frozen-lockfile

COPY . .

ENV PARAGLIDE_LOCALES=es
ENV L10N_OFFLINE=1

RUN pnpm inlang:settings
RUN pnpm run sync
RUN pnpm build


FROM node:26.3.1-alpine@sha256:a2dc166a387cc6ca1e62d0c8e265e49ca985d6e60abc9fe6e6c3d6ce8e63f606 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PARAGLIDE_LOCALES=es
ENV L10N_OFFLINE=1
ENV HOST=0.0.0.0

# adapter-node externalises `dependencies` (clsx, etc.) rather than bundling them,
# so the server needs the production node_modules at runtime. --ignore-scripts:
# no prepare/lefthook (needs git) and no native rebuilds the request-serving
# runtime doesn't use (image processing already happened at build time).
RUN npm install -g pnpm@11.8.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=builder /app/build /app/build

EXPOSE 3000

CMD ["node", "build"]
