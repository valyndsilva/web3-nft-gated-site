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
