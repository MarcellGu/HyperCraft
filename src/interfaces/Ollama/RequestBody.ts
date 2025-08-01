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
}

export default RequestBody;
