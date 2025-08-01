import type {Metadata} from "next";
import '@/styles/global.css';
import React from "react";

export const metadata: Metadata = {
    title: "HyperCraft",
    description: "Modern Chat Interface With Simple Design"
};

export default function Layout({children}: Readonly<{ children: React.ReactNode }>) {
    return <html lang="zh">
    <body>
    {children}
    </body>
    </html>
}
