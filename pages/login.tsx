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
    router.replace("/members");
  };

  // Prompt user to make purchase of 1 nft and redirect to homepage
  const handlePurchase = async () => {
    await claim({
      amount: 1,
    });
    router.replace("/members");
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
                href="/members"
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
