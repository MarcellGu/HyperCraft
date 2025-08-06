'use client'

import React from "react";

import styles from './MessageBox.module.css';
import SquircleFrame from "@/components/common/basic/SquircleFrame/SquircleFrame";
import useElementSize from "@/hooks/useElementSize";
import CapsuleButton from "@/components/common/button/CapsuleButton/CapsuleButton";

interface MessageBoxProps {
    placeholder: string;
    style: {
        borderRadius: number; fill: string; stroke: string; strokeWidth: number; margin?: number; padding?: number;
    };
    sendMessage?: (message: string) => (void);
}

function MessageBox({placeholder, style, sendMessage}: MessageBoxProps) {
    const ref = React.useRef<HTMLDivElement>(null);
    const {borderRadius, fill, stroke, strokeWidth, margin, padding} = style;
    const size = useElementSize(ref);
    const [value, setValue] = React.useState("");
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (!value || value.trim() === "") {
            return; // 如果输入为空，则不发送
        }
        if (sendMessage) sendMessage(value);
        setValue("");
        if (textareaRef.current) {
            textareaRef.current.value = "";
            adjustHeight();
        }
    };

    const handleChange = (element: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(element.target.value);
    };

    const handleInput = () => {
        adjustHeight();
    };

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
        }
    };
    return <div id={"MessageBox"} className={styles.messageBox} ref={ref}>
        <SquircleFrame style={{
            borderRadius, fill, stroke, strokeWidth, width: size.width, height: size.height
        }}/>
        <div className={styles.container} style={{margin, padding}}>
            <textarea className={styles.textarea}
                      placeholder={placeholder}
                      value={value}
                      rows={2}
                      ref={textareaRef}
                      onInput={handleInput}
                      onChange={handleChange}
                      onKeyDown={(event) => {
                          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                              event.preventDefault();
                              handleSend();
                          }
                      }}
            />
            <div className={styles.buttonContainer}>
                <div className={styles.left}>
                    <CapsuleButton icon={"gravity-ui:cloud-arrow-up-in"}
                                   text={"上传"}
                                   alt={"上传文件"}/>
                    <CapsuleButton icon={"gravity-ui:compass"}
                                   text={"联网"}
                                   alt={"联网搜索"}/>
                </div>
                <div className={styles.right}>
                    <CapsuleButton icon={"gravity-ui:microphone"}
                                   text={"听写"} alt={"语音输入"}/>
                    <CapsuleButton icon={"gravity-ui:location-arrow"}
                                   alt={"发送"}
                                   text={"发送"} onClick={() => {
                        handleSend()
                    }}/>
                </div>
            </div>
        </div>
    </div>
}

export default MessageBox;
