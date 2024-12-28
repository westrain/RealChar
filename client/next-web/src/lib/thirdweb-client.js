import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const secretKey = process.env.THIRDWEB_SECRET_KEY;

const config = secretKey
  ? { secretKey }
  : {
    clientId,
  }

const initConfig = createThirdwebClient(
  config
);

export default initConfig
