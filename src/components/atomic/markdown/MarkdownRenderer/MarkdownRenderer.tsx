import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import 'katex/dist/contrib/mhchem.min.js';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';


const MarkdownRenderer = ({content}: { content: string }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypePrism, rehypeKatex]}>
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
