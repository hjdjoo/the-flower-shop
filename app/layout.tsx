import type { Metadata } from 'next'


import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { ThemeProvider } from '@mui/material/styles'

import '@/styles/global.css'
import theme from '../styles/theme'
import { Navbar } from './_components/Navbar'

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
  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <body>
            <Navbar />
            <main>
              {children}
            </main>
          </body>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </html>
  )
};
