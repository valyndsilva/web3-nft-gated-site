import { ThirdwebAuth } from "@thirdweb-dev/auth/next/solana";
import { domain} from "./pages/_app";

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  privateKey: process.env.PRIVATE_KEY!,
  domain: domain,
});
