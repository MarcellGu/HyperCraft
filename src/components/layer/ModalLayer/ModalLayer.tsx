import LayerProps from "@/types/layer";
import styles from "./ModalLayer.module.css";

function ModalLayer({children}: LayerProps) {
    return <div className={styles.modal}>
        {children}
    </div>
}

export default ModalLayer;
