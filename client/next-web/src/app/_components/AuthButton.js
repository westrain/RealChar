import { inAppWallet, createWallet } from 'thirdweb/wallets';

import { createThirdwebClient } from 'thirdweb';
import { ConnectButton } from 'thirdweb/react';

import { useState } from 'react';

import { createAuth } from 'thirdweb/auth';
import { privateKeyToAccount } from 'thirdweb/wallets';

const DOMAIN = window.location.host;
const ORIGIN = window.location.origin;

const client = createThirdwebClient({
  clientId: '...',
});

const privateKey = '...';

const thirdwebAuth = createAuth({
  domain: 'localhost:3000',
  client,
  adminAccount: privateKeyToAccount({ client, privateKey }),
});

const wallets = [
  inAppWallet({
    auth: {
      options: ['google', 'discord', 'telegram', 'farcaster', 'email', 'x', 'passkey', 'phone'],
    },
  }),
  createWallet('com.coinbase.wallet'),
  createWallet('me.rainbow'),
  createWallet('io.rabby'),
  createWallet('io.zerion.wallet'),
  createWallet('io.metamask'),
];

const sendRequest = async (endpoint, method, body = null, headers = {}) => {
  const server = 'http://localhost:8000';

  const response = await fetch(server + endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Server error');
  }

  return response.json();
};

const handleLogin = async (params) => {
  console.log('handleLogin params: ', params);

  const { signature, payload } = params;

  const { token } = await sendRequest('/auth/login', 'POST', {
    payload,
    signature,
  });

  localStorage.setItem('auth_token', token);
  return token;
};

const handleLogout = async () => {
  await sendRequest('/auth/logout', 'POST');
  localStorage.removeItem('auth_token');
  console.log('Logged out successfully');
};

const checkLoginStatus = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return false;

  try {
    const { user } = await sendRequest('/auth/check', 'GET', null, {
      Authorization: `Bearer ${token}`,
    });
    return !!user;
  } catch (error) {
    console.error('Login status check failed:', error.message);
    return false;
  }
};

const getLoginPayload = (params) => {
  console.log('params', params);

  const { payload } = params;
  return {
    address: payload.address,
    message: payload.message,
  };
};

export default function AuthButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      connectModal={{ size: 'compact' }}
      auth={{
        async doLogin(params) {
          const data = await handleLogin(params);

          console.log('data', data);

          const verifiedPayload = await thirdwebAuth.verifyPayload(params);
          setLoggedIn(verifiedPayload.valid);
        },
        async doLogout() {
          // here you should call your backend to logout the user if needed
          // and delete any local auth tokens
          setLoggedIn(false);
        },
        async getLoginPayload(params) {
          console.log('getLoginPayload params: ', params);
          // here you should call your backend, using generatePayload to return
          // a SIWE compliant login payload to the client
          return thirdwebAuth.generatePayload(params);
        },
        async isLoggedIn() {
          // here you should ask you backend if the user is logged in
          // can use cookies, storage, or your method of choice
          return loggedIn;
        },
      }}
    />
  );
}
