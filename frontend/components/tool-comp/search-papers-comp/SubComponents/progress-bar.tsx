"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { text: "Defining domains of the query", duration: 10000 },
  { text: "Gathering papers from each domain", duration: 12000 },
  { text: "Filtering the papers based on the query", duration: 10000 },
  { text: "Generating summary", duration: 30000 },
];

const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

export default function AnimatedProgressBar() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    let stepStartTimes = [startTime];
    let animationFrame: number | undefined;

    const updateProgress = () => {
      const now = Date.now();
      const elapsedTotal = now - startTime;
      const totalProgress = (elapsedTotal / totalDuration) * 100;
      
      setProgress(Math.min(totalProgress, 100));

      let accumulated = 0;
      for (let i = 0; i < steps.length; i++) {
        accumulated += steps[i].duration;
        if (elapsedTotal <= accumulated) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsedTotal < totalDuration) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setCurrentStep(steps.length - 1);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      setProgress(0);
      setCurrentStep(0);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="relative h-4 bg-green-100 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
          style={{ width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-800 font-medium"
        >
          {steps[currentStep]?.text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

