/**
 * IndexedDB 工具类，用于管理对话历史记录
 */

export interface ChatSession {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    messageCount: number;
    lastMessage?: string;
}

export interface StoredMessage {
    id: string;
    sessionId: string;
    content: string;
    timestamp: number;
    role: 'user' | 'assistant' | 'system';
}

class IndexedDBManager {
    private dbName = 'HyperCraftDB';
    private version = 1;
    private db: IDBDatabase | null = null;

    /**
     * 初始化数据库连接
     */
    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // 创建对话会话表
                if (!db.objectStoreNames.contains('sessions')) {
                    const sessionStore = db.createObjectStore('sessions', {keyPath: 'id'});
                    sessionStore.createIndex('createdAt', 'createdAt', {unique: false});
                    sessionStore.createIndex('updatedAt', 'updatedAt', {unique: false});
                }

                // 创建消息表
                if (!db.objectStoreNames.contains('messages')) {
                    const messageStore = db.createObjectStore('messages', {keyPath: 'id'});
                    messageStore.createIndex('sessionId', 'sessionId', {unique: false});
                    messageStore.createIndex('timestamp', 'timestamp', {unique: false});
                }
            };
        });
    }

    /**
     * 创建或更新对话会话
     */
    async saveSession(session: ChatSession): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['sessions'], 'readwrite');
            const store = transaction.objectStore('sessions');
            const request = store.put(session);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 获取所有对话会话
     */
    async getSessions(): Promise<ChatSession[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['sessions'], 'readonly');
            const store = transaction.objectStore('sessions');
            const index = store.index('updatedAt');
            const request = index.getAll();

            request.onsuccess = () => {
                // 按更新时间倒序排列
                const sessions = request.result.sort((a, b) => b.updatedAt - a.updatedAt);
                resolve(sessions);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 获取指定会话
     */
    async getSession(sessionId: string): Promise<ChatSession | null> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['sessions'], 'readonly');
            const store = transaction.objectStore('sessions');
            const request = store.get(sessionId);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 保存消息
     */
    async saveMessage(message: StoredMessage): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['messages'], 'readwrite');
            const store = transaction.objectStore('messages');
            const request = store.put(message);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 获取指定会话的所有消息
     */
    async getMessages(sessionId: string): Promise<StoredMessage[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['messages'], 'readonly');
            const store = transaction.objectStore('messages');
            const index = store.index('sessionId');
            const request = index.getAll(sessionId);

            request.onsuccess = () => {
                // 按时间戳排序
                const messages = request.result.sort((a, b) => a.timestamp - b.timestamp);
                resolve(messages);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * 删除会话及其所有消息
     */
    async deleteSession(sessionId: string): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['sessions', 'messages'], 'readwrite');

            // 删除会话
            const sessionStore = transaction.objectStore('sessions');
            sessionStore.delete(sessionId);

            // 删除该会话的所有消息
            const messageStore = transaction.objectStore('messages');
            const index = messageStore.index('sessionId');
            const request = index.openCursor(sessionId);

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                }
            };

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    /**
     * 搜索消息内容
     */
    async searchMessages(query: string): Promise<{ session: ChatSession; message: StoredMessage }[]> {
        if (!this.db) await this.init();

        const results: { session: ChatSession; message: StoredMessage }[] = [];
        const sessions = await this.getSessions();

        for (const session of sessions) {
            const messages = await this.getMessages(session.id);
            const matchingMessages = messages.filter(msg =>
                msg.content.toLowerCase().includes(query.toLowerCase())
            );

            for (const message of matchingMessages) {
                results.push({session, message});
            }
        }

        return results;
    }

    /**
     * 生成会话标题（基于第一条用户消息）
     */
    generateSessionTitle(firstUserMessage: string): string {
        const maxLength = 30;
        const cleaned = firstUserMessage.trim();

        if (cleaned.length <= maxLength) {
            return cleaned;
        }

        return cleaned.substring(0, maxLength - 3) + '...';
    }
}

// 导出单例实例
export const dbManager = new IndexedDBManager();
