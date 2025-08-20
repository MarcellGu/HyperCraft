'use client'

import React, {useRef, useState} from "react";
import styles from "./RetryButton.module.css";
import SquircleFrame from "@/components/atomic/basic/SquircleFrame/SquircleFrame";
import {Icon} from "@iconify/react";

import ButtonProps from "@/types/properties/button"

function RetryButton({style, onClick, ...rest}: ButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const alt = "重试"
    const [icon, setIcon] = useState("gravity-ui:arrows-rotate-left");

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // 调用原始的onClick处理函数
        if (onClick) {
            onClick(e);
        }

        setIcon("gravity-ui:check");

        setTimeout(() => {
            setIcon("gravity-ui:arrows-rotate-left");
        }, 500);
    };

    return <button {...rest}
                   type="button"
                   ref={ref}
                   aria-label={alt}
                   style={style}
                   className={styles.button}
                   onClick={handleClick}>
        <SquircleFrame
            style={{
                borderRadius: 8,
                fill: "transparent",
                stroke: 'transparent',
                strokeWidth: 1,
                width: 32,
                height: 32,
            }}/>
        <Icon icon={icon} className={styles.icon}/>
    </button>
}

export default RetryButton;
