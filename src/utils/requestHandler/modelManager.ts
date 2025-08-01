// 获取可用模型列表的工具函数
export interface Model {
    name: string;
    displayName: string;
    description?: string;
    size?: number;
}

// 预定义的模型列表
export const defaultModels: Model[] = [
    {
        name: "GLM4:9B",
        displayName: "GLM-4 9B",
        description: "智谱清言GLM-4模型，9B参数版本"
    },
    {
        name: "llama3.1:8B",
        displayName: "Llama 3.1 8B",
        description: "Meta的Llama 3.1模型，8B参数版本"
    },
    {
        name: "qwen2.5:7B",
        displayName: "Qwen 2.5 7B",
        description: "阿里通义千问2.5模型，7B参数版本"
    },
    {
        name: "deepseek-coder:6.7B",
        displayName: "DeepSeek Coder 6.7B",
        description: "DeepSeek专业代码模型，6.7B参数版本"
    }
];

// Ollama API返回的模型结构
interface OllamaModel {
    name: string;
    size: number;
}

// 从Ollama API获取模型列表
export async function fetchAvailableModels(): Promise<Model[]> {
    try {
        const response = await fetch("http://127.0.0.1:11434/api/tags");
        if (response.ok) {
            const data = await response.json();
            return data.models?.map((model: OllamaModel) => ({
                name: model.name,
                displayName: model.name,
                description: `大小: ${(model.size / 1024 / 1024 / 1024).toFixed(1)}GB`,
                size: model.size
            })) || [];
        }
    } catch (error) {
        console.warn("无法获取模型列表，使用默认列表:", error);
    }

    // 如果API不可用，返回默认模型列表
    return defaultModels;
}

// 模型选择的本地存储管理
const MODEL_STORAGE_KEY = 'hypercraft_selected_model';

export function getSelectedModel(): string {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(MODEL_STORAGE_KEY) || 'GLM4:9B';
    }
    return 'GLM4:9B';
}

export function setSelectedModel(modelName: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(MODEL_STORAGE_KEY, modelName);
    }
}
