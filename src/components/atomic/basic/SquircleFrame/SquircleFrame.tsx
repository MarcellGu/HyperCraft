import React from "react";
import styles from './SquircleFrame.module.css'

/**
 * 生成拟圆角矩形的SVG路径数据
 * @param {number} radius - 圆角半径
 * @param {number} width - 矩形宽度
 * @param {number} height - 矩形高度
 * @param {number} inset - 矩形内边距
 * @returns {string} - SVG路径字符串
 */
interface SquircleFrameProps {
    style: {
        borderRadius: number; fill: string; height: number; stroke: string; strokeWidth: number; width: number;
    };
}

function squircle(radius: number, width: number, height: number, inset: number = 0): string {
    const k = 1.2819426;
    radius = Math.min(radius * k, width / 2, height / 2);

    const n = [[0.6520, 0.0000], [0.5260, 0.0362], [0.4000, 0.1040], [0.2720, 0.1720], [0.1720, 0.2720], [0.1040, 0.4000], [0.0362, 0.5260], [0.0000, 0.6520], [0.0000, 1.0000]];

    const box = {
        left: inset, right: width - inset, top: inset, bottom: height - inset,
    }
    const edge = {
        top: {
            start: {
                x: box.left + radius, y: box.top,
            }, end: {
                x: box.right - radius, y: box.top,
            }
        }, right: {
            start: {
                x: box.right, y: box.top + radius,
            }, end: {
                x: box.right, y: box.bottom - radius,
            }
        }, bottom: {
            start: {
                x: box.right - radius, y: box.bottom,
            }, end: {
                x: box.left + radius, y: box.bottom,
            }
        }, left: {
            start: {
                x: box.left, y: box.bottom - radius,
            }, end: {
                x: box.left, y: box.top + radius,
            }
        }
    }
    const corner = {
        topRight: {
            bezier1: {
                controlPoint1: {x: box.right - n[0][0] * radius, y: box.top + n[0][1] * radius}, // 根据角点坐标变换
                controlPoint2: {x: box.right - n[1][0] * radius, y: box.top + n[1][1] * radius},
                endPoint: {x: box.right - n[2][0] * radius, y: box.top + n[2][1] * radius}
            }, bezier2: {
                controlPoint1: {x: box.right - n[3][0] * radius, y: box.top + n[3][1] * radius},
                controlPoint2: {x: box.right - n[4][0] * radius, y: box.top + n[4][1] * radius},
                endPoint: {x: box.right - n[5][0] * radius, y: box.top + n[5][1] * radius}
            }, bezier3: {
                controlPoint1: {x: box.right - n[6][0] * radius, y: box.top + n[6][1] * radius},
                controlPoint2: {x: box.right - n[7][0] * radius, y: box.top + n[7][1] * radius},
                endPoint: {x: box.right - n[8][0] * radius, y: box.top + n[8][1] * radius} // 终点y: 0 + r (即边起点)
            }
        }, bottomRight: {
            bezier1: {
                controlPoint1: {x: box.right - n[0][1] * radius, y: box.bottom - n[0][0] * radius}, // 坐标变换：交换xy并改变方向
                controlPoint2: {x: box.right - n[1][1] * radius, y: box.bottom - n[1][0] * radius},
                endPoint: {x: box.right - n[2][1] * radius, y: box.bottom - n[2][0] * radius}
            }, bezier2: {
                controlPoint1: {x: box.right - n[3][1] * radius, y: box.bottom - n[3][0] * radius},
                controlPoint2: {x: box.right - n[4][1] * radius, y: box.bottom - n[4][0] * radius},
                endPoint: {x: box.right - n[5][1] * radius, y: box.bottom - n[5][0] * radius}
            }, bezier3: {
                controlPoint1: {x: box.right - n[6][1] * radius, y: box.bottom - n[6][0] * radius},
                controlPoint2: {x: box.right - n[7][1] * radius, y: box.bottom - n[7][0] * radius},
                endPoint: {x: box.right - n[8][1] * radius, y: box.bottom - n[8][0] * radius} // 终点x: width, y: height - r
            }
        }, bottomLeft: {
            bezier1: {
                controlPoint1: {x: box.left + n[0][0] * radius, y: box.bottom - n[0][1] * radius}, // 坐标变换：对称处理
                controlPoint2: {x: box.left + n[1][0] * radius, y: box.bottom - n[1][1] * radius},
                endPoint: {x: box.left + n[2][0] * radius, y: box.bottom - n[2][1] * radius}
            }, bezier2: {
                controlPoint1: {x: box.left + n[3][0] * radius, y: box.bottom - n[3][1] * radius},
                controlPoint2: {x: box.left + n[4][0] * radius, y: box.bottom - n[4][1] * radius},
                endPoint: {x: box.left + n[5][0] * radius, y: box.bottom - n[5][1] * radius}
            }, bezier3: {
                controlPoint1: {x: box.left + n[6][0] * radius, y: box.bottom - n[6][1] * radius},
                controlPoint2: {x: box.left + n[7][0] * radius, y: box.bottom - n[7][1] * radius},
                endPoint: {x: box.left + n[8][0] * radius, y: box.bottom - n[8][1] * radius} // 终点y: height
            }
        }, topLeft: {
            bezier1: {
                controlPoint1: {x: box.left + n[0][1] * radius, y: box.top + n[0][0] * radius}, // 坐标变换：交换xy并调整方向
                controlPoint2: {x: box.left + n[1][1] * radius, y: box.top + n[1][0] * radius},
                endPoint: {x: box.left + n[2][1] * radius, y: box.top + n[2][0] * radius}
            }, bezier2: {
                controlPoint1: {x: box.left + n[3][1] * radius, y: box.top + n[3][0] * radius},
                controlPoint2: {x: box.left + n[4][1] * radius, y: box.top + n[4][0] * radius},
                endPoint: {x: box.left + n[5][1] * radius, y: box.top + n[5][0] * radius}
            }, bezier3: {
                controlPoint1: {x: box.left + n[6][1] * radius, y: box.top + n[6][0] * radius},
                controlPoint2: {x: box.left + n[7][1] * radius, y: box.top + n[7][0] * radius},
                endPoint: {x: box.left + n[8][1] * radius, y: box.top + n[8][0] * radius} // 终点x: 0, y: r (即边起点)
            }
        }
    };

    const segments = [`M${edge.top.start.x} ${edge.top.start.y}`,
        `L${edge.top.end.x} ${edge.top.end.y}`,
        `C${corner.topRight.bezier1.controlPoint1.x} ${corner.topRight.bezier1.controlPoint1.y} ${corner.topRight.bezier1.controlPoint2.x} ${corner.topRight.bezier1.controlPoint2.y} ${corner.topRight.bezier1.endPoint.x} ${corner.topRight.bezier1.endPoint.y}`,
        `C${corner.topRight.bezier2.controlPoint1.x} ${corner.topRight.bezier2.controlPoint1.y} ${corner.topRight.bezier2.controlPoint2.x} ${corner.topRight.bezier2.controlPoint2.y} ${corner.topRight.bezier2.endPoint.x} ${corner.topRight.bezier2.endPoint.y}`,
        `C${corner.topRight.bezier3.controlPoint1.x} ${corner.topRight.bezier3.controlPoint1.y} ${corner.topRight.bezier3.controlPoint2.x} ${corner.topRight.bezier3.controlPoint2.y} ${corner.topRight.bezier3.endPoint.x} ${corner.topRight.bezier3.endPoint.y}`,
        `L${edge.right.end.x} ${edge.right.end.y}`,
        `C${corner.bottomRight.bezier1.controlPoint1.x} ${corner.bottomRight.bezier1.controlPoint1.y} ${corner.bottomRight.bezier1.controlPoint2.x} ${corner.bottomRight.bezier1.controlPoint2.y} ${corner.bottomRight.bezier1.endPoint.x} ${corner.bottomRight.bezier1.endPoint.y}`,
        `C${corner.bottomRight.bezier2.controlPoint1.x} ${corner.bottomRight.bezier2.controlPoint1.y} ${corner.bottomRight.bezier2.controlPoint2.x} ${corner.bottomRight.bezier2.controlPoint2.y} ${corner.bottomRight.bezier2.endPoint.x} ${corner.bottomRight.bezier2.endPoint.y}`,
        `C${corner.bottomRight.bezier3.controlPoint1.x} ${corner.bottomRight.bezier3.controlPoint1.y} ${corner.bottomRight.bezier3.controlPoint2.x} ${corner.bottomRight.bezier3.controlPoint2.y} ${corner.bottomRight.bezier3.endPoint.x} ${corner.bottomRight.bezier3.endPoint.y}`,
        `L${edge.bottom.end.x} ${edge.bottom.end.y}`,
        `C${corner.bottomLeft.bezier1.controlPoint1.x} ${corner.bottomLeft.bezier1.controlPoint1.y} ${corner.bottomLeft.bezier1.controlPoint2.x} ${corner.bottomLeft.bezier1.controlPoint2.y} ${corner.bottomLeft.bezier1.endPoint.x} ${corner.bottomLeft.bezier1.endPoint.y}`,
        `C${corner.bottomLeft.bezier2.controlPoint1.x} ${corner.bottomLeft.bezier2.controlPoint1.y} ${corner.bottomLeft.bezier2.controlPoint2.x} ${corner.bottomLeft.bezier2.controlPoint2.y} ${corner.bottomLeft.bezier2.endPoint.x} ${corner.bottomLeft.bezier2.endPoint.y}`,
        `C${corner.bottomLeft.bezier3.controlPoint1.x} ${corner.bottomLeft.bezier3.controlPoint1.y} ${corner.bottomLeft.bezier3.controlPoint2.x} ${corner.bottomLeft.bezier3.controlPoint2.y} ${corner.bottomLeft.bezier3.endPoint.x} ${corner.bottomLeft.bezier3.endPoint.y}`,
        `L${edge.left.end.x} ${edge.left.end.y}`,
        `C${corner.topLeft.bezier1.controlPoint1.x} ${corner.topLeft.bezier1.controlPoint1.y} ${corner.topLeft.bezier1.controlPoint2.x} ${corner.topLeft.bezier1.controlPoint2.y} ${corner.topLeft.bezier1.endPoint.x} ${corner.topLeft.bezier1.endPoint.y}`,
        `C${corner.topLeft.bezier2.controlPoint1.x} ${corner.topLeft.bezier2.controlPoint1.y} ${corner.topLeft.bezier2.controlPoint2.x} ${corner.topLeft.bezier2.controlPoint2.y} ${corner.topLeft.bezier2.endPoint.x} ${corner.topLeft.bezier2.endPoint.y}`,
        `C${corner.topLeft.bezier3.controlPoint1.x} ${corner.topLeft.bezier3.controlPoint1.y} ${corner.topLeft.bezier3.controlPoint2.x} ${corner.topLeft.bezier3.controlPoint2.y} ${corner.topLeft.bezier3.endPoint.x} ${corner.topLeft.bezier3.endPoint.y}`]
    return segments.join('\n')

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
