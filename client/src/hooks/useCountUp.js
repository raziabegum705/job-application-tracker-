import { useEffect, useRef, useState } from "react";

// Smooth animated counter — counts from 0 to target value
export default function useCountUp(target = 0, duration = 800) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const fromRef  = useRef(0);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;
    let raf;

    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(fromRef.current + (target - fromRef.current) * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}
