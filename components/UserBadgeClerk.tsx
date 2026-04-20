"use client";
import { UserButton } from "@clerk/nextjs";
export default function UserBadgeClerk() {
  return <UserButton afterSignOutUrl="/" />;
}
