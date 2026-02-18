# create-inox-app

Scaffold production-ready monorepo projects with one command.

[![npm version](https://img.shields.io/npm/v/create-inox-app.svg)](https://www.npmjs.com/package/create-inox-app)

## Quick Start

```bash
npx create-inox-app@latest
```

Follow the interactive prompts to configure your project.

## Templates

| Template | Description |
| --- | --- |
| `ai-chat-app` | Full-stack AI chat application with Next.js, streaming, sessions |
| `blank` | Minimal Next.js boilerplate with health endpoint |

## Features

Choose from these options during setup:

| Category | Options |
| --- | --- |
| **Database** | PostgreSQL + ParadeDB, None |
| **Cache** | Redis, None |
| **Auth** | Better Auth, None |
| **Observability** | Langfuse, None |
| **Environments** | dev, staging, production (multi-select) |
| **Tooling Addons** | Turborepo, oxlint, oxfmt, Lefthook, Commitlint |
| **Infra Addons** | Ingress, TLS, PVC |

## CLI Flags

Skip prompts by passing flags directly:

```bash
npx create-inox-app@latest my-app \
  --template ai-chat-app \
  --database postgresql-paradedb \
  --cache redis \
  --auth better-auth \
  --observability langfuse \
  --environments dev,staging,production \
  --gitlab-group my-group \
  --git \
  --install
```

| Flag | Description |
| --- | --- |
| `--name <name>` | Project name (or pass as first arg) |
| `--template <t>` | `ai-chat-app` \| `blank` |
| `--database <db>` | `postgresql-paradedb` \| `none` |
| `--cache <c>` | `redis` \| `none` |
| `--auth <a>` | `better-auth` \| `none` |
| `--observability <o>` | `langfuse` \| `none` |
| `--environments <e>` | Comma-separated: `dev,staging,production` |
| `--gitlab-group <g>` | GitLab group name |
| `--git` / `--no-git` | Initialize git repository |
| `--install` / `--no-install` | Install dependencies |
| `-y, --yes` | Accept all defaults |

## Output

The scaffolder generates three repositories:

```
my-app/              # Application source code
kustomize/base/      # Shared Kubernetes manifests
kustomize/overlays/  # Per-environment Kubernetes patches
```

## Development

```bash
# Install dependencies
bun install

# Run CLI in development
bun run dev

# Build for distribution
bun run build

# Type check
bun run check-types
```

## Releasing

This project uses [Changesets](https://github.com/changesets/changesets) for versioning.

```bash
# 1. Add a changeset describing your changes
bun run changeset

# 2. Version bump + changelog generation
bun run version

# 3. Build and publish to npm
bun run release
```

## License

MIT
