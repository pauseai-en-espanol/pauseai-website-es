# syntax=docker/dockerfile:1.28

# The build output is platform-independent (JS, CSS, images), so the builder runs
# natively on the build machine instead of under emulation (the CI runner is
# arm64, the image amd64). Only the deps stage needs the target platform.
FROM --platform=$BUILDPLATFORM node:26.13.0-alpine@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94 AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# git: the `prepare` script runs `lefthook install` (and the l10n build uses
# simple-git). Node 26 no longer bundles corepack, so install the pinned pnpm
# directly (matches packageManager/devEngines — nothing re-downloads at install).
RUN apk add --no-cache git && npm install -g pnpm@12.16.0 && pnpm config set store-dir /pnpm/store

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


FROM node:26.13.0-alpine@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94 AS deps

WORKDIR /app

# adapter-node externalises `dependencies` (clsx, etc.) rather than bundling them,
# so the server needs the production node_modules at runtime. Installed in their
# own stage so pnpm stays out of the final image. --ignore-scripts: no
# prepare/lefthook (needs git) and no native rebuilds the request-serving
# runtime doesn't use (image processing already happened at build time).
RUN npm install -g pnpm@12.16.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts


FROM node:26.13.0-alpine@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PARAGLIDE_LOCALES=es
ENV L10N_OFFLINE=1
ENV HOST=0.0.0.0

# package.json: "type": "module" makes Node load build/ as ESM.
COPY package.json ./
COPY --from=deps /app/node_modules /app/node_modules
# adapter-node 6 copies the whole server build, which includes byte-identical
# copies of every file in _app/immutable/assets (~500 MB, mostly images). They
# are served from build/client; the server only needs their URLs.
COPY --from=builder --exclude=server/_app/immutable/assets /app/build /app/build

EXPOSE 3000

CMD ["node", "build"]
