'use client'

import Head from 'next/head'

import Providers from '../../providers'
import Header from '@/components/Header'
import PageTransitionEffect from '../components/PageTransitionEffect'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

import '@/styles/globals.css'
// export const metadata = {
//   title: 'Next.js',
//   description: 'Generated by Next.js',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <Head>
        <title>WalletConnect | Next Starter Template</title>
        <meta name='description' content='Generated by create-wc-dapp' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <body>
        <Providers>
          <div className="bg-[url('/images/third-baackground.svg')] bg-center flex w-full h-auto min-h-screen flex-col px-7 pb-6">
            <div className='md:container md:mx-auto md:px-16 mt-8'>
              <Header />

              <PageTransitionEffect>
              {children}
              </PageTransitionEffect>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
