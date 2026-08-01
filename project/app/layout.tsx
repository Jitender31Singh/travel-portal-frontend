import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import { EnquiryProvider } from '@/components/EnquiryContext';
import { HideOnAdmin } from '@/components/HideOnAdmin';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GoonnexTrip — Explore India\'s Best Destinations & Treks',
  description: 'Book tour packages and treks across India with GoonnexTrip. Best prices, expert guides, safe travel.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EnquiryProvider>
          <HideOnAdmin>
            <Navbar />
          </HideOnAdmin>
          <main>{children}</main>
          <HideOnAdmin>
            <Footer />
            <EnquiryModal />
          </HideOnAdmin>
        </EnquiryProvider>
      </body>
    </html>
  );
}
