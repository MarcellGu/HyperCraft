import React, {useEffect, useState} from "react";

function useElementSize(ref: React.RefObject<HTMLElement | null>) {
    const [size, setSize] = useState({width: 0, height: 0});
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const update = () => {
            const rect = element.getBoundingClientRect();
            setSize({width: rect.width, height: rect.height});
        };
        update();
        const resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, [ref]);
    return size;
}

export default useElementSize;
