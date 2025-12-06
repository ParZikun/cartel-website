import { IBM_Plex_Mono, Press_Start_2P, VT323 } from 'next/font/google'
import './styles/globals.css'
import "@solana/wallet-adapter-react-ui/styles.css";
import { SolanaProvider } from "./components/SolanaProvider";
import { TransactionProvider } from './context/TransactionContext';
import { UIProvider } from '../context/UIContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';

const pokemonHollow = localFont({
  src: '../public/pokemon-hollow.ttf',
  variable: '--font-pokemon-hollow'
});

const pokemonSolid = localFont({
  src: '../public/pokemon-solid.ttf',
  variable: '--font-pokemon-solid'
});

export const metadata = {
  title: "Cards Cartel Sniper",
  description: "Advanced Card Sniper Bot Dashboard",
  manifest: "/manifest.json",
  themeColor: "#0c0a15",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    title: "CCP-S",
    statusBarStyle: "black-translucent",
    startupImage: [
      "/logo.png",
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${pokemonHollow.variable} ${pokemonSolid.variable}`}>
      <body>
        <Toaster position="top-right" richColors closeButton />
        <SolanaProvider>
          <TransactionProvider>
            <UIProvider>
              <div className="min-h-screen">
                <Navbar />
                <div className="flex pt-20">
                  <Sidebar />
                  <main className="flex-1">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      {children}
                    </div>
                  </main>
                </div>
              </div>
            </UIProvider>
          </TransactionProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
