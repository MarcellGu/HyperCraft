'use client'

import React from "react";
import styles from "./CapsuleButton.module.css";
import ButtonProps from "@/types/properties/button"
import {Icon} from "@iconify/react";

export default function CapsuleButton({
                                          icon,
                                          text = "按钮",
                                          alt = "按钮",
                                          iconStyle,
                                          textStyle,
                                          ...rest
                                      }: ButtonProps) {
    return <button {...rest}
                   type="button"
                   className={styles.button}
                   aria-label={alt}>
        {icon && <Icon icon={icon} className={styles.icon} style={iconStyle}/>}
        <span className={styles.text} style={textStyle}>{text}</span>
    </button>;
}
