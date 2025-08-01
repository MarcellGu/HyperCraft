'use client';

import React from "react";

import styles from "./page.module.css";
import ContentSection from "@/components/layout/ContentSection/ContentSection";
import HeroTitle from "@/components/common/title/HeroTitle/HeroTitle";
import MessageBox from "@/app/components/MessageBox/MessageBox";
import usePageLoaded from "@/hooks/usePageLoaded";
import SideBarLeft from "@/app/components/SideBarLeft/SideBarLeft";
import SideBarRight from "@/app/components/SideBarRight/SideBarRight";
import {useRouter} from "next/navigation";

export default function Page() {
    const loaded = usePageLoaded()
    const router = useRouter();
    return <div id={"page"} className={styles.page} style={{visibility: loaded ? "visible" : "hidden"}}>
        <SideBarLeft/>
        <ContentSection>
            <HeroTitle title={"HyperCraft"}/>
            <MessageBox placeholder={"询问任何问题"} style={{
                borderRadius: 30,
                fill: "var(--color-background-primary)",
                stroke: "var(--color-border)",
                strokeWidth: 1,
                margin: 0,
                padding: 12
            }} sendMessage={(input) => {
                const uuid = crypto.randomUUID();
                if (input && input.trim()) {
                    sessionStorage.setItem(`chat_init_${uuid}`, input);
                }
                router.push(`/chat/${uuid}`);
            }}/>
        </ContentSection>
        <SideBarRight/>
    </div>
}
