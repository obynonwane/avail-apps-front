// [object Object]
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
// import { config } from 'dotenv';

// config({
//   path: '../../../../.env'
// });

// eslint-disable-next-line header/header
export default {
  LCURL: process.env.LCURL as string || 'https://devnet01.dataavailability.link:27000/',
  testnet_url: process.env.TESTNETURL as string || 'wss://devnet01.dataavailability.link:28546/'
};
