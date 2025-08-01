import React from "react";
import styles from "./SideBar.module.css"
import LayoutProps from "@/components/layout/interface";

function SideBar({children, style}: LayoutProps) {
    return <aside className={styles.sideBar} style={style}>
        {children}
    </aside>
}

export default SideBar;
