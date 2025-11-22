import { IBM_Plex_Mono, Press_Start_2P, VT323 } from 'next/font/google'
import './styles/globals.css'
import "@solana/wallet-adapter-react-ui/styles.css";
import { SolanaProvider } from "./components/SolanaProvider";
import { TransactionProvider } from './context/TransactionContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import localFont from 'next/font/local';

const pokemonHollow = localFont({
  src: '../public/pokemon-hollow.ttf',
  variable: '--font-pokemon-hollow'
});

const pokemonSolid = localFont({
  src: '../public/pokemon-solid.ttf',
  variable: '--font-pokemon-solid'
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${pokemonHollow.variable} ${pokemonSolid.variable}`}>
      <body>
        <SolanaProvider>
          <TransactionProvider>
            <div className="min-h-screen">
              <Navbar />
              <div className="flex pt-20">
                <Sidebar />
                <main className="flex-1 lg:pl-64">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </TransactionProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
