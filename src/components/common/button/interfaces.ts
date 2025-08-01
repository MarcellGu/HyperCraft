import React from "react";

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
    alt?: string;
    icon?: string;
    text?: string;
    subtext?: string;
    style?: {
        borderRadius?: number;
    };
}

export default ButtonProps;
