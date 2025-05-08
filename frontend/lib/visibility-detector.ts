import { useEffect, useState, RefObject } from 'react';

const useVisibility = (ref: RefObject<HTMLElement>, threshold: number = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIntersectionRatio(entry.intersectionRatio);
        setIsVisible(entry.isIntersecting && entry.intersectionRatio >= threshold);
      },
      { 
        threshold,
        rootMargin: '0px',
        root: null
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    const handleResize = () => {
      if (currentRef) {
        observer.unobserve(currentRef);
        observer.observe(currentRef);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [ref, threshold]);

  return isVisible;
};

export default useVisibility;