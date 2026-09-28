import React, { useState, useEffect } from 'react';
import { Search, User as UserIcon, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { User } from '../../types';
import { adminService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      const updated = await adminService.toggleCustomerStatus(id);
      setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
      showToast(`Account status updated to ${updated.active ? 'Active' : 'Suspended'}.`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to update', 'error');
    }
  };

  const filtered = customers.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif-luxury text-2xl font-bold text-[#261E1E]">Patron Accounts & Cohort</h2>
        <p className="text-xs text-zinc-500">Registered customers and saved delivery locations.</p>
      </div>

      <div className="bg-white p-3 rounded-lg border border-[#261E1E]/8 text-xs">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patron name, email, or telephone..."
            className="w-full bg-[#FBF9F5] border border-[#261E1E]/15 rounded px-3 py-2 pl-8 focus:outline-none focus:border-[#4A1525]"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#261E1E]/8 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] text-zinc-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Patron Name</th>
                <th className="py-3 px-4 font-semibold">Contact Email & Phone</th>
                <th className="py-3 px-4 font-semibold">Registered Addresses</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#261E1E]/5">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#FBF9F5]/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#261E1E] flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#F8EBEF] text-[#4A1525] flex items-center justify-center font-bold">
                      {c.name.charAt(0)}
                    </div>
                    <span>{c.name}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-zinc-700 block">{c.email}</span>
                    <span className="text-[10px] text-zinc-400">{c.phone || 'No phone'}</span>
                  </td>

                  <td className="py-3 px-4 text-zinc-600">
                    {c.addresses && c.addresses.length > 0 ? (
                      <span className="text-xs">
                        {c.addresses[0].city}, {c.addresses[0].country}
                      </span>
                    ) : (
                      <span className="text-zinc-400">None saved yet</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        c.active ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                      }`}
                    >
                      {c.active ? 'Active' : 'Suspended'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(c.id)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                        c.active
                          ? 'border border-zinc-200 text-zinc-600 hover:text-rose-700 hover:bg-rose-50'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {c.active ? 'Suspend Account' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
