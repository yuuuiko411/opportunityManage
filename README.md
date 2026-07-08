# freelance-project-manager

## CI

GitHub Actions runs CI when a pull request is opened or updated, and when changes are pushed to `main` or `develop`.

The `Frontend Quality Checks` job uses Node.js 20, installs dependencies with `npm ci`, restores the npm cache, generates the Prisma Client, and runs:

- TypeScript type checking with `npm run typecheck`
- ESLint with `npm run lint`
- Prettier formatting verification with `npm run format:check`
- Tests with `npm test`
- Production build verification with `npm run build`
