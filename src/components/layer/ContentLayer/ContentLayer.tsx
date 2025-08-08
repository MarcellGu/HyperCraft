import LayerProps from "@/types/layer";
import styles from "./ContentLayer.module.css";

function ContentLayer({children}: LayerProps) {
    return <div className={styles.background}>
        {children}
    </div>
}

export default ContentLayer;
