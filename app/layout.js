import { IBM_Plex_Mono, Press_Start_2P, VT323 } from 'next/font/google'
import './styles/globals.css'
import "@solana/wallet-adapter-react-ui/styles.css";
import { SolanaProvider } from "./components/SolanaProvider";
import { TransactionProvider } from './context/TransactionContext';
import { UIProvider } from '../context/UIContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import localFont from 'next/font/local';
import Sidebar from './components/Sidebar';

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
      <body className="bg-gray-900">
        <SolanaProvider>
          <TransactionProvider>
            <div className="flex">
              <Sidebar />
              <main className="flex-1 ml-64">
                {children}
              </main>
            </div>
          </TransactionProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
