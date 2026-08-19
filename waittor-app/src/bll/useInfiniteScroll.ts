import { useEffect, useRef, useCallback } from "react";

export function useInfiniteScroll(
  callback: () => void,
  { enabled = true } = {}
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!enabled) return;

      observerRef.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) callback();
      });

      if (node) observerRef.current.observe(node);
    },
    [callback, enabled]
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return lastElementRef;
}