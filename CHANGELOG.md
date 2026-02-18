# create-inox-app

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
