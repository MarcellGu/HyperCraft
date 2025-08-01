import React, {useCallback, useEffect, useState} from "react";
import styles from "./ModelSelector.module.css";

interface Model {
    name: string;
    displayName: string;
    description?: string;
}

interface ModelSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectModel: (model: string) => void;
    currentModel: string;
}

// API返回的模型类型
interface ModelFromAPI {
    name: string;
    size: number;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         onSelectModel,
                                                         currentModel
                                                     }) => {
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(false);


    const fetchAvailableModels = useCallback(async () => {
        // 预定义的模型列表
        const defaultModels: Model[] = [
            {
                name: "GLM4:9B",
                displayName: "GLM-4 9B",
                description: "智谱清言GLM-4模型，9B参数版本"
            }
        ];
        setLoading(true);
        try {
            // 尝试从Ollama API获取模型列表
            const response = await fetch("http://127.0.0.1:11434/api/tags");
            if (response.ok) {
                const data = await response.json();
                const availableModels = data.models?.map((model: ModelFromAPI) => ({
                    name: model.name,
                    displayName: model.name,
                    description: `大小: ${(model.size / 1024 / 1024 / 1024).toFixed(1)}GB`
                })) || [];
                setModels(availableModels);
            } else {
                // 如果API不可用，使用默认模型列表
                setModels(defaultModels);
            }
        } catch (error) {
            console.warn("无法获取模型列表，使用默认列表:", error);
            setModels(defaultModels);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchAvailableModels().then(() => {
            });
        }
    }, [isOpen, fetchAvailableModels]);

    const handleModelSelect = (modelName: string) => {
        onSelectModel(modelName);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>选择模型</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loading}>正在加载模型列表...</div>
                    ) : (
                        <div className={styles.modelList}>
                            {models.map((model) => (
                                <div
                                    key={model.name}
                                    className={`${styles.modelItem} ${
                                        currentModel === model.name ? styles.selected : ""
                                    }`}
                                    onClick={() => handleModelSelect(model.name)}
                                >
                                    <div className={styles.modelInfo}>
                                        <div className={styles.modelName}>
                                            {model.displayName}
                                        </div>
                                        {model.description && (
                                            <div className={styles.modelDescription}>
                                                {model.description}
                                            </div>
                                        )}
                                    </div>
                                    {currentModel === model.name && (
                                        <div className={styles.checkmark}>✓</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <div className={styles.currentModel}>
                        当前模型: {currentModel}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelSelector;
