import {useCallback, useEffect, useState} from 'react';
import {ChatSession, dbManager, StoredMessage} from '@/utils/storage/indexedDB';
import message from '@/types/message';

export function useChatHistory() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(false);

    // 加载所有会话
    const loadSessions = useCallback(async () => {
        try {
            setLoading(true);
            const allSessions = await dbManager.getSessions();
            setSessions(allSessions);
        } catch (error) {
            console.error('Failed to load sessions:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // 初始化时加载会话
    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    // 保存会话
    const saveSession = useCallback(async (sessionId: string, messages: message[]) => {
        if (messages.length === 0) return;

        const firstUserMessage = messages.find(m => m.role === 'user');
        const lastMessage = messages[messages.length - 1];

        const session: ChatSession = {
            id: sessionId,
            title: firstUserMessage ? dbManager.generateSessionTitle(firstUserMessage.content) : '新对话',
            createdAt: messages[0]?.timestamp || Date.now(),
            updatedAt: lastMessage?.timestamp || Date.now(),
            messageCount: messages.length,
            lastMessage: lastMessage?.content.substring(0, 100) || ''
        };

        await dbManager.saveSession(session);
        await loadSessions(); // 重新加载会话列表
    }, [loadSessions]);

    // 保存消息
    const saveMessage = useCallback(async (sessionId: string, msg: message) => {
        const storedMessage: StoredMessage = {
            id: msg.id,
            sessionId: sessionId,
            content: msg.content,
            timestamp: msg.timestamp,
            role: msg.role
        };

        await dbManager.saveMessage(storedMessage);
    }, []);

    // 加载会话消息
    const loadSessionMessages = useCallback(async (sessionId: string): Promise<message[]> => {
        try {
            const storedMessages = await dbManager.getMessages(sessionId);
            return storedMessages.map(sm => ({
                id: sm.id,
                content: sm.content,
                timestamp: sm.timestamp,
                role: sm.role,
                sessionId: sm.sessionId
            }));
        } catch (error) {
            console.error('Failed to load session messages:', error);
            return [];
        }
    }, []);

    // 删除会话
    const deleteSession = useCallback(async (sessionId: string) => {
        try {
            await dbManager.deleteSession(sessionId);
            await loadSessions();
        } catch (error) {
            console.error('Failed to delete session:', error);
        }
    }, [loadSessions]);

    // 搜索消息
    const searchMessages = useCallback(async (query: string) => {
        try {
            return await dbManager.searchMessages(query);
        } catch (error) {
            console.error('Failed to search messages:', error);
            return [];
        }
    }, []);

    return {
        sessions,
        loading,
        saveSession,
        saveMessage,
        loadSessionMessages,
        deleteSession,
        searchMessages,
        refreshSessions: loadSessions
    };
}
