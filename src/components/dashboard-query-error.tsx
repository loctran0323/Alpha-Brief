import { DashboardSetupError } from "@/components/dashboard-setup-error";

export function DashboardQueryError({
  context,
  err,
}: {
  context: string;
  err: { message?: string; code?: string };
}) {
  const msg = err.message ?? "Unknown error";
  const code = err.code ? ` (${err.code})` : "";
  return <DashboardSetupError message={`${context}: ${msg}${code}`} />;
}
