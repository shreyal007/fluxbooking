"use client";

import { useState } from "react";
import { Check, CreditCard, Sparkles, Zap, MessageSquare, ShoppingCart } from "lucide-react";
import { PLANS, SMS_PACKS } from "@/config/plans";
import { createCheckoutSession, createSMSPurchaseSession } from "@/app/actions/stripe";

export function BillingSettings({ 
  currentPlan, 
  planInterval,
  smsCredits
}: { 
  currentPlan: string, 
  planInterval: string,
  smsCredits: number
}) {
  const [interval, setInterval] = useState<"MONTH" | "YEAR">(planInterval as any || "MONTH");
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    setLoading(planId);
    const result = await createCheckoutSession(planId, interval);
    
    if (result.url) {
      window.location.href = result.url;
    } else if (result.error) {
      alert(result.error);
      setLoading(null);
    }
  };

  const handleBuySMS = async (packId: string) => {
    setLoading(packId);
    const result = await createSMSPurchaseSession(packId);
    
    if (result.url) {
      window.location.href = result.url;
    } else if (result.error) {
      alert(result.error);
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Subscription Plans */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">Subscription Plans</h3>
          </div>
          
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => setInterval("MONTH")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${interval === "MONTH" ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500"}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setInterval("YEAR")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${interval === "YEAR" ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" : "text-slate-500"}`}
            >
              Yearly <span className="ml-1 text-[10px] text-emerald-500">-20%</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
              const isCurrent = currentPlan === plan.id;
              const yearlyTotal = (plan.price.amount * 10).toFixed(2);

              return (
                <div 
                  key={plan.id}
                  className={`relative p-6 rounded-2xl border transition-all ${
                    isCurrent 
                    ? "border-indigo-600 dark:border-indigo-500 ring-1 ring-indigo-600 dark:ring-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10" 
                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                      Current Plan
                    </span>
                  )}
                  
                  <div className="mb-4">
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs">{plan.name}</h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">
                        ${interval === "YEAR" ? (plan.price.amount * 10 / 12).toFixed(2) : plan.price.amount}
                      </span>
                      <span className="text-slate-400 text-xs font-medium">/mo</span>
                    </div>
                    {interval === "YEAR" && plan.price.amount > 0 && (
                      <p className="text-[10px] text-emerald-500 font-bold mt-1">Billed annually (${yearlyTotal}/yr)</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent || !!loading}
                    className={`w-full py-3 rounded-xl text-xs font-black transition-all ${
                      isCurrent 
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default" 
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none"
                    }`}
                  >
                    {isCurrent ? "Active" : loading === plan.id ? "Redirecting..." : "Upgrade"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SMS Credits Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Messaging Credits</h3>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/50">
            <span className="text-xs font-black text-amber-600 dark:text-amber-400">{smsCredits} Credits Remaining</span>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Buy prepaid credits to send SMS reminders to your customers. Credits never expire and work globally.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SMS_PACKS.map((pack) => (
              <div key={pack.id} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center text-center">
                <Zap className="h-6 w-6 text-amber-500 mb-2" />
                <h4 className="font-bold text-slate-900 dark:text-white">{pack.credits} SMS</h4>
                <div className="mt-2 mb-6">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">${pack.price}</span>
                  <span className="text-slate-400 text-[10px] block mt-1">one-time payment</span>
                </div>
                <button 
                  onClick={() => handleBuySMS(pack.id)}
                  disabled={!!loading}
                  className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  {loading === pack.id ? "Processing..." : (
                    <>
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Buy Now
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
