'use server';
import { createAuth } from 'thirdweb/auth';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { client } from '../../util/client';
import { cookies } from 'next/headers';

import { sign } from 'jsonwebtoken';

// TODO: Константы/url вынести в .env

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY;

const backendUrl = process.env.API_HOST //'http://127.0.0.1:8000'

if (!privateKey) {
  throw new Error('Missing THIRDWEB_ADMIN_PRIVATE_KEY in .env file.');
}

const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || '',
  adminAccount: privateKeyToAccount({ client, privateKey }),
});

export const generatePayload = thirdwebAuth.generatePayload;

export async function login(payload) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  if (verifiedPayload.valid) {
    try {
      const options = {
        expiresIn: '2m', // Время жизни токена (2 минуты)
        algorithm: 'HS256',
      };

      const token = sign(
        {
          payload: verifiedPayload.payload,
        },
        privateKey,
        options
      );

      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload: verifiedPayload.payload, token }),
      });

      if (!response.ok) {
        throw new Error('Ошибка авторизации');
      }

      const data = await response.json();
      const jwt = data.token;

      cookies().set('jwt', jwt);
    } catch (error) {
      console.error('Ошибка логина:', error);
    }
  }
}

export async function isLoggedIn() {
  const jwt = cookies().get('jwt');
  if (!jwt?.value) {
    return false;
  }
  const response = await fetch(`${backendUrl}/auth/check`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt.value}`,
    },
  });

  if (response.status === 401) {
    return false;
  }

  return true;
}

export async function logout() {
  cookies().delete('jwt');
}
