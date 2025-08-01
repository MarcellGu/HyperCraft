import SideBar from "@/components/layout/SideBar/SideBar";
import React, {useEffect, useState} from "react";
import SquircleButton from "@/components/common/button/SquircleButton/SquircleButton";
import ModelSelector from "@/app/components/ModelSelector/ModelSelector";
import {getSelectedModel, setSelectedModel} from "@/utils/requestHandler/modelManager";

function SideBarRight() {
    const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
    const [currentModel, setCurrentModel] = useState("GLM4:9B");

    useEffect(() => {
        // 初始化时获取当前选择的模型
        setCurrentModel(getSelectedModel());

        // 添加键盘快捷键支持
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'm') {
                event.preventDefault();
                setIsModelSelectorOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleOpenModelSelector = () => {
        setIsModelSelectorOpen(true);
    };

    const handleCloseModelSelector = () => {
        setIsModelSelectorOpen(false);
    };

    const handleSelectModel = (modelName: string) => {
        setSelectedModel(modelName);
        setCurrentModel(modelName);
        console.log("模型已切换至:", modelName);
    };

    return (
        <>
            <SideBar style={{right: 0, justifyContent: "space-between"}}>
                <SquircleButton icon={"gravity-ui:cpu"}
                                alt={"选择模型"}
                                onClick={handleOpenModelSelector}
                                text={"模型选择"}
                                subtext={"⌘ + M"}/>
                <SquircleButton icon={"gravity-ui:gear"}
                                alt={"设置"}
                                onClick={() => {
                                }}
                                text={"设置"}
                                subtext={"⌘ + S"}/>
            </SideBar>

            <ModelSelector
                isOpen={isModelSelectorOpen}
                onClose={handleCloseModelSelector}
                onSelectModel={handleSelectModel}
                currentModel={currentModel}
            />
        </>
    );
}

export default SideBarRight;
