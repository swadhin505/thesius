"use client";

import React, { useEffect, useRef, useState } from 'react';
import './visibility.css'; // Import the CSS file for animations

const VisibilityDetector: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.intersectionRatio >= 0.5) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div
        ref={targetRef}
        className={`box ${isVisible ? 'fade-in' : ''}`}
      >
        {isVisible ? (
          <p className="visible-text">Element is at least 50% visible</p>
        ) : (
          <p className="invisible-text">Element is not 50% visible</p>
        )}
      </div>
    </div>
  );
};

export default VisibilityDetector;