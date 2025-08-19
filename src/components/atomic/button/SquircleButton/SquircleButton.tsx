'use client';

import React from "react";
import styles from "./SquircleButton.module.css";
import SquircleFrame from "@/components/atomic/basic/SquircleFrame/SquircleFrame";
import useElementSize from "@/hooks/useElementSize";
import {Icon} from "@iconify/react";

import ButtonProps from "@/types/properties/button"

function SquircleButton({
                            alt = "按钮", icon, text, subtext, style, iconStyle, textStyle, subtextStyle, ...rest
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
                fill: "transparent",
                height: size.height,
                stroke: 'var(--color-border)',
                strokeWidth: 1,
                width: size.width
            }}/>
        <div className={styles.container} style={style}>
            {icon && <Icon icon={icon} className={styles.icon} style={iconStyle}/>}
            {text && <span className={styles.text} style={textStyle}>{text}</span>}
            {subtext && <span className={styles.subtext} style={subtextStyle}>{subtext}</span>}
        </div>
    </button>
}

export default SquircleButton;
