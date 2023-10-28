import { useEffect, useRef } from "react";

function useIsMounted() {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  return isMountedRef.current;
}

export default useIsMounted;
