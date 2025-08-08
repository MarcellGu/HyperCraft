import LayerProps from "@/types/layer";
import styles from "./OverlayLayer.module.css";

function OverlayLayer({children}: LayerProps) {
    return <div className={styles.overlay}>
        {children}
    </div>
}

export default OverlayLayer;
