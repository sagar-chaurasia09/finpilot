"use client";
import { UserProfile } from "@clerk/nextjs";

export default function SettingsClerk() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <UserProfile routing="hash" />
    </div>
  );
}
