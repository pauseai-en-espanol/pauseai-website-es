# syntax=docker/dockerfile:1.7

FROM node:26.3.1-alpine@sha256:a2dc166a387cc6ca1e62d0c8e265e49ca985d6e60abc9fe6e6c3d6ce8e63f606 AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && pnpm config set store-dir /pnpm/store

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc* ./
RUN pnpm install --frozen-lockfile

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

COPY --from=builder /app/build /app/build

EXPOSE 3000

CMD ["node", "build"]
