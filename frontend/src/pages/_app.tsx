import type { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import '@/styles/globals.css';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Head>
        <title>GoPilot-X | Startup Public Procurement Sandbox</title>
        <meta name="description" content="GoPilot-X: Outcome-based public procurement mechanism enabling government departments to identify, pilot, procure, and scale innovative solutions from eligible startups." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  );
}

