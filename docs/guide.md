# Solana NFT Gated Website

## Create a Project and install dependencies:

npx create-next-app -e with-tailwindcss web3-nft-gated-site
cd web3-nft-gated-site
npm run dev
npm install @thirdweb-dev/react @thirdweb-dev/sdk @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @thirdweb-dev/auth

## Register for a Phantom Wallet:

Once you download and register save your recovery phrase safely.
Open you wallet in the Chrome extensions tab > Profile Image > Developer Settings > Change Network > Devnet

## Get solana devnet tokens:

First you need to get solana devnet tokens: Go to https://thirdweb.com/faucet/solana > Request Funds OR Go to https://solfaucet.com/ and paste in your wallet address > Devnet

Create an additional wallet in Phantom. Add tokens to this account too.

## Create NFT Drop Collection:

Go to https://thirdweb.com/network/solana
Connect Wallet > Phantom > Connect
Start Building > NFT Drop >
Image: Upload an image
Name: Membership Pass
Symbol: PASS
Description: This is an exclusive pass to access the Premium Membership!
Total Supply: 100
Network: Devnet
Deploy Now
Approve

Batch Upload Images and .csv file > Reveal upon mint > Upload NFTs > Approve
Each of the NFTs are unclaimed. So the buyer will have to pay for the gas fees on purchase. In solana the transaction costs are very low.

Claim Conditions tab > Add Claim Conditions
How much do you want to charge to claim each NFT?: 0.01
How many total NFTs can be claimed?: Unlimited
What currency do you want to use? SOL (Solana)
Save Claim Conditions
Approve

## Create a .env.local file in the root folder:

```
PRIVATE_KEY=
NEXT_PUBLIC_PROGRAM_ADDRESS=
```

Copy the NFT Drop address. This will be your NEXT_PUBLIC_PROGRAM_ADDRESS
To get your phantom wallet private key > Profile > Security & Privacy > Export Private Key > Enter your password > Next > Copy Private Key. This will be your
PRIVATE_KEY

## Update pages/\_app.tsx:

```
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react/solana";
import { Network } from "@thirdweb-dev/sdk/solana";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

export const network: Network = "devnet";
export const domain = "example.org";
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


```

## Implementing Authentication Handler

In the root create auth.config.ts:

```
import { ThirdwebAuth } from "@thirdweb-dev/auth/next/solana";
import { domain} from "./pages/_app";

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  privateKey: process.env.PRIVATE_KEY!,
  domain: domain,
});

```

Create a catch-all API route called pages/api/auth/[...thirdweb].ts.
This exports the ThirdwebAuthHandler to manage all of the required auth endpoints like login and logout.

In pages/api/auth/[...thirdweb].ts:

```
import { ThirdwebAuthHandler } from "../../../auth.config";

export default ThirdwebAuthHandler();
```

## Create a pages/login.tsx:

```
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useClaimNFT,
  useLogin,
  useLogout,
  useProgram,
  useUser,
  useDropUnclaimedSupply,
  useNFTs,
} from "@thirdweb-dev/react/solana";
import { wallet } from "./_app";
import { useRouter } from "next/router";
import { NFT } from "@thirdweb-dev/sdk";
import Link from "next/link";
import Image from "next/image";
function LoginPage() {
  const [usersNft, setUsersNft] = useState<NFT | undefined>();
  const login = useLogin();
  const logout = useLogout();
  const router = useRouter();
  const { user } = useUser();
  const { publicKey, connect, select } = useWallet();
  const { program } = useProgram(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS,
    "nft-drop"
  );
  const { data: unclaimedSupply } = useDropUnclaimedSupply(program);
  const { data: nfts, isLoading } = useNFTs(program);
  const { mutateAsync: claim } = useClaimNFT(program);

  // If no user exists prompt wallet to signin
  useEffect(() => {
    if (!publicKey) {
      select(wallet.name!);
      connect();
    }
  }, [publicKey, wallet]);

  // Check nfts returned from the collection against the users logged in address to check if the user owns an nft or not
  useEffect(() => {
    if (!user || !nfts) return;
    const usersNft = nfts.find((nft) => nft.owner === user?.address);
    if (usersNft) {
      setUsersNft(usersNft);
    }
  }, [nfts, user]);

  // Login and redirect to homepage
  const handleLogin = async () => {
    await login();
    router.replace("/");
  };

  // Prompt user to make purchase of 1 nft and redirect to homepage
  const handlePurchase = async () => {
    await claim({
      amount: 1,
    });
    router.replace("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center bg-[#44d681ee]">
      {/* <div className="absolute top-48 left-0 w-full h-1/3 bg-gray-400 -skew-y-6 z-10 overflow-hidden shadow-xl" /> */}
      <div className="absolute top-1/4 h-1/3 left-0 w-full bg-gray-400 -skew-y-6 z-10 overflow-hidden shadow-xl">
        <div className="flex items-center w-full h-full opacity-30">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center -mx-20">
            MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS MEMBERS ONLY MEMBERS
            ONLY MEMBERS ONLY MEMBERS MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
            MEMBERS MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS MEMBERS ONLY
            MEMBERS ONLY MEMBERS ONLY MEMBERS MEMBERS ONLY MEMBERS ONLY MEMBERS
            ONLY MEMBERS MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS MEMBERS
            ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS MEMBERS ONLY MEMBERS ONLY
            MEMBERS ONLY MEMBERS
          </h1>
        </div>
      </div>
      <Image
        className="mt-5 z-30 shadow-2xl mb-20 rounded-full"
        src="/contract-access.png"
        alt="logo"
        width={400}
        height={400}
      />
      <main className="z-30 text-white">
        <h1 className="text-4xl font-bold uppercase">
          Welcome to the <span className="text-black">Creative Coding</span>{" "}
          Club
        </h1>
        {!user && (
          <div>
            <button
              onClick={handleLogin}
              className="text-2xl font-bold mb-5 bg-black text-white py-4 px-10 border-2 border-fusbg-black animate-pulse rounded-full transition duration-200 mt-5"
            >
              Login / Connect Wallet
            </button>
          </div>
        )}
        {user && (
          <div>
            <p className="text-lg text-black font-bold mb-10">
              Welcome {user.address.slice(0, 5)}...{user.address.slice(-5)}
            </p>

            {isLoading && (
              <div className="text-2xl font-bold mb-5 bg-black text-white py-4 px-10 border-2 border-fusbg-black animate-pulse rounded-full transition duration-200">
                Hold on, We're just looking for your Creative Coding Club
                Membership pass...
              </div>
            )}

            {usersNft && (
              <Link
                href="/"
                className="text-2xl font-bold mb-5 bg-black text-white py-4 px-10 border-2 border-fusbg-black animate-pulse rounded-full transition duration-200 hover:bg-white hover:text-black mt-5 uppercase"
              >
                ACCESS GRANTED - ENTER
              </Link>
            )}

            {!usersNft &&
              !isLoading &&
              (unclaimedSupply && unclaimedSupply > 0 ? (
                <button
                  onClick={handlePurchase}
                  className="bg-black text-white py-4 px-10 border-2 border-black rounded-full hover:bg-white hover:text-black mt-5 uppercase font-bold transition duration-200"
                >
                  Buy a Creative Coding Club Membership Pass
                </button>
              ) : (
                <p className="text-2xl font-bold mb-5 bg-red-500 text-white py-4 px-10 border-2 border-red-500 rounded-md uppercase transition duration-200">
                  Sorry, we're all out of Creative Coding Club Membership
                  passes!
                </p>
              ))}
          </div>
        )}

        {user && (
          <button
            onClick={logout}
            className="bg-white text-black py-4 px-10 border-2 border-black rounded-md hover:bg-black hover:text-white mt-10 font-bold transition duration-200"
          >
            Logout
          </button>
        )}
      </main>
    </div>
  );
}

export default LoginPage;

```

## Update pages/index.tsx:

```
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { programAccountTypeQuery, useLogout } from "@thirdweb-dev/react/solana";
import { getUser } from "../auth.config";
import { network } from "./_app";
import { userAgent } from "next/server";

const Home = () => {
  const logout = useLogout();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center bg-[#27D682] -z-20 px-5">
      <Head>
        <title>Creative Coding Club - Members Only Access</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p className="text-xs md:text-base font-bold text-white bg-red-400 py-4 px-5 md:px-8 mx-10 rounded-full">
        MEMBERS ONLY: This page is only accessible to users who have purchased &
        hold a Creative Coding Club NFT
      </p>

      <div className="absolute top-50 h-1/3 left-0 w-full bg-gray-400 -skew-y-6 z-10 overflow-hidden shadow-xl">
        <div className="flex items-center w-full h-full opacity-30">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center -mx-20">
            MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS MEMBERS ONLY MEMBERS
            ONLY MEMBERS ONLY MEMBERS MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY
            MEMBERS MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS MEMBERS ONLY
            MEMBERS ONLY MEMBERS ONLY MEMBERS MEMBERS ONLY MEMBERS ONLY MEMBERS
            ONLY MEMBERS MEMBERS ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS MEMBERS
            ONLY MEMBERS ONLY MEMBERS ONLY MEMBERS MEMBERS ONLY MEMBERS ONLY
            MEMBERS ONLY MEMBERS
          </h1>
        </div>
      </div>

      <section className="md:mb-10 mt-10 z-10 space-y-2">
        <h1 className="text-2xl lg:text-4xl font-bold">
          Introducing the <span className="text-black">Creative Coding</span>{" "}
          Club
        </h1>
        <h2 className="text-xl">
          <span className="text-black font-extrabold underline decoration-black">
            Daily Creative Coding
          </span>{" "}
          problems (with solutions) delivered straight to your inbox!
        </h2>
      </section>

      <Image
        className="mt-5 z-30 shadow-2xl mb-10 border-2"
        src="/contract-access.png"
        alt="logo"
        width={400}
        height={400}
      />

      <Link
        href="/"
        className="text-lg md:text-2xl text-black transition duration-200 hover:underline my-5 z-50"
      >
        Visit{" "}
        <span className="font-extrabold underline decoration-black text-black transiiton duration-200">
          Creative Coding Club
        </span>{" "}
        to sign up Today!
      </Link>

      <button
        onClick={logout}
        className="bg-gray-400 text-black py-4 px-10 border-2 border-gray-400 rounded-full hover:bg-black hover:border-black hover:text-white mt-5 uppercase font-bold transition duration-200 z-50"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const sdk = ThirdwebSDK.fromNetwork(network);
  const user = await getUser(req);
  if (!user)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  // Check the user has the NFT and then allow access
  const program = await sdk.getNFTDrop(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS!
  );

  const nfts = await program.getAllClaimed();
  const nft = nfts.find((nft) => nft.owner === user.address);

  if (!nft)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

```
