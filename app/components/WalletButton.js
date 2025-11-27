'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function WalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const prevConnected = useRef(connected);

  useEffect(() => {
    if (connected && !prevConnected.current) {
      toast.success('Wallet connected');
    } else if (!connected && prevConnected.current) {
      toast.info('Wallet disconnected');
    }
    prevConnected.current = connected;
  }, [connected]);

  if (publicKey) {
    return (
      <button
        onClick={() => disconnect()}
        className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2 focus-gold text-sm sm:text-base"
      >
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:inline">
          {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
        </span>
        <span className="sm:hidden">Disconnect</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2 focus-gold text-sm sm:text-base"
    >
      <Wallet className="w-4 h-4" />
      <span className="hidden sm:inline">Connect Wallet</span>
      <span className="sm:hidden">Connect</span>
    </button>
  );
}