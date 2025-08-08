import LayerProps from "@/types/layer";
import styles from "./BackgroundLayer.module.css";

function BackgroundLayer({children}: LayerProps) {
    return <div className={styles.background}>
        {children}
    </div>
}

export default BackgroundLayer;
