'use client'

import React, {useState} from "react";
import InputBox from '@/components/composite/InputBox/InputBox'
import MessageSection from "@/components/composite/MessageSection/MessageSection";
import message from "@/types/common/message";
import styles from './page.module.css'

function Page() {
    const [messages, setMessages] = useState<message[]>([]);
    const [input, setInput] = useState('');
    const [showLeftSidebar, setShowLeftSidebar] = useState(false);
    const [showRightSidebar, setShowRightSidebar] = useState(false);

    const addMessage = (role: "user" | "assistant" | "system", value: string) => {
        setMessages(prevMessages => [...prevMessages, {
            id: prevMessages.length, role: role, content: value, timestamp: new Date()
        }]);
    }

    const sendMessage = async () => { // 将函数改为 async
        if (input) {
            addMessage("user", input);
            setInput('');

            // 创建一个新的assistant消息，用于流式更新
            addMessage("assistant", "");

            // 发送请求
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{role: "user", content: input}],
                    model: "glm-4.5-x"
                })
            });

            // 处理流式响应
            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let assistantMessage = "";

                try {
                    while (true) {
                        const {done, value} = await reader.read();
                        if (done) break;

                        // 解码数据
                        const chunk = decoder.decode(value, {stream: true});
                        assistantMessage += chunk;

                        // 更新assistant消息
                        setMessages(prevMessages => {
                            const newMessages = [...prevMessages];
                            const lastMessage = newMessages[newMessages.length - 1];
                            if (lastMessage.role === "assistant") {
                                newMessages[newMessages.length - 1] = {
                                    ...lastMessage,
                                    content: assistantMessage
                                };
                            }
                            return newMessages;
                        });
                    }
                } catch (error) {
                    console.error("Error reading stream:", error);
                } finally {
                    reader.releaseLock();
                }
            }
        }
    }
    // 鼠标移动时显示侧边栏
    const handleMouseMove = (e: React.MouseEvent) => {

        // 如果鼠标靠近屏幕左边缘，显示左侧边栏
        if (e.clientX < 30) {
            setShowLeftSidebar(true);
        } else {
            // 鼠标离开左边缘时立即隐藏左侧边栏
            setShowLeftSidebar(false);
        }

        // 如果鼠标靠近屏幕右边缘，显示右侧边栏
        if (e.clientX > window.innerWidth - 30) {
            setShowRightSidebar(true);
        } else {
            // 鼠标离开右边缘时立即隐藏右侧边栏
            setShowRightSidebar(false);
        }
    };

    return <div id={"page"} className={styles.page} onMouseMove={handleMouseMove}>

        <aside id={"sidebar-left"} className={`${styles.sidebar} ${styles.sidebarLeft}`}
               style={{
                   transform: showLeftSidebar ? 'translateX(0)' : 'translateX(-300px)',
                   transition: 'transform 0.3s ease'
               }}></aside>
        <header className={styles.header}>
        </header>
        <main className={styles.main}>
            <MessageSection messages={messages}/>
            <InputBox input={input} setInput={setInput}
                      sendMessage={sendMessage}/>
        </main>
        <footer className={styles.footer}>
            对话内容由大模型生成，仅供参考。
        </footer>
        <aside id={"sidebar-right"} className={`${styles.sidebar} ${styles.sidebarRight}`}
               style={{
                   transform: showRightSidebar ? 'translateX(0)' : 'translateX(300px)',
                   transition: 'transform 0.3s ease'
               }}></aside>
    </div>
}

export default Page;
