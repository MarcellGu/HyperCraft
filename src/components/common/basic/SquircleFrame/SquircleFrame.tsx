import React from "react";
import squircle from "@/utils/pathHandler/squircle";
import styles from "./SquircleFrame.module.css";

interface SquircleFrameProps {
    style: {
        borderRadius: number; fill: string; stroke: string; strokeWidth: number; width?: number; height?: number;
    };
}

function SquircleFrame({style}: SquircleFrameProps) {

    const {borderRadius, fill, stroke, strokeWidth, width, height} = style;

    if (!width || !height) {
        return null;
    }

    return <svg className={styles.svg}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                stroke={stroke}
                fill={fill}
                xmlns="http://www.w3.org/2000/svg">
        <path d={squircle(borderRadius, width, height, strokeWidth / 2)} strokeWidth={strokeWidth}/>
    </svg>
}

export default SquircleFrame;
