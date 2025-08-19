'use client'
import React from "react";
import styles from "./InputBox.module.css"
import InputProps from "@/types/properties/input";
import CapsuleButton from "@/components/atomic/button/CapsuleButton/CapsuleButton";

function InputBox({input, setInput, sendMessage, style}: InputProps) {

    return <form id={"InputBox"} className={styles.inputBox} style={style}>
        <div id={"InputContainer"} className={styles.textContainer}>
        <textarea className={styles.textarea}
                  placeholder={"询问任何问题"}
                  style={{resize: "none"}}
                  value={input}
                  rows={2}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(event) => {
                      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                          event.preventDefault();
                          sendMessage();
                      }
                  }}/>
        </div>


        <div id={"ButtonContainer"} className={styles.buttonContainer}>
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
                    sendMessage();
                }}/>
            </div>
        </div>

    </form>
}

export default InputBox;
