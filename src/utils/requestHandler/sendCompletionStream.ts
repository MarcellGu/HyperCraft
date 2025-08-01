import RequestBody from "@/interfaces/Ollama/RequestBody";
import {getSelectedModel} from "./modelManager";

/**
 * Sends a streaming chat completion request to Ollama and invokes onChunk for each delta.
 */
export async function sendCompletionStream(
    messages: { role: "system" | "user" | "assistant"; content: string; }[],
    onChunk: (chunk: string) => void
): Promise<void> {
    const data: RequestBody & { stream: boolean } = {
        model: getSelectedModel(),
        messages,
        stream: true
    };
    const response = await fetch("http://127.0.0.1:11434/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "text/event-stream"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok || !response.body) {
        throw new Error("Streaming request failed");
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    return new Promise((resolve, reject) => {
        function read() {
            reader.read().then(({done, value}) => {
                if (done) return resolve();
                buffer += decoder.decode(value, {stream: true});
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (!line.startsWith('data:')) continue;
                    const jsonStr = line.replace(/^data:\s*/, '').trim();
                    if (jsonStr === '[DONE]') return resolve();
                    const parsed = JSON.parse(jsonStr);
                    const delta = parsed.choices[0]?.delta?.content;
                    if (delta) onChunk(delta);
                }
                read();
            }).catch(reject);
        }

        read();
    });
}
