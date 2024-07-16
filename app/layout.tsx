import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';


import '@/styles/global.css';
import theme from '../styles/theme';
import { Navbar } from './_components/Navbar';

import { UserProvider } from '@/lib/contexts/UserContext';

import { CartProvider } from '@/lib/contexts/CartContext';

import { createClient } from "@/utils/supabase/server";

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

  const cookieStore = cookies();
  const supabase = createClient();

  const userRole = cookieStore.get("userRole")?.value;
  const user = { role: userRole ? userRole : "guest" }

  await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <UserProvider currentUser={user}>
              <CartProvider>
                <Navbar />
                <main>
                  {children}
                </main>
              </CartProvider>
            </UserProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
};
