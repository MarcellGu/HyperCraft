import React from "react";
import type {Metadata} from "next";
import '@/styles/global.css';

import BackgroundLayer from "@/components/layer/BackgroundLayer";
import ContentLayer from "@/components/layer/ContentLayer";
import ModalLayer from "@/components/layer/ModalLayer";
import ToastLayer from "@/components/layer/ToastLayer";
import OverlayLayer from "@/components/layer/OverlayLayer";


export const metadata: Metadata = {
    title: "HyperCraft", description: "Modern Interface With Simple Design"
};

export default function Layout({children}: Readonly<{ children: React.ReactNode }>) {
    return <html lang="zh">
    <body>
    <BackgroundLayer/>
    <ContentLayer>
        {children}
    </ContentLayer>
    <ModalLayer/>
    <ToastLayer/>
    <OverlayLayer/>
    </body>
    </html>
}
