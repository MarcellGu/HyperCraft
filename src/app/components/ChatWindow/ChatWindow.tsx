import styles from './ChatWindow.module.css';
import message from "@/types/message";
import ReactMarkdown from 'react-markdown';
import React, {useEffect, useRef} from 'react';

function ChatWindow({messages}: { messages: message[] }) {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);
    return <div className={styles.chatWindow}>
        {messages.map(message => {
            if (message.role === 'system') {
                return (<div key={message.id} className={styles.systemMessage}>
                    <hr className={styles.systemSeparator}/>
                    <div className={styles.systemText}>{message.content}</div>
                    <hr className={styles.systemSeparator}/>
                </div>);
            } else if (message.role === 'user') {
                return (<div key={message.id} className={styles.userMessage}>
                    {message.content}
                </div>);
            } else if (message.role === 'assistant') {
                // 支持流式未闭合<think>标签的渲染
                const content = message.content;
                const parts = [];
                let lastIndex = 0;
                let inThink = false;
                const regex = /<think>|<\/think>/g;
                let match;
                while ((match = regex.exec(content)) !== null) {
                    if (match.index > lastIndex) {
                        parts.push({type: inThink ? 'think' : 'normal', text: content.slice(lastIndex, match.index)});
                    }
                    if (match[0] === '<think>') {
                        inThink = true;
                    } else if (match[0] === '</think>') {
                        inThink = false;
                    }
                    lastIndex = regex.lastIndex;
                }
                if (lastIndex < content.length) {
                    parts.push({type: inThink ? 'think' : 'normal', text: content.slice(lastIndex)});
                }
                return (
                    <div key={message.id} className={styles.assistantMessage}>
                        {parts.map((part, idx) =>
                            part.type === 'think' ? (
                                <span key={idx} style={{color: '#aaa'}}>{part.text}</span>
                            ) : (
                                <ReactMarkdown key={idx}>{part.text}</ReactMarkdown>
                            )
                        )}
                    </div>
                );
            }
        })}
        <div ref={bottomRef}/>
    </div>;
}

export default ChatWindow;
