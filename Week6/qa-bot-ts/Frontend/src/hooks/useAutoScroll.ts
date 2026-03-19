import { useRef, useEffect } from "react";

export const useAutoScroll = (dependency: any[] = []) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [dependency]);

    return ref;
};
