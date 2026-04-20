import { isDemoMode } from "@/lib/demo";
import UserBadgeClerk from "./UserBadgeClerk";

export default function UserBadge({ fallback }: { fallback: { name: string; email: string } }) {
  if (isDemoMode) {
    return (
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand to-accent text-xs font-semibold text-black">
          {fallback.name.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{fallback.name}</div>
          <div className="truncate text-xs text-muted">{fallback.email}</div>
        </div>
      </div>
    );
  }
  return <UserBadgeClerk />;
}
