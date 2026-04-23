"use client";

import { useState } from "react";
import { Plus, Clock, DollarSign, Palette, AlertCircle, Loader2 } from "lucide-react";
import { addService } from "@/app/actions/dashboard";

export function AddServiceForm() {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

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
    const duration = formData.get("duration") as string;
    const price = formData.get("price") as string;

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Service name is required";
    if (!duration) errors.duration = "Duration is required";
    if (!price) errors.price = "Price is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    const result = await addService(formData);

    if (result?.error) {
      setGeneralError(result.error);
      setLoading(false);
    } else {
      (e.target as HTMLFormElement).reset();
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
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft sticky top-8">
      <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Plus className="h-5 w-5" />
        </div>
        Add New Service
      </h3>
      
      {generalError && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold border border-rose-100">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Service Name</label>
          <input
            name="name"
            type="text"
            required
            onChange={() => clearFieldError("name")}
            placeholder="e.g., Haircut & Style"
            className={`w-full rounded-xl border-2 px-4 py-2 text-sm focus:outline-none transition-all ${
              fieldErrors.name ? "border-rose-100 bg-rose-50 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500 focus:border-indigo-600"
            }`}
          />
          <InputError message={fieldErrors.name} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Duration (min)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                name="duration"
                type="number"
                required
                onChange={() => clearFieldError("duration")}
                placeholder="30"
                className={`w-full pl-10 rounded-xl border-2 px-4 py-2 text-sm focus:outline-none transition-all ${
                  fieldErrors.duration ? "border-rose-100 bg-rose-50 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500 focus:border-indigo-600"
                }`}
              />
            </div>
            <InputError message={fieldErrors.duration} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Price ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                name="price"
                type="number"
                step="0.01"
                required
                onChange={() => clearFieldError("price")}
                placeholder="50.00"
                className={`w-full pl-10 rounded-xl border-2 px-4 py-2 text-sm focus:outline-none transition-all ${
                  fieldErrors.price ? "border-rose-100 bg-rose-50 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500 focus:border-indigo-600"
                }`}
              />
            </div>
            <InputError message={fieldErrors.price} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Palette className="h-4 w-4 text-slate-400" />
            Calendar Color
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Indigo', value: '#6366f1' },
              { name: 'Emerald', value: '#10b981' },
              { name: 'Sky', value: '#0ea5e9' },
              { name: 'Amber', value: '#f59e0b' },
              { name: 'Rose', value: '#f43f5e' },
              { name: 'Violet', value: '#8b5cf6' },
            ].map((color) => (
              <label key={color.value} className="relative cursor-pointer group">
                <input type="radio" name="color" value={color.value} className="peer sr-only" defaultChecked={color.name === 'Indigo'} />
                <div className="w-8 h-8 rounded-xl border-2 border-transparent peer-checked:border-indigo-600 peer-checked:scale-110 transition-all shadow-sm group-hover:scale-110" style={{ backgroundColor: color.value }}></div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Service"}
        </button>
      </form>
    </div>
  );
}
