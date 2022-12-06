import { useState, useEffect, useMemo } from "react";

export default function useOnScreen(ref: any) {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(() => {
    return new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );
  }, []);

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [observer, ref]);

  return isIntersecting;
}
