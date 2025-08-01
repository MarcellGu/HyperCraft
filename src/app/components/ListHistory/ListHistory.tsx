'use client';

import styles from './ListHistory.module.css';
import SquircleFrame from "@/components/common/basic/SquircleFrame/SquircleFrame";
import React from "react";
import useElementSize from "@/hooks/useElementSize";
import {useChatHistory} from "@/hooks/useChatHistory";
import {useParams, useRouter} from "next/navigation";

interface ListHistoryProps extends React.HTMLAttributes<HTMLDivElement> {
    style?: {
        borderRadius?: number;
    };
}

function ListHistory({style, ...props}: ListHistoryProps) {
    const {borderRadius = 10} = style || {borderRadius: 10};
    const ref = React.useRef<HTMLDivElement>(null);
    const size = useElementSize(ref);
    const {sessions, loading, deleteSession, refreshSessions} = useChatHistory();
    const router = useRouter();
    const params = useParams();
    const currentSessionId = params?.UUID as string;

    // 监听路由变化，当新建对话时刷新历史记录列表
    React.useEffect(() => {
        refreshSessions();
    }, [currentSessionId, refreshSessions]);

    const handleSessionClick = (sessionId: string) => {
        if (sessionId !== currentSessionId) {
            router.push(`/chat/${sessionId}`);
        }
    };

    const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        await deleteSession(sessionId);
        // 如果删除的是当前会话，跳转到首页
        if (sessionId === currentSessionId) {
            router.push('/');
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (diffInHours < 24 * 7) {
            return date.toLocaleDateString('zh-CN', {
                weekday: 'short'
            });
        } else {
            return date.toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    return (
        <div className={styles.listHistory} ref={ref} style={{padding: borderRadius / 2}} {...props}>
            <SquircleFrame
                style={{
                    borderRadius: 10,
                    fill: "none",
                    height: size.height,
                    stroke: 'var(--color-border)',
                    strokeWidth: 1,
                    width: size.width,
                }}/>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loading}>
                        <span>加载历史记录...</span>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className={styles.empty}>
                        <span>暂无历史对话</span>
                    </div>
                ) : (
                    <div className={styles.sessionList}>
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className={`${styles.sessionItem} ${
                                    session.id === currentSessionId ? styles.active : ''
                                }`}
                                onClick={() => handleSessionClick(session.id)}
                            >
                                <div className={styles.sessionMain}>
                                    <div className={styles.sessionTitle}>
                                        {session.title}
                                    </div>
                                    <div className={styles.sessionPreview}>
                                        {session.lastMessage}
                                    </div>
                                </div>
                                <div className={styles.sessionMeta}>
                                    <span className={styles.sessionTime}>
                                        {formatTime(session.updatedAt)}
                                    </span>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={(e) => handleDeleteSession(e, session.id)}
                                        title="删除对话"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListHistory;
