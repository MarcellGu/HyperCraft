import LayerProps from "@/types/layer";
import styles from "./ToastLayer.module.css";

function ToastLayer({children}: LayerProps) {
    return <div className={styles.toast}>
        {children}
    </div>
}

export default ToastLayer;
