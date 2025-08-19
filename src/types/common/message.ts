interface message {
    id: number;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export default message;
