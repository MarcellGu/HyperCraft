'use client';

import React from "react";
import styles from "./SquircleButton.module.css";
import SquircleFrame from "@/components/common/basic/SquircleFrame/SquircleFrame";
import useElementSize from "@/hooks/useElementSize";
import {Icon} from "@iconify/react";

import ButtonProps from "@/components/common/button/interfaces"

function SquircleButton({
                            alt = "按钮", icon, text, subtext, style, ...rest
                        }: ButtonProps) {
    const ref = React.useRef<HTMLButtonElement>(null);
    const size = useElementSize(ref)
    const {borderRadius = 10} = style || {borderRadius: 10};
    return <button {...rest} type="button"
                   className={styles.button}
                   aria-label={alt}
                   ref={ref}>
        <SquircleFrame
            style={{
                borderRadius: borderRadius,
                fill: "none",
                height: size.height,
                stroke: 'var(--color-border)',
                strokeWidth: 1,
                width: size.width
            }}/>
        <div className={styles.container}>
            {icon && <Icon icon={icon} className={styles.icon}/>}
            {text && <span className={styles.text}>{text}</span>}
            <span className={styles.gap}/>
            {subtext && <span className={styles.subtext}>{subtext}</span>}
        </div>
    </button>
}

export default SquircleButton;
