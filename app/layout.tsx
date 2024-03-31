import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';

import '@/styles/global.css';
import theme from '../styles/theme';
import { Navbar } from './_components/Navbar';

import { UserProvider } from '@/lib/contexts/UserContext';

import { createClient } from '@/utils/supabase/server';
import checkAdmin from '@/utils/supabase/checkAdmin';

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Flower Shop',
  description: 'The Flower Shop',
}

export default async function RootLayout(
  {
    children,
  }
    :
    {
      children: React.ReactNode
    }
) {
  // console.log('Navbar/isAdmin: ', isAdmin);
  const user = {
    role: "guest"
  }

  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <UserProvider currentUser={user}>
            <body>
              <Navbar />
              <main>
                {children}
              </main>
            </body>
          </UserProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  )
};
