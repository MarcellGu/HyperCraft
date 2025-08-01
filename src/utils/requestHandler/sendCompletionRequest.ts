import RequestBody from "@/interfaces/Ollama/RequestBody";
import {getSelectedModel} from "./modelManager";

async function sendCompletionRequest(messages: { role: "system" | "user" | "assistant"; content: string; }[]) {
    const data: RequestBody = {
        model: getSelectedModel(),
        messages
    }
    const response = await fetch("http://127.0.0.1:11434/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error("发送消息失败");
    }
    return await response.json();
}

export default sendCompletionRequest;
