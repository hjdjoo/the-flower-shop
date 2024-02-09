import type { Metadata } from 'next'
import '@/styles/global.css'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'
import { Navbar } from '@/app/components/Navbar'


import bcrypt from 'bcrypt'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'


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

  const imageUrls = getImages();

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Navbar />
            <main>
              {children}
            </main>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
};

// initial function for getting sample image set from supabase
async function getImages(): Promise<Array<string> | undefined> {
  const cookieStore = cookies();
  const { SUPABASE_URL, SUPABASE_KEY } =
    process.env;
  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      }
    }
  })
  try {
    const { data, error } = await supabase
      .storage
      .from('products')
      .list('arrangements', {
        limit: 10,
        offset: 1
      })

    const urls = await data?.map((img): string => {
      return img.name
    })

    return urls;
  }
  catch (err) {
    console.error(err);
  }
}