"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { CalendarArrowDown, CalendarArrowUp } from "lucide-react";

export function SortToggle({
  defaultSort = "oldest",
}: {
  defaultSort?: "oldest" | "newest";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get("sort") === "newest"
    ? "newest"
    : searchParams.get("sort") === "oldest"
      ? "oldest"
      : defaultSort;
  const isOldest = currentSort === "oldest";
  const SortIcon = isOldest ? CalendarArrowDown : CalendarArrowUp;
  const sortLabel = isOldest
    ? "Sorted oldest to latest. Click to switch to latest to oldest."
    : "Sorted latest to oldest. Click to switch to oldest to latest.";

  return (
    <button
      type="button"
      data-slot="open-link"
      onClick={() => {
        const params = new URLSearchParams(searchParams.toString());
        const nextSort = isOldest ? "newest" : "oldest";
        if (nextSort === defaultSort) {
          params.delete("sort");
        } else {
          params.set("sort", nextSort);
        }
        params.delete("page");
        startTransition(() => {
          router.replace(`${pathname}?${params.toString()}`);
        });
      }}
      className={`ui-open-link inline-flex h-8 shrink-0 items-center justify-center px-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--acceptance)]/30 ${isPending ? "opacity-60" : ""}`}
      title={sortLabel}
      aria-label={sortLabel}
    >
      <SortIcon aria-hidden="true" size={18} strokeWidth={1.75} />
    </button>
  );
}
