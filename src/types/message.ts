interface message {
    id: string;
    content: string;
    timestamp: number;
    role: 'user' | 'assistant' | 'system';
    sessionId?: string; // 添加会话ID字段
}

export default message;
