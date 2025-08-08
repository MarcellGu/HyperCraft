import LayerProps from "@/types/layer";
import styles from "./DebugLayer.module.css";

function DebugLayer({children}: LayerProps) {
    return <div className={styles.debug}>
        {children}
    </div>
}

export default DebugLayer;
