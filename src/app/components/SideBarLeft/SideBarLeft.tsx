'use client'

import React from "react";
import SideBar from "@/components/layout/SideBar/SideBar";
import SquircleButton from "@/components/common/button/SquircleButton/SquircleButton";
import ListHistory from "@/app/components/ListHistory/ListHistory";
import {useRouter} from "next/navigation";

function SideBarLeft() {
    const router = useRouter();
    return <SideBar style={{left: 0}}>
        <SquircleButton icon={"gravity-ui:comment-plus"}
                        alt={"新建对话"}
                        onClick={() => {
                            const uuid = crypto.randomUUID();
                            router.push(`/chat/${uuid}`);
                        }}
                        text={"新建对话"}
                        subtext={"⌘ + K"}/>
        <SquircleButton icon={"gravity-ui:clock-arrow-rotate-left"}
                        alt={"搜索历史记录"}
                        text={"搜索历史"}
                        subtext={"⌘ + H"}/>
        <ListHistory/>
    </SideBar>
}

export default SideBarLeft;
