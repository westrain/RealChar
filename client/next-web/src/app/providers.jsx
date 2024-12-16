'use client';

import { ThirdwebProvider } from 'thirdweb/react';
import { NextUIProvider } from '@nextui-org/react';
import { AuthContextProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider>
        <NextUIProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </NextUIProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
