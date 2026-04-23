"use client";

import { useState } from "react";
import { Users, X, Lock } from "lucide-react";
import { AvailabilityEditor } from "./availability-editor";

interface StaffMember {
  id: string;
  name: string;
  bio: string | null;
  availabilityJson: any;
  user?: {
    email: string;
  } | null;
}

export function StaffList({ staffMembers, currentLimit }: { staffMembers: StaffMember[], currentLimit: number }) {
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staffMembers.map((member, index) => {
          const isLocked = index >= currentLimit;

          return (
            <div key={member.id} className={`p-6 rounded-xl border transition-all ${
              isLocked 
              ? "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-60 grayscale" 
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
            }`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isLocked ? 'bg-slate-200 dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  {isLocked ? <Lock className="h-5 w-5 text-slate-400" /> : <Users className="h-6 w-6 text-slate-400" />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {member.name}
                    {isLocked && <span className="text-[8px] font-black uppercase bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">Locked</span>}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{isLocked ? "Limit Reached" : "Staff Member"}</p>
                </div>
              </div>
              {member.bio && (
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                  {member.bio}
                </p>
              )}
              <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                {!isLocked ? (
                  <button 
                    onClick={() => setEditingStaff(member)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    Edit Availability
                  </button>
                ) : (
                  <span className="text-xs font-medium text-slate-400">Inactive on current plan</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Availability Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-height-[90vh] flex flex-col border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Manage Availability</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Setting hours for {editingStaff.name}</p>
              </div>
              <button 
                onClick={() => setEditingStaff(null)}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <AvailabilityEditor 
                staffId={editingStaff.id} 
                initialAvailability={editingStaff.availabilityJson} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
