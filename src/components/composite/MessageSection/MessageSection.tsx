import message from "@/types/common/message";
import styles from "./MessageSection.module.css";
import Markdown from "react-markdown";
import CopyButton from "@/components/atomic/button/CopyButton/CopyButton";
import RetryButton from "@/components/atomic/button/RetryButton/RetryButton";

function MessageSection({messages}: { messages: message[] }) {
    const renderContent = (content: string, role: 'user' | 'assistant' | 'system') => {
        // 只对assistant角色处理<think>标签
        if (role === 'assistant') {
            // 检查是否有<think>标签
            const thinkMatches = content.matchAll(/<think>([\s\S]*?)<\/think>/g);
            const matches = Array.from(thinkMatches);

            if (matches.length > 0) {
                const elements = [];
                let lastIndex = 0;

                matches.forEach((match, index) => {
                    // 添加<think>标签之前的内容
                    const beforeThink = content.substring(lastIndex, match.index);
                    if (beforeThink) {
                        elements.push(<Markdown key={`before-${index}`}>{beforeThink}</Markdown>);
                    }

                    // 添加<think>标签内容
                    elements.push(
                        <div key={`think-${index}`} className={styles.think}>
                            <strong>思考过程:</strong>
                            <Markdown>{match[1]}</Markdown>
                        </div>
                    );

                    lastIndex = match.index! + match[0].length;
                });

                // 添加最后一个<think>标签之后的内容
                const afterLastThink = content.substring(lastIndex);
                if (afterLastThink) {
                    elements.push(<Markdown key="after-last">{afterLastThink}</Markdown>);
                }

                return <>{elements}</>;
            }
        }

        // 如果不是assistant角色或没有<think>标签，正常显示
        return <Markdown>{content}</Markdown>;
    };

    // 复制消息内容到剪贴板
    const copyMessage = (content: string) => {
        navigator.clipboard.writeText(content);
    };

    // 重新生成消息的处理函数（需要父组件传递）
    const regenerateMessage = () => {
        // 这里需要父组件传递重新生成的处理函数
        console.log("重新生成消息");
    };

    return <section className={styles.section}>
        {messages.map((message) => (
            <div key={message.id}
                 className={`${styles.message} ${styles[message.role]} markdown`}>
                {renderContent(message.content, message.role)}
                {/* 只为assistant角色显示工具栏 */}
                {message.role === 'assistant' && (
                    <div className={styles.toolbar}>
                        <CopyButton onClick={() => copyMessage(message.content)}/>
                        <RetryButton onClick={regenerateMessage}/>
                    </div>
                )}
            </div>
        ))}
    </section>
}

export default MessageSection;
