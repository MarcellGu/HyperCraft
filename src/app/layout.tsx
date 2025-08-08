import React from "react";
import type {Metadata} from "next";
import '@/styles/global.css';
import BackgroundLayer from "@/components/layer/BackgroundLayer/BackgroundLayer";
import ContentLayer from "@/components/layer/ContentLayer/ContentLayer";
import ContentSection from "@/components/section/ContentSection/ContentSection";
import AuxiliaryLayer from "@/components/layer/AuxiliaryLayer/AuxiliaryLayer";
import SideBar from "@/components/section/SideBar/SideBar";
import ModalLayer from "@/components/layer/ModalLayer/ModalLayer";
import ToastLayer from "@/components/layer/ToastLayer/ToastLayer";
import OverlayLayer from "@/components/layer/OverlayLayer/OverlayLayer";
import DebugLayer from "@/components/layer/DebugLayer/DebugLayer";


export const metadata: Metadata = {
    title: "HyperCraft", description: "Modern Chat Interface With Simple Design"
};

export default function Layout({children}: Readonly<{ children: React.ReactNode }>) {
    return <html lang="zh">
    <body>
    <BackgroundLayer/>
    <ContentLayer>
        <ContentSection>{children}</ContentSection>
    </ContentLayer>

    <AuxiliaryLayer>
        <SideBar>

        </SideBar>
    </AuxiliaryLayer>

    <ModalLayer>

    </ModalLayer>

    <ToastLayer>

    </ToastLayer>

    <OverlayLayer>

    </OverlayLayer>

    <DebugLayer>

    </DebugLayer>

    </body>
    </html>
}
