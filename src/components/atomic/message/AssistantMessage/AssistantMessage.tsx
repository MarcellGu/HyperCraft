import React from 'react';
import './AssistantMessage.module.css';

interface AssistantMessageProps {
    content: string;
    className?: string;
    children?: React.ReactNode;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({content, className = '', children}) => {
    return <article>
        {content}
        {children}
    </article>;
};

export default AssistantMessage;
