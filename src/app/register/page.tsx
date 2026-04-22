"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Loader2, Eye, EyeOff, ArrowRight, Globe, ChevronDown, Check, Search } from "lucide-react";
import { registerBusiness } from "@/app/actions/register";
import { COUNTRIES } from "@/config/countries";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<typeof COUNTRIES[0] | null>(null);
  const [selectedBusinessType, setSelectedBusinessType] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [dropdownDirection, setDropdownDirection] = useState<"up" | "down">("down");
  const dropdownRef = useRef<HTMLFormElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  useEffect(() => {
    if (openDropdown === "country" && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [openDropdown]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (e: React.MouseEvent, name: string) => {
    const button = e.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceNeeded = 250; // Approximate height

    setDropdownDirection(spaceBelow < spaceNeeded ? "up" : "down");
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setOpenDropdown(null);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!selectedCountry) {
      setError("Please select your country");
      setLoading(false);
      return;
    }

    if (!selectedBusinessType) {
      setError("Please select your business type");
      setLoading(false);
      return;
    }

    const result = await registerBusiness(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/login?registered=true");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8 selection:bg-indigo-100">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100">
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">FluxBooking</span>
          </Link>
          <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">
            Join FluxBooking
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <form ref={dropdownRef} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100 animate-shake">
              {error}
            </div>
          )}
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all sm:text-sm font-medium"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all sm:text-sm font-medium"
                placeholder="john@example.com"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all sm:text-sm font-medium pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">
                  Confirm
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all sm:text-sm font-medium pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="businessName" className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">
                Business Name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                required
                className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all sm:text-sm font-medium"
                placeholder="My Awesome Salon"
              />
            </div>

            <div>
              {/* Custom Country Selector */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">
                  Country
                </label>
                <div className="relative">
                  <input type="hidden" name="country" value={selectedCountry?.code || ""} />
                  <button
                    type="button"
                    onClick={(e) => toggleDropdown(e, "country")}
                    className="flex items-center justify-between w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-indigo-600 transition-all sm:text-sm font-bold"
                  >
                    <span className={!selectedCountry ? "text-slate-400" : ""}>
                      {selectedCountry ? selectedCountry.name : "Select Country"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openDropdown === "country" ? "rotate-180" : ""}`} />
                  </button>

                  {openDropdown === "country" && (
                    <div className={`absolute z-50 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 max-h-72 flex flex-col animate-in fade-in zoom-in duration-200 ${
                      dropdownDirection === "up" ? "bottom-full mb-2" : "top-full mt-2"
                    }`}>
                      {/* Search Bar */}
                      <div className="px-3 pb-2 pt-1 border-b border-slate-50 mb-1 sticky top-0 bg-white z-10">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input 
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search country..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                          />
                        </div>
                      </div>

                      {/* Filtered List */}
                      <div className="overflow-y-auto flex-1">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => { handleCountrySelect(c); setCountrySearch(""); }}
                              className={`flex items-center w-full px-5 py-3 text-sm font-bold transition-colors text-left ${
                                selectedCountry?.code === c.code 
                                ? "bg-indigo-50 text-indigo-600" 
                                : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              {c.name}
                            </button>
                          ))
                        ) : (
                          <div className="px-5 py-8 text-center">
                            <p className="text-xs font-bold text-slate-400">No countries found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Custom Business Type Selector */}
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">
                  Type
                </label>
                <div className="relative">
                  <input type="hidden" name="businessType" value={selectedBusinessType || ""} />
                  <button
                    type="button"
                    onClick={(e) => toggleDropdown(e, "type")}
                    className="flex items-center justify-between w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-indigo-600 transition-all sm:text-sm font-bold"
                  >
                    <span className={!selectedBusinessType ? "text-slate-400" : ""}>
                      {selectedBusinessType === "SALON" ? "Salon / Spa" : selectedBusinessType === "GYM" ? "Gym / Fitness" : "Select Type"}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${openDropdown === "type" ? "rotate-180" : ""}`} />
                  </button>

                  {openDropdown === "type" && (
                    <div className={`absolute z-50 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in fade-in zoom-in duration-200 ${
                      dropdownDirection === "up" ? "bottom-full mb-2" : "top-full mt-2"
                    }`}>
                      <button
                        type="button"
                        onClick={() => { setSelectedBusinessType("SALON"); setOpenDropdown(null); }}
                        className={`flex items-center w-full px-5 py-3 text-sm font-bold transition-colors ${
                          selectedBusinessType === "SALON" 
                          ? "bg-indigo-50 text-indigo-600" 
                          : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Salon / Spa
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSelectedBusinessType("GYM"); setOpenDropdown(null); }}
                        className={`flex items-center w-full px-5 py-3 text-sm font-bold transition-colors ${
                          selectedBusinessType === "GYM" 
                          ? "bg-indigo-50 text-indigo-600" 
                          : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Gym / Fitness
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="slug" className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">
                  Custom URL
                </label>
                <div className="flex rounded-2xl shadow-sm overflow-hidden border-2 border-slate-50">
                  <span className="inline-flex items-center bg-slate-100 px-3 text-slate-500 text-xs font-bold border-r border-slate-200">
                    /b/
                  </span>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    required
                    className="block w-full min-w-0 flex-1 bg-slate-50 px-3 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition-all text-xs font-bold"
                    placeholder="my-salon"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-base shadow-2xl shadow-slate-200 transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-95 disabled:bg-slate-300 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
