"use client";

import type { MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * The header, mobile menu and footer live in the root layout, so they render on
 * every route — but their targets (#work, #about, #contact…) only exist on the
 * home page. On any other route (e.g. /work/zkr-company) a bare "#work" link does
 * nothing. This hook returns hrefs that work everywhere:
 *
 *  - on "/"       →  "#work"   (native anchor scroll, unchanged behaviour)
 *  - elsewhere    →  "/#work"  (client-side navigation, no full reload / loader replay)
 */
export function useAnchorNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const href = (hash: string) => (isHome ? hash : `/${hash}`);

  const onClick = (e: MouseEvent<HTMLElement>, hash: string) => {
    if (isHome) return;
    // let the browser handle new-tab / modified clicks
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    router.push(`/${hash}`);
  };

  return { isHome, href, onClick };
}
