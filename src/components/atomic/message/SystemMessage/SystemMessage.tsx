import React from 'react';
import './SystemMessage.module.css';

interface SystemMessageProps {
    content: string;
    className?: string;
}

const SystemMessage: React.FC<SystemMessageProps> = ({content, className = ''}) => {
    return (
        <article className={`system-message-container ${className}`}>
            <div
                dir="auto"
                className="message-bubble">
                <span className="message-content">{content}</span>
            </div>
        </article>
    );
};

export default SystemMessage;
