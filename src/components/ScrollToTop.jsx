import { useEffect } from 'react';

export function ScrollToTop() {
    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);

        // Also handle cases where the scroll might be delayed due to rendering
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // This component doesn't render anything visible
    return null;
}