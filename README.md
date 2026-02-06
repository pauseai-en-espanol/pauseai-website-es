# PauseAI.es Website

A SvelteKit website for [PauseAI.es](https://pauseai.es/).

## Quick Start

```bash
git clone git@github.com:pauseai-en-espanol/pauseai-website-es.git
cd pauseai-website-es
cp template.env .env
pnpm install
pnpm inlang:settings   # compiles the Paraglide runtime (not in git)
pnpm dev               # http://localhost:37572
```

`pnpm inlang:settings` must run at least once after a fresh clone — it generates `src/lib/paraglide/`, which is gitignored. After that, `pnpm dev` is all you need between sessions.

No API keys are required for basic development. The `.env` defaults to Spanish-only offline mode.

## Development Commands

| Command                | Description                                 |
| ---------------------- | ------------------------------------------- |
| `pnpm dev`             | Start development server                    |
| `pnpm build`           | Build for production                        |
| `pnpm preview`         | Preview production build                    |
| `pnpm inlang:settings` | Compile Paraglide runtime from `l10n-cage/` |
| `pnpm test`            | Run test suite                              |
| `pnpm lint`            | Check code style                            |
| `pnpm format`          | Auto-fix code style                         |
| `pnpm clean`           | Clean build artifacts and caches            |

## Docker

```bash
docker build -t pauseai-site-es .
docker run --rm -it -p 3000:3000 pauseai-site-es
```

The Docker build runs in offline mode (`L10N_OFFLINE=1`) and never contacts GitHub. It uses the translations bundled in `l10n-cage/`.

## Environment

Copy the template and edit as needed:

```bash
cp template.env .env
```

Key variables (see `template.env` for the full list):

| Variable                  | Default | Purpose                                         |
| ------------------------- | ------- | ----------------------------------------------- |
| `PARAGLIDE_LOCALES`       | `es`    | Which locales to compile (comma-separated)      |
| `L10N_OFFLINE`            | `1`     | Skip remote Git fetches for l10n cage           |
| `L10N_OPENROUTER_API_KEY` | empty   | Set only if generating new translations locally |

Dynamic features (teams, chat, email) need additional API keys but have fallbacks for local dev.

## Image Optimization

Images in `src/assets/images` are automatically processed into multiple formats (WebP, AVIF) and resolutions via the `Image` Svelte component.

**In Markdown** — use a path relative to `src/assets/images`, starting with `/`:

```markdown
![Alt text](/my-image.png)
![Alt text](/illustrations/another-image.jpg)
```

**In Svelte** — import the component directly:

```svelte
<script>
	import Image from '$lib/components/Image.svelte'
</script>

<Image src="/my-image.png" alt="Description" />
```

## Redirects

Server-side redirects are defined in `src/lib/redirects.ts`. Add entries to the `REDIRECTS` object to map old paths to new ones (301 permanent redirects).

## Deployment

Pushes to the repository are continuously deployed. Track deployment status on your hosting dashboard.

## Troubleshooting

### Node.js Version

Use the version specified in `.nvmrc`. If using `nvm`, run `nvm use` before starting.

### Windows Symlinks

If you get permission errors for symlinks on Windows, enable Developer Mode: **Settings > Privacy & security > For developers > Developer Mode: On**.

## Collaboration

Use **"Squash and merge"** when merging pull requests to keep the Git history clean.
