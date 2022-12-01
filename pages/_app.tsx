import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react/solana";
import { Network } from "@thirdweb-dev/sdk/solana";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

export const network: Network = "devnet";
export const domain = "https://web3-nft-gated-site.vercel.app/";
export const wallet = new PhantomWalletAdapter();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      authConfig={{
        authUrl: "/api/auth",
        domain: process.env.VERCEL_URL || domain,
        loginRedirect: "/",
      }}
      network={network}
    >
      <WalletProvider wallets={[wallet]}>
        <Component {...pageProps} />
      </WalletProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
