import { useState, useEffect } from "react";

export function useMovieSearch(delay = 500) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(inputValue), delay);
    return () => clearTimeout(timer);
  }, [inputValue, delay]);

  return { inputValue, setInputValue, debouncedSearch };
}
