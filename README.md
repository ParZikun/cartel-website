# Cards Cartel - Frontend (Next.js)

The user-facing dashboard for Cards Cartel. Built with Next.js 14 (App Router) and Tailwind CSS.

## Features
-   **Live Listings**: Real-time feed of card deals.
-   **Manual Sniper**: "Snipe" button connects to wallet to buy instantly.
-   **User Settings**: Encrypted private key management for Auto-Buy.
-   **Wallet Auth**: Sign-In with Solana (SIWS).

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create `.env.local`:
    ```env
    API_URL=http://localhost:5000
    NEXT_PUBLIC_API_URL=http://localhost:5000
    # Optional: Analytics keys, etc.
    ```

## Development

```bash
npm run dev
# Opens http://localhost:3000
```

## Key Components
-   `context/AuthContext.js`: Manages Login, JWT storage, and User state.
-   `app/components/Card.js`: Displays card info and handles the "Snipe" action.
-   `app/components/AccessControl.js`: Protects the app from unauthorized users.
