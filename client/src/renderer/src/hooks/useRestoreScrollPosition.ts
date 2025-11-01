import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useRestoreScrollPosition = (ref: React.RefObject<HTMLDivElement>) => {
    const location = useLocation();
    const [scrollPositions, setScrollPositions] = useState<{ [key: string]: number }>({});
    const lastPosition = useRef('/');
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (location.pathname !== lastPosition.current) {
            lastPosition.current = location.pathname;

            setTimeout(() => {
                ref.current?.scrollTo({
                    top: scrollPositions[location.pathname] || 0,
                    behavior: 'instant',
                });
            }, 20);
        }
    }, [location, ref, scrollPositions]);

    useEffect(() => {
        const copyRef = ref.current;

        const handleScroll = () => {
            if (!copyRef) return;

            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

            scrollTimeout.current = setTimeout(() => {
                // Update scroll position
                setScrollPositions(prev => ({
                    ...prev,
                    [location.pathname]: copyRef?.scrollTop || 0,
                }));
            }, 300);
        };

        copyRef?.addEventListener('scroll', handleScroll);

        return () => {
            copyRef?.removeEventListener('scroll', handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, [location.pathname, ref]);
};
