"use client";

import { useState, useRef, useEffect } from "react";
import { UserPlus, AlertCircle, Loader2, Search, ChevronDown } from "lucide-react";
import { addStaff } from "@/app/actions/dashboard";
import { COUNTRIES } from "@/config/countries";

export function AddStaffForm({ users }: { users: any[] }) {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showPasswordField, setShowPasswordField] = useState(true);
  
  // Country Code State
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.code === "US") || COUNTRIES[0]);
  const [countrySearch, setCountrySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (openDropdown && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [openDropdown]);

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
    c.phoneCode.includes(countrySearch)
  );

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[field];
      setFieldErrors(newErrors);
    }
    setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGeneralError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const userId = formData.get("userId") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Staff name is required";
    
    if (!userId) {
      if (!email) errors.email = "Email is required for new account";
      if (!password) errors.password = "Password is required";
      else if (password.length < 6) errors.password = "Password must be at least 6 characters";
      
      if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    const result = await addStaff(formData);

    if (result?.error) {
      setGeneralError(result.error);
      setLoading(false);
    } else {
      (e.target as HTMLFormElement).reset();
      setShowPasswordField(true);
      setLoading(false);
    }
  };

  const InputError = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-1.5 mt-1.5 text-rose-500 animate-in fade-in slide-in-from-top-1 duration-200">
        <AlertCircle className="h-3 w-3" />
        <span className="text-[10px] font-black uppercase tracking-wider">{message}</span>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-8 text-left">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-indigo-600" />
        Add Staff Member
      </h3>

      {generalError && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-slate-700">Full Name</label>
          <input
            name="name"
            type="text"
            required
            onChange={() => clearFieldError("name")}
            placeholder="e.g., Sarah Smith"
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-all ${
              fieldErrors.name ? "border-rose-300 bg-rose-50 focus:border-rose-500" : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          <InputError message={fieldErrors.name} />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700">User Account</label>
          <select
            name="userId"
            onChange={(e) => {
              setShowPasswordField(e.target.value === "");
              clearFieldError("userId");
            }}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Create new login account</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                Use existing: {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {showPasswordField && (
          <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">Login Credentials</p>
               <div className="space-y-3">
                  <div>
                    <input
                      name="email"
                      type="email"
                      onChange={() => clearFieldError("email")}
                      placeholder="Staff Email"
                      className={`block w-full rounded-lg border px-3 py-2 text-xs focus:outline-none transition-all ${
                        fieldErrors.email ? "border-rose-300 bg-rose-50 focus:border-rose-500" : "border-slate-200 focus:border-indigo-500"
                      }`}
                    />
                    <InputError message={fieldErrors.email} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Staff Phone (Optional)</label>
                    <div className="flex gap-2">
                       <div className="relative" ref={dropdownRef}>
                          <button
                            type="button"
                            onClick={() => setOpenDropdown(!openDropdown)}
                            className="h-10 px-3 bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-2 text-xs font-black text-slate-500 hover:border-indigo-500 transition-all cursor-pointer"
                          >
                            <span>+{selectedCountry.phoneCode}</span>
                            <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${openDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          {/* Hidden input to pass selected country code to server */}
                          <input type="hidden" name="staffCountryCode" value={selectedCountry.code} />

                          {openDropdown && (
                            <div className="absolute z-[110] left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 max-h-60 flex flex-col">
                              <div className="px-3 pb-2 border-b border-slate-50 mb-1 sticky top-0 bg-white">
                                <div className="relative">
                                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                  <input 
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search..."
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                    className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border-none rounded-lg text-[10px] font-bold outline-none focus:ring-1 focus:ring-indigo-500/20"
                                  />
                                </div>
                              </div>
                              <div className="overflow-y-auto flex-1 text-left">
                                {filteredCountries.map((c) => (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => { setSelectedCountry(c); setOpenDropdown(false); setCountrySearch(""); }}
                                    className={`flex items-center justify-between w-full px-4 py-2 text-[10px] font-bold ${selectedCountry.code === c.code ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
                                  >
                                    <span className="truncate mr-2">{c.name}</span>
                                    <span className="text-slate-400">+{c.phoneCode}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                       </div>
                       <input
                        name="phone"
                        type="tel"
                        placeholder="e.g., 9876543210"
                        className="flex-1 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-xs dark:text-white focus:outline-none transition-all focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500"
                       />
                    </div>
                  </div>
                  <div>
                    <input
                      name="password"
                      type="password"
                      onChange={() => clearFieldError("password")}
                      placeholder="Initial Password"
                      className={`block w-full rounded-lg border px-3 py-2 text-xs focus:outline-none transition-all ${
                        fieldErrors.password ? "border-rose-300 bg-rose-50 focus:border-rose-500" : "border-slate-200 focus:border-indigo-500"
                      }`}
                    />
                    <InputError message={fieldErrors.password} />
                  </div>
                  <div>
                    <input
                      name="confirmPassword"
                      type="password"
                      onChange={() => clearFieldError("confirmPassword")}
                      placeholder="Confirm Password"
                      className={`block w-full rounded-lg border px-3 py-2 text-xs focus:outline-none transition-all ${
                        fieldErrors.confirmPassword ? "border-rose-300 bg-rose-50 focus:border-rose-500" : "border-slate-200 focus:border-indigo-500"
                      }`}
                    />
                    <InputError message={fieldErrors.confirmPassword} />
                  </div>
               </div>
             </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700">Bio / Specialization</label>
          <textarea
            name="bio"
            rows={2}
            placeholder="e.g., Expert colorist"
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <p className="text-[10px] text-slate-400 italic">Default availability: Mon-Fri, 9 AM - 5 PM. Customize later in list.</p>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Staff Member"}
        </button>
      </form>
    </div>
  );
}
