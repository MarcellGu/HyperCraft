import LayerProps from "@/types/layer";
import styles from "./AuxiliaryLayer.module.css";

function AuxiliaryLayer({children}: LayerProps) {
    return <div className={styles.auxiliary}>
        {children}
    </div>
}

export default AuxiliaryLayer;
