'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { GoogleOAuthProvider } from "@react-oauth/google";

// Dynamically import Root to avoid SSR issues with wallet context
const Root = dynamic(() => import('@/components/common/Root'), { 
  ssr: false 
});

interface ClientRootWrapperProps {
  children: ReactNode;
}

export default function ClientRootWrapper({ children }: ClientRootWrapperProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Root>{children}</Root>
    </GoogleOAuthProvider>
  );
} 