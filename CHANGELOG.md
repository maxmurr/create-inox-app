# create-inox-app

## 0.3.3

### Patch Changes

- Re-release after CI publish conflict

## 0.3.2

### Patch Changes

- Warn about credential placeholders in post-install output and fix .env.example DB credentials

## 0.3.1

### Patch Changes

- Fix missing README on npm by explicitly including it in package files

## 0.3.0

### Minor Changes

- Make company-specific infrastructure values configurable via new CLI flags and interactive prompts: `--registry-host`, `--domain-suffix`, `--gitlab-url`. Remove hardcoded seed password and auth secret fallbacks. Improve default credentials in templates.

## 0.2.4

### Patch Changes

- Update CLI theme to match INOX brand CI (red/orange gradient, red accents). Fix Ctrl+C not exiting on first prompt.

## 0.2.3

### Patch Changes

- Create skill symlinks in .claude/skills so Claude Code can discover agent skills

## 0.2.2

### Patch Changes

- Register setup task in turbo.json so `bun setup` works

## 0.2.1

### Patch Changes

- Update post-install next-steps to use `bun setup` instead of manual db:migrate

## 0.2.0

### Minor Changes

- Add `bun setup` script to scaffolded projects for one-command database setup

## 0.1.1

### Patch Changes

- Fix missing shebang in CLI entry point causing `npx create-inox-app` to fail
