import type { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
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
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  );
}
