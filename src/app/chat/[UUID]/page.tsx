'use client';

import React from "react";
import {useParams, useRouter} from 'next/navigation';

import styles from "./page.module.css";
import ContentSection from "@/components/layout/ContentSection/ContentSection";
import SideBar from "@/components/layout/SideBar/SideBar";
import SquircleButton from "@/components/common/button/SquircleButton/SquircleButton";
import ListHistory from "@/app/components/ListHistory/ListHistory";
import MessageBox from "@/app/components/MessageBox/MessageBox";
import message from "@/types/message";
import ChatWindow from "@/app/components/ChatWindow/ChatWindow";
import {sendCompletionStream} from "@/utils/requestHandler/sendCompletionStream";
import HeroTitle from "@/components/common/title/HeroTitle/HeroTitle";
import usePageLoaded from "@/hooks/usePageLoaded";
import {useChatHistory} from "@/hooks/useChatHistory";
import SideBarRight from "@/app/components/SideBarRight/SideBarRight";
import SideBarLeft from "@/app/components/SideBarLeft/SideBarLeft";

function Page() {
    const router = useRouter();
    const params = useParams();
    const loaded = usePageLoaded();
    const [messages, setMessages] = React.useState<message[]>([]);
    const [isLoadingSession, setIsLoadingSession] = React.useState(false);

    const {saveSession, saveMessage, loadSessionMessages} = useChatHistory();
    const sessionId = params?.UUID as string;

    // 加载现有会话的消息
    React.useEffect(() => {
        async function loadExistingSession() {
            if (!sessionId) return;

            setIsLoadingSession(true);
            try {
                const existingMessages = await loadSessionMessages(sessionId);
                if (existingMessages.length > 0) {
                    setMessages(existingMessages);
                } else {
                    // 如果没有现有消息，清空消息列表确保是新会话
                    setMessages([]);
                }
            } catch (error) {
                console.error('Failed to load session:', error);
            } finally {
                setIsLoadingSession(false);
            }
        }

        loadExistingSession();
    }, [sessionId, loadSessionMessages]);

    const persistMessage = React.useCallback(async (msg: message) => {
        if (sessionId) {
            try {
                await saveMessage(sessionId, {...msg, sessionId});
            } catch (error) {
                console.error('Failed to save message:', error);
            }
        }
    }, [sessionId, saveMessage]);

    const persistSession = React.useCallback(async (updatedMessages: message[]) => {
        if (sessionId && updatedMessages.length > 0) {
            try {
                await saveSession(sessionId, updatedMessages);
            } catch (error) {
                console.error('Failed to save session:', error);
            }
        }
    }, [sessionId, saveSession]);

    const updateMessage = React.useCallback((newMessage: message) => {
        const messageWithSession = {...newMessage, sessionId};
        setMessages(prevMessages => {
            const updated = [...prevMessages, messageWithSession];
            // 异步保存消息和会话
            persistMessage(messageWithSession);
            persistSession(updated);
            return updated;
        });
    }, [sessionId, persistMessage, persistSession]);

    const onSendMessage = React.useCallback(async (messageContent: string) => {
        if (!sessionId) return;

        // Push user message
        const userMessage: message = {
            id: crypto.randomUUID(),
            content: messageContent,
            timestamp: Date.now(),
            role: 'user',
            sessionId
        };

        // 先将用户消息加入临时上下文
        const contextMessages = [...messages, {role: 'user', content: messageContent}];
        updateMessage(userMessage);

        // Prepare assistant placeholder
        const assistantId = crypto.randomUUID();
        const assistantPlaceholder: message = {
            id: assistantId,
            content: '',
            timestamp: Date.now(),
            role: 'assistant',
            sessionId
        };
        updateMessage(assistantPlaceholder);

        try {
            // 保存当前会话ID的引用，避免异步操作中的会话污染
            const currentSessionId = sessionId;

            // Stream response and append chunks
            await sendCompletionStream(contextMessages.map(m => ({
                role: m.role as "user" | "assistant" | "system",
                content: m.content
            })), (chunk) => {
                // 只在当前会话ID匹配时才更新消息
                setMessages(prev => {
                    // 确保只更新属于当前会话的消息
                    return prev.map(m => {
                        if (m.id === assistantId && m.sessionId === currentSessionId) {
                            return {...m, content: m.content + chunk};
                        }
                        return m;
                    });
                });
            });

            // 流式响应完成后，保存最终的助手消息
            setMessages(prev => {
                const finalMessages = [...prev];
                const assistantMessage = finalMessages.find(m =>
                    m.id === assistantId && m.sessionId === currentSessionId
                );
                if (assistantMessage) {
                    persistMessage(assistantMessage);
                    persistSession(finalMessages.filter(m => m.sessionId === currentSessionId));
                }
                return finalMessages;
            });

        } catch (error) {
            console.error('Streaming error:', error);
        }
    }, [sessionId, messages, updateMessage, persistMessage, persistSession]);

    // 处理初始消息的单独effect，只在会话加载完成且确认是新会话时执行
    React.useEffect(() => {
        if (!sessionId || isLoadingSession || messages.length > 0) return;

        const initMsg = sessionStorage.getItem(`chat_init_${sessionId}`);
        if (initMsg && initMsg.trim()) {
            // 确保页面和所有依赖都已就绪
            const timer = setTimeout(() => {
                onSendMessage(initMsg);
                sessionStorage.removeItem(`chat_init_${sessionId}`);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [sessionId, isLoadingSession, messages.length, onSendMessage]);

    // 显示加载状态
    if (isLoadingSession) {
        return <div id={"page"} className={styles.page}>
            <SideBar style={{left: 0}}>
                <SquircleButton icon={"gravity-ui:comment-plus"}
                                alt={"新建对话"}
                                onClick={() => {
                                    const uuid = crypto.randomUUID();
                                    router.push(`/chat/${uuid}`);
                                }}
                                text={"新建对话"}
                                subtext={"⌘ + K"}/>
                <SquircleButton icon={"gravity-ui:clock-arrow-rotate-left"}
                                alt={"搜索历史记录"}
                                text={"搜索历史"}
                                subtext={"⌘ + H"}/>
                <ListHistory/>
            </SideBar>
            <ContentSection>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    color: 'var(--color-text-secondary)'
                }}>
                    加载对话中...
                </div>
            </ContentSection>
        </div>;
    }

    return <div id={"page"} className={styles.page} style={{visibility: loaded ? "visible" : "hidden"}}>
        <SideBarLeft/>
        <ContentSection>
            {messages.length === 0 && <HeroTitle title={"HyperCraft"}/>}
            {messages.length !== 0 && <ChatWindow messages={messages}/>}
            {messages.length === 0 ? <MessageBox placeholder={"询问任何问题"} style={{
                borderRadius: 30,
                fill: "var(--color-background-primary)",
                stroke: "var(--color-border)",
                strokeWidth: 1,
                margin: 0,
                padding: 12
            }} sendMessage={onSendMessage}/> : <div style={{justifySelf: "flex-end"}}>
                <MessageBox placeholder={"询问任何问题"} style={{
                    borderRadius: 30,
                    fill: "var(--color-background-primary)",
                    stroke: "var(--color-border)",
                    strokeWidth: 1,
                    margin: 0,
                    padding: 12
                }} sendMessage={onSendMessage}/>
            </div>}
        </ContentSection>
        <SideBarRight/>
    </div>
}

export default Page;
