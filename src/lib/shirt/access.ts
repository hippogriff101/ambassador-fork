import { isAcceptedApplicationStatus } from "@/lib/applications/status";
import { isUserManualDashboardState } from "@/lib/user-dashboard-state";

export function canAccessShirts(input: {
  latestApplicationStatus?: string | null;
  manualDashboardState?: string | null;
} | null | undefined) {
  const manualDashboardState = isUserManualDashboardState(input?.manualDashboardState)
    ? input.manualDashboardState
    : null;

  return (
    manualDashboardState === "approved" ||
    isAcceptedApplicationStatus(input?.latestApplicationStatus)
  );
}
