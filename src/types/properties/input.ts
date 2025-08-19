import React from "react";

interface InputProps {
    input: string;
    setInput: (value: string) => void;
    sendMessage: () => void;
    style?: React.CSSProperties;
}

export default InputProps;
