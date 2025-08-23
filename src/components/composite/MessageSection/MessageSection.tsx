import React from "react";
import message from "@/types/common/message";
import styles from "./MessageSection.module.css";
import CopyButton from "@/components/atomic/button/CopyButton/CopyButton";
import RetryButton from "@/components/atomic/button/RetryButton/RetryButton";
import UserMessage from "@/components/atomic/message/UserMessage/UserMessage";
import SystemMessage from "@/components/atomic/message/SystemMessage/SystemMessage";
import AssistantMessage from "@/components/atomic/message/AssistantMessage/AssistantMessage";


function MessageSection({messages, style}: { messages: message[], style?: React.CSSProperties }) {
    // 复制消息内容到剪贴板
    const copyMessage = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
            console.log("复制成功");
        });
    };

    // 重新生成消息的处理函数（需要父组件传递）
    const regenerateMessage = () => {
        // 这里需要父组件传递重新生成的处理函数
        console.log("重新生成消息");
    };

    return <section className={styles.section} style={style}>
        {messages.map((message) => {
            if (message.role === "user") {
                return <UserMessage key={message.id} content={message.content}
                                    className={`${styles.message} ${styles[message.role]}`}/>
            } else if (message.role === "assistant") {
                return <AssistantMessage key={message.id} content={message.content}
                                         className={`${styles.message} ${styles[message.role]}`}>
                    <div className={styles.toolbar}>
                        <CopyButton onClick={() => copyMessage(message.content)}/>
                        <RetryButton onClick={regenerateMessage}/>
                    </div>
                </AssistantMessage>
            } else if (message.role === "system") {
                return <SystemMessage key={message.id} content={message.content}
                                      className={`${styles.message} ${styles[message.role]}`}/>;
            }
        })}
    </section>
}

export default MessageSection;
