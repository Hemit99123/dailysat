import { useInView } from 'react-intersection-observer';
import React, { useEffect, useState } from 'react';

const AnimatedCounter = ({
  from,
  to,
  duration,
}: {
  from: number;
  to: number;
  duration: number;
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!inView) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * (to - from) + from));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [inView, from, to, duration]);

  return (
    <h3 ref={ref} className="text-4xl text-[#5FA4F8] font-bold">
      {count.toLocaleString()}+
    </h3>
  );
};

export default AnimatedCounter;
