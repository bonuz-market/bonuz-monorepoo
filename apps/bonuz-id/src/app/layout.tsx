'use client'

import Head from 'next/head'

import Header from '@/components/Header'
import { ToastContainer } from 'react-toastify'
import Providers from '../../providers'
import PageTransitionEffect from '../components/PageTransitionEffect'

  import 'react-toastify/dist/ReactToastify.css'
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
          <div className="flex w-full h-screen flex-col px-7 pb-6"
          style={{
            backgroundImage: "url(/images/third-baackground.svg)",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            overflow: 'auto',
            
          }}
          >
            <div className='md:container md:mx-auto md:px-16 mt-8'>
              <Header />

              <PageTransitionEffect>
              {children}
              </PageTransitionEffect>
            </div>
          <ToastContainer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
