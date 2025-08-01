import React from 'react';
import {useRouter} from 'next/navigation';
import styles from './HeroTitle.module.css';

interface Props {
    title?: string;
}

function HeroTitle({title}: Props) {
    const router = useRouter();
    return <h1 className={styles.heroTitle} onClick={() => router.push('/')}
               style={{cursor: 'pointer'}}>
        {title ?? "HyperCraft"}
    </h1>
}

export default HeroTitle;
