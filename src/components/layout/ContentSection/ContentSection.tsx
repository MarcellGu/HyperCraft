import React from "react";
import styles from './ContentSection.module.css';
import LayoutProps from "@/components/layout/interface";

function ContentSection({children, style}: LayoutProps) {
    return <main className={styles.content} style={style}>
        {children}
    </main>
}

export default ContentSection;
