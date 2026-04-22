"use client";

import { AlertCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TrialBannerProps {
  planStatus: string | null;
  trialEndsAt: Date | null;
}

export function TrialBanner({ planStatus, trialEndsAt }: TrialBannerProps) {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (trialEndsAt) {
      const now = new Date();
      const end = new Date(trialEndsAt);
      const diffTime = end.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays > 0 ? diffDays : 0);
    }
  }, [trialEndsAt]);

  if (planStatus !== "TRIALING" || daysRemaining === null) return null;

  return (
    <div className={`w-full px-6 py-3 flex items-center justify-between transition-colors ${
      daysRemaining <= 3 
      ? "bg-rose-500 text-white" 
      : "bg-indigo-600 text-white"
    }`}>
      <div className="flex items-center gap-3">
        {daysRemaining <= 3 ? (
          <AlertCircle className="h-5 w-5 animate-pulse" />
        ) : (
          <Clock className="h-5 w-5" />
        )}
        <p className="text-sm font-bold">
          {daysRemaining === 0 
            ? "Your free trial ends today!" 
            : `Your free trial ends in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}.`}
          <span className="hidden md:inline ml-2 font-normal opacity-90">
            Add a payment method to ensure your booking page stays online.
          </span>
        </p>
      </div>
      
      <Link 
        href="/dashboard/settings" 
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full text-xs font-black transition-all backdrop-blur-sm"
      >
        Upgrade Now
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
