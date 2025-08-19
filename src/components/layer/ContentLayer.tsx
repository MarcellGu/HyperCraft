import LayerProps from "@/types/properties/layer";

function ContentLayer({children}: LayerProps) {
    return <div id={"content"} className={"content layer"}>
        {children}
    </div>
}

export default ContentLayer;
