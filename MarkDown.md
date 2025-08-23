# 在 Next.js 项目中实现 Markdown 和 KaTeX 渲染

根据您的要求，以下是将 OpenWebUI 中 Markdown 和 KaTeX 渲染功能集成到 Next.js 项目中的详细指南。

## 1. 技术栈

- **Next.js**: React 框架，用于构建全栈 Web 应用。
- **Marked**: 用于解析 Markdown 文本的库。
- **KaTeX**: 用于渲染数学公式的库。
- **CSS Modules / Tailwind CSS / Styled Components** (可选): 用于样式管理。

## 2. 核心组件结构

在 Next.js 项目中，您可以创建以下组件结构：

```
components/
├── MarkdownRenderer/
│   ├── MarkdownRenderer.tsx
│   ├── MarkdownTokens.tsx
│   ├── MarkdownInlineTokens.tsx
│   ├── KatexRenderer.tsx
│   └── katex-extension.ts
```

## 3. 实现步骤

### 3.1. 安装依赖

首先，安装必要的依赖项：

```bash
npm install marked katex
```

### 3.2. 创建 KaTeX 扩展

创建 `katex-extension.ts` 文件，定义用于解析 Markdown 中数学公式的 Marked 扩展：

```typescript
import katex from 'katex';

// 定义支持的数学分隔符
const inlineDelimiters = [
    {left: '$$', right: '$$', display: true},
    {left: '$', right: '$', display: false},
    {left: '\\(', right: '\\)', display: false},
];

const blockDelimiters = [
    {left: '$$', right: '$$', display: true},
    {left: '\\[', right: '\\]', display: true},
    {left: '\\begin{equation}', right: '\\end{equation}', display: true},
    {left: '\\begin{align}', right: '\\end{align}', display: true},
    {left: '\\begin{gather}', right: '\\end{gather}', display: true},
    {left: '\\begin{CD}', right: '\\end{CD}', display: true},
];

// 定义内联 KaTeX 扩展
const inlineKatex = {
    name: 'inlineKatex',
    level: 'inline',
    start(src: string) {
        for (const {left} of inlineDelimiters) {
            const index = src.indexOf(left);
            if (index !== -1) {
                return index;
            }
        }
        return -1; // 没有找到
    },
    tokenizer(src: string) {
        for (const {left, right, display} of inlineDelimiters) {
            if (src.startsWith(left)) {
                const endIdx = src.indexOf(right, left.length);
                if (endIdx !== -1) {
                    return {
                        type: 'inlineKatex',
                        raw: src.slice(0, endIdx + right.length),
                        text: src.slice(left.length, endIdx),
                        display,
                    };
                }
            }
        }
        return undefined; // 没有匹配
    },
    renderer(token: any) {
        return `\n`;
    },
};

// 定义块级 KaTeX 扩展
const blockKatex = {
    name: 'blockKatex',
    level: 'block',
    start(src: string) {
        for (const {left} of blockDelimiters) {
            const index = src.indexOf(left);
            if (index !== -1) {
                return index;
            }
        }
        return -1; // 没有找到
    },
    tokenizer(src: string) {
        for (const {left, right, display} of blockDelimiters) {
            if (src.startsWith(left)) {
                const endIdx = src.indexOf(right, left.length);
                if (endIdx !== -1) {
                    return {
                        type: 'blockKatex',
                        raw: src.slice(0, endIdx + right.length),
                        text: src.slice(left.length, endIdx),
                        display,
                    };
                }
            }
        }
        return undefined; // 没有匹配
    },
    renderer(token: any) {
        return `\n`;
    },
};

export {inlineKatex, blockKatex};
```

### 3.3. 创建 KaTeX 渲染器

创建 `KatexRenderer.tsx` 文件，用于渲染解析后的数学公式：

```tsx
import React, {useEffect, useRef} from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface KatexRendererProps {
    content: string;
    displayMode?: boolean;
}

const KatexRenderer: React.FC<KatexRendererProps> = ({content, displayMode = false}) => {
    const katexRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (katexRef.current) {
            try {
                katex.render(content, katexRef.current, {
                    displayMode,
                    throwOnError: false,
                });
            } catch (error) {
                console.error('KaTeX rendering error:', error);
                katexRef.current.innerHTML = `<span style="color: red;">Error rendering formula: ${content}</span>`;
            }
        }
    }, [content, displayMode]);

    return <div ref={katexRef}/>;
};

export default KatexRenderer;
```

### 3.4. 创建 Markdown 内联 Token 渲染器

创建 `MarkdownInlineTokens.tsx` 文件，用于渲染内联 Markdown 元素：

```tsx
import React from 'react';
import KatexRenderer from './KatexRenderer';

interface Token {
    type: string;
    raw?: string;
    href?: string;
    title?: string;
    text?: string;
    tokens?: Token[];
    display?: boolean;
}

interface MarkdownInlineTokensProps {
    tokens: Token[];
}

const MarkdownInlineTokens: React.FC<MarkdownInlineTokensProps> = ({tokens}) => {
    return (
        <>
            {tokens.map((token, index) => {
                switch (token.type) {
                    case 'escape':
                    case 'text':
                        return <span key={index}>{token.text}</span>;
                    case 'html':
                        return <span key={index} dangerouslySetInnerHTML={{__html: token.text || ''}}/>;
                    case 'link':
                        return (
                            <a key={index} href={token.href} title={token.title}>
                                <MarkdownInlineTokens tokens={token.tokens || []}/>
                            </a>
                        );
                    case 'image':
                        return <img key={index} src={token.href} alt={token.text} title={token.title}/>;
                    case 'strong':
                        return (
                            <strong key={index}>
                                <MarkdownInlineTokens tokens={token.tokens || []}/>
                            </strong>
                        );
                    case 'em':
                        return (
                            <em key={index}>
                                <MarkdownInlineTokens tokens={token.tokens || []}/>
                            </em>
                        );
                    case 'codespan':
                        return <code key={index}>{token.text}</code>;
                    case 'br':
                        return <br key={index}/>;
                    case 'del':
                        return (
                            <del key={index}>
                                <MarkdownInlineTokens tokens={token.tokens || []}/>
                            </del>
                        );
                    case 'inlineKatex':
                        return <KatexRenderer key={index} content={token.text || ''} displayMode={token.display}/>;
                    default:
                        return <span key={index}>Unknown inline token: {token.type}</span>;
                }
            })}
        </>
    );
};

export default MarkdownInlineTokens;
```

### 3.5. 创建 Markdown Token 渲染器

创建 `MarkdownTokens.tsx` 文件，用于渲染块级 Markdown 元素：

```tsx
import React from 'react';
import MarkdownInlineTokens from './MarkdownInlineTokens';
import KatexRenderer from './KatexRenderer';

interface Token {
    type: string;
    raw?: string;
    text?: string;
    tokens?: Token[];
    items?: Token[][];
    ordered?: boolean;
    depth?: number;
    display?: boolean;
    lang?: string;
    code?: string;
}

interface MarkdownTokensProps {
    tokens: Token[];
}

const MarkdownTokens: React.FC<MarkdownTokensProps> = ({tokens}) => {
    return (
        <>
            {tokens.map((token, index) => {
                switch (token.type) {
                    case 'heading':
                        const HeadingTag = `h${token.depth}` as keyof JSX.IntrinsicElements;
                        return (
                            <HeadingTag key={index}>
                                <MarkdownInlineTokens tokens={token.tokens || []}/>
                            </HeadingTag>
                        );
                    case 'paragraph':
                        return (
                            <p key={index}>
                                <MarkdownInlineTokens tokens={token.tokens || []}/>
                            </p>
                        );
                    case 'code':
                        return (
                            <pre key={index}>
                <code className={token.lang ? `language-${token.lang}` : undefined}>
                  {token.text}
                </code>
              </pre>
                        );
                    case 'blockquote':
                        return (
                            <blockquote key={index}>
                                <MarkdownTokens tokens={token.tokens || []}/>
                            </blockquote>
                        );
                    case 'list':
                        const ListTag = token.ordered ? 'ol' : 'ul';
                        return (
                            <ListTag key={index}>
                                {token.items?.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                        <MarkdownTokens tokens={item}/>
                                    </li>
                                ))}
                            </ListTag>
                        );
                    case 'inlineKatex':
                        return <KatexRenderer key={index} content={token.text || ''} displayMode={token.display}/>;
                    case 'blockKatex':
                        return <KatexRenderer key={index} content={token.text || ''} displayMode={token.display}/>;
                    default:
                        return <div key={index}>Unknown block token: {token.type}</div>;
                }
            })}
        </>
    );
};

export default MarkdownTokens;
```

### 3.6. 创建主 Markdown 渲染器

创建 `MarkdownRenderer.tsx` 文件，作为主入口组件：

```tsx
import React, {useEffect, useState} from 'react';
import {marked} from 'marked';
import {inlineKatex, blockKatex} from './katex-extension';
import MarkdownTokens from './MarkdownTokens';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({content}) => {
    const [tokens, setTokens] = useState<marked.Token[]>([]);

    useEffect(() => {
        // 注册扩展
        marked.use({extensions: [inlineKatex, blockKatex]});

        // 解析 Markdown
        const parsedTokens = marked.lexer(content);
        setTokens(parsedTokens);
    }, [content]);

    return <MarkdownTokens tokens={tokens}/>;
};

export default MarkdownRenderer;
```

## 4. 使用示例

在您的 Next.js 页面或组件中使用 `MarkdownRenderer`：

```tsx
import React from 'react';
import MarkdownRenderer from '../components/MarkdownRenderer/MarkdownRenderer';

const HomePage: React.FC = () => {
    const markdownContent = `
# 欢迎使用 Markdown 和 KaTeX

这是一个段落，包含一个**粗体**文本和一个*斜体*文本。

这是一个内联公式: $E = mc^2$。

这是一个块级公式:

$$
\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
`;

    return (
        <div>
            <h1>Markdown 和 KaTeX 示例</h1>
            <MarkdownRenderer content={markdownContent}/>
        </div>
    );
};

export default HomePage;
```

## 5. 注意事项

1. **样式**: 确保正确导入 `katex/dist/katex.min.css` 以应用 KaTeX 样式。
2. **错误处理**: 在 `KatexRenderer` 中添加了基本的错误处理，以防止渲染错误导致整个应用崩溃。
3. **性能**: 对于大量 Markdown 内容，考虑使用 `React.memo` 或其他优化技术来提高渲染性能。
4. **扩展性**: 您可以根据需要添加更多 Marked 扩展，例如支持表格、任务列表等。

通过以上步骤，您就可以在 Next.js 项目中成功集成和使用 OpenWebUI 的 Markdown 和 KaTeX 渲染功能。
