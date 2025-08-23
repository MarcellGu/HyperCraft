import React from 'react';
import styles from './UserMessage.module.css';

interface UserMessageProps {
    content: string;
    className?: string;
}

const UserMessage: React.FC<UserMessageProps> = ({content}) => {
    return <div className={styles.container}>
        <div className={styles.message}>
            {content}
        </div>
    </div>;
};

export default UserMessage;
