<div align="center">
  <img src="https://raw.githubusercontent.com/Kas-Flow/assets/master/kasflow-logo.png" alt="KasFlow Logo" width="100" height="100"/>

  # KasFlow Web App

  **Payment application for Kaspa blockchain with instant confirmations.**

  Built with Next.js 16, React 19, and TailwindCSS v4.

</div>

---

![KasFlow Hero](https://raw.githubusercontent.com/Kas-Flow/assets/master/kasflow-hero.png)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- TailwindCSS v4
- Framer Motion
- shadcn/ui + Magic UI
- @kasflow/passkey-wallet
- @kasflow/wallet-connector

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Type check
pnpm typecheck
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
apps/web/
├── app/                 # Next.js App Router pages
│   ├── page.tsx         # Landing page
│   ├── create/          # Payment creation wizard
│   ├── pay/[id]/        # Payment receiver page
│   └── docs/            # Documentation
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks
│   ├── stores/          # Zustand stores
│   └── lib/             # Utilities
└── public/              # Static assets
```

## License

MIT
