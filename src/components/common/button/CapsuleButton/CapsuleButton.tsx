'use client'

import React from "react";
import styles from "./CapsuleButton.module.css";
import ButtonProps from "@/components/common/button/interfaces"
import {Icon} from "@iconify/react";

export default function CapsuleButton({
                                          icon,
                                          text = "按钮",
                                          alt = "按钮",
                                          ...rest
                                      }: ButtonProps) {
    return <button {...rest} type="button"
                   className={styles.button}
                   aria-label={alt}>
        {icon && <Icon icon={icon} className={styles.icon}/>}
        <span className={styles.text}>{text}</span>
    </button>;
}
