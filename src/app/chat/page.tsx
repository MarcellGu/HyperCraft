'use client'

import React, {useState} from "react";
import InputBox from '@/components/composite/InputBox/InputBox'
import MessageSection from "@/components/composite/MessageSection/MessageSection";
import message from "@/types/common/message";
import styles from './page.module.css'

function Page() {
    const [messages, setMessages] = useState<message[]>([]);
    const [input, setInput] = useState('');

    const addMessage = (role: "user" | "assistant" | "system", value: string) => {
        setMessages(prevMessages => [
            ...prevMessages,
            {
                id: prevMessages.length,
                role: role,
                content: value,
                timestamp: new Date()
            }
        ]);
    }

    const sendMessage = async () => { // 将函数改为 async
        if (input) {
            addMessage("user", input);
            setInput('');
            addMessage("assistant", input);
        }
    }

    return <div id={"page"} className={styles.page}>
        <main className={styles.main}>
            <MessageSection messages={messages}/>
            <InputBox style={{position: "absolute", bottom: messages.length === 0 ? "auto" : 0}}
                      input={input} setInput={setInput}
                      sendMessage={sendMessage}/>
        </main>
    </div>
}

export default Page;
