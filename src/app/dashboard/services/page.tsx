import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Scissors, Clock } from "lucide-react";
import { AddServiceForm } from "@/components/dashboard/add-service-form";

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const tenantId = (session.user as any).tenantId;
  const services = await prisma.service.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Services</h2>
          <p className="text-slate-500 font-medium">Manage the services your business offers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Service Form */}
        <div className="lg:col-span-1">
          <AddServiceForm />
        </div>

        {/* Services List */}
        <div className="lg:col-span-2 space-y-4">
          {services.length === 0 ? (
            <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
              <Scissors className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold">No services added yet</p>
              <p className="text-sm text-slate-400">Create your first service to start taking bookings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div key={service.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft relative overflow-hidden group hover:shadow-xl transition-all">
                  <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: service.color }}></div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-bold text-slate-900">{service.name}</h4>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> {service.durationMinutes} minutes
                      </p>
                    </div>
                    <span className="font-black text-indigo-600">${service.price.toString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-lg shadow-sm" style={{ backgroundColor: service.color }}></div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calendar Theme</span>
                    </div>
                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
