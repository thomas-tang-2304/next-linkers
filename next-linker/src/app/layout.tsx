"use client";

import { Inter } from "next/font/google";
import { io } from "socket.io-client";
import "./globals.css";
import { createContext, useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export const SocketContext = createContext<any>(0);


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // }, []);
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container mx-auto w-[90%] w-lg-[1100px]">
         
            {children}
          
        </div>
      </body>
    </html>
  );
}
