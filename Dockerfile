# syntax=docker/dockerfile:1.7

FROM node:24.13.0-alpine@sha256:cd6fb7efa6490f039f3471a189214d5f548c11df1ff9e5b181aa49e22c14383e AS builder

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


FROM node:24.10.0-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PARAGLIDE_LOCALES=es
ENV L10N_OFFLINE=1
ENV HOST=0.0.0.0

COPY --from=builder /app/build /app/build

EXPOSE 3000

CMD ["node", "build"]
