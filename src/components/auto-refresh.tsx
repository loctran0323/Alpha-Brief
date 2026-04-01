"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** Default 5 minutes. Pair with `dynamic = "force-dynamic"` on the dashboard so each tick re-runs the server. */
export function AutoRefresh({ everyMs = 300000 }: { everyMs?: number }) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    const tick = () => routerRef.current.refresh();

    const id = setInterval(tick, everyMs);

    let hiddenAt: number | null = null;
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        hiddenAt = Date.now();
        return;
      }
      if (hiddenAt === null) return;
      const away = Date.now() - hiddenAt;
      hiddenAt = null;
      if (away >= 15_000) tick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [everyMs]);

  return null;
}
