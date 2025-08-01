// RequestBody 接口用于定义与 HyperAPI 交互时的请求体结构。
// model: 使用的模型名称。
// messages: 消息数组，每条消息包含角色和内容。
// temperature: 控制生成文本的随机性（可选）。
// top_p: 采样的概率阈值（可选）。
// n: 生成的结果数量（可选）。
// stream: 是否以流式方式返回结果（可选）。
// stop: 指定停止生成的标记（可选）。
// max_tokens: 生成文本的最大 token 数（可选）。
// presence_penalty: 存在性惩罚参数（可选）。
// frequency_penalty: 频率惩罚参数（可选）。
// logit_bias: 对特定 token 的概率进行偏置（可选）。
// user: 用户标识（可选）。
interface RequestBody {
    model: string;
    messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
    }>;
    temperature?: number;
    top_p?: number;
    n?: number;
    stream?: boolean;
    stop?: string | string[];
    max_tokens?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    logit_bias?: Record<string, number>;
    user?: string;
}

export default RequestBody;
