import message from "@/types/common/message";
import styles from "./MessageSection.module.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MessageSection({messages}: { messages: message[] }) {
    return <section className={styles.section}>
        {messages.map((message) => (<div key={message.id}
                                         className={`${styles.message} ${styles[message.role]} markdown`}>
                <Markdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                </Markdown>
            </div>
        ))}
    </section>
}

export default MessageSection;
