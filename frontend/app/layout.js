// import { Inter } from "next/font/google";

import Header from './components/Common/Header.js';
import Footer from './components/Common/Footer.js';


import "./globals.css";
import './css/app.css';
import './css/header.css';
import './css/footer.css';

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GameVerse",
  description: "Videogames' Blogs App",
};

export const viewport = {
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
}

export default function RootLayout({ children }) {
  
  return (
    <html lang="es">
      <head>
        <link
          rel="icon"
          href="/img/favicon.ico"
          sizes="any"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <Header/>
        {children}
        <Footer />
      </body>
    </html>
  );
}
