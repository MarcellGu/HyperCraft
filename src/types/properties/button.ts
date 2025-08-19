import React from "react";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    alt: string;
    icon: string;
    text: string;
    subtext?: string;
    style?: React.CSSProperties & {
        borderRadius?: number;
    }
    iconStyle?: React.CSSProperties;
    textStyle?: React.CSSProperties;
    subtextStyle?: React.CSSProperties;
}

export default ButtonProps;
