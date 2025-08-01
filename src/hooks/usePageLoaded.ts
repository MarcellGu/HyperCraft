import {useEffect, useState} from "react";

function usePageLoaded() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const handleLoad = () => setLoaded(true);

        if (document.readyState === "complete") {
            handleLoad();
            return;
        } else {
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    return loaded;
}

export default usePageLoaded;
