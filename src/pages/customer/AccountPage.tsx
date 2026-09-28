import React, { useState } from 'react';
import { User as UserIcon, MapPin, KeyRound, Plus, Trash2, Edit3, Check, ShieldCheck, LogOut } from 'lucide-react';
import { Address } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AccountPageProps {
  onNavigateToOrders: () => void;
  onNavigateToWishlist: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigateToOrders, onNavigateToWishlist }) => {
  const { currentUser, updateProfile, logout } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');

  // Profile Form
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState<Address[]>(currentUser?.addresses || []);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState<Address>({
    id: '',
    houseFlat: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    country: 'France',
    isDefault: false,
  });

  // Password change
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(name, phone);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrForm({
      id: 'addr-' + Date.now(),
      houseFlat: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      country: 'France',
      isDefault: addresses.length === 0,
    });
    setAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddrForm({ ...addr });
    setAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.houseFlat || !addrForm.street || !addrForm.city || !addrForm.pincode) {
      showToast('Please fill all mandatory address fields.', 'error');
      return;
    }

    let updated = [...addresses];
    if (editingAddressId) {
      updated = updated.map((a) => (a.id === editingAddressId ? addrForm : a));
    } else {
      updated.push(addrForm);
    }

    if (addrForm.isDefault) {
      updated = updated.map((a) => (a.id === addrForm.id ? a : { ...a, isDefault: false }));
    }

    setAddresses(updated);
    setAddressModalOpen(false);
    showToast('Delivery address saved.', 'success');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address removed.', 'info');
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    showToast('Default delivery address updated.', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    showToast('Password successfully changed.', 'success');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Title */}
      <div className="border-b border-[#261E1E]/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
            Client Profile
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold text-[#261E1E]">My Atelier Account</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Signed in as <strong>{currentUser?.email || 'customer@aurelia.com'}</strong>
          </p>
        </div>

        <button
          onClick={logout}
          className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="space-y-1 bg-white p-4 rounded-xl border border-[#261E1E]/8 h-fit">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#4A1525] text-white'
                : 'text-[#261E1E] hover:bg-[#FBF9F5]'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Personal Information</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded transition-colors ${
              activeTab === 'addresses'
                ? 'bg-[#4A1525] text-white'
                : 'text-[#261E1E] hover:bg-[#FBF9F5]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded transition-colors ${
              activeTab === 'security'
                ? 'bg-[#4A1525] text-white'
                : 'text-[#261E1E] hover:bg-[#FBF9F5]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Change Password</span>
          </button>

          <div className="pt-3 border-t border-[#261E1E]/10 space-y-1">
            <button
              onClick={onNavigateToOrders}
              className="w-full text-left px-3 py-2 text-xs text-[#4A1525] hover:bg-[#F8EBEF] font-semibold rounded"
            >
              View Order History →
            </button>
            <button
              onClick={onNavigateToWishlist}
              className="w-full text-left px-3 py-2 text-xs text-[#4A1525] hover:bg-[#F8EBEF] font-semibold rounded"
            >
              View Saved Wishlist →
            </button>
          </div>
        </aside>

        {/* Content Area (3 cols) */}
        <main className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-2xl border border-[#261E1E]/10 shadow-xs">
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">Personal Information</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Manage your patron contact details for Cash on Delivery shipments.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 focus:outline-none focus:border-[#4A1525]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || 'customer@aurelia.com'}
                  className="w-full text-xs bg-zinc-100 border border-zinc-200 rounded-md p-3 text-zinc-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">
                  Email identifier is bound to your customer profile.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">Telephone Contact</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 018-8421"
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 focus:outline-none focus:border-[#4A1525]"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold rounded transition-colors"
              >
                {savingProfile ? 'Updating Profile...' : 'Save Profile Changes'}
              </button>
            </form>
          )}

          {/* TAB 2: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#261E1E]/10">
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">Shipping Addresses</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Addresses saved for instant selection during Cash on Delivery checkout.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddAddress}
                  className="px-4 py-2 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold rounded flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Add New Address</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-500">
                  No delivery addresses saved yet. Click "Add New Address" above.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-4 rounded-xl border relative flex flex-col justify-between ${
                        addr.isDefault
                          ? 'border-[#4A1525] bg-[#F8EBEF]/30'
                          : 'border-[#261E1E]/10 bg-white'
                      }`}
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-[#261E1E]">{addr.houseFlat}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold text-[#4A1525] uppercase tracking-wider bg-[#F8EBEF] px-2 py-0.5 rounded">
                              Default Address
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-600">{addr.street}</p>
                        {addr.landmark && <p className="text-zinc-500">Near: {addr.landmark}</p>}
                        <p className="text-zinc-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-zinc-600 font-medium">{addr.country}</p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-[#261E1E]/8 flex items-center justify-between text-xs">
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[#4A1525] font-semibold hover:underline"
                          >
                            Set as Default
                          </button>
                        )}
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => handleOpenEditAddress(addr)}
                            className="p-1 text-zinc-500 hover:text-[#4A1525]"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1 text-zinc-500 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Security */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">Security & Credentials</h3>
                <p className="text-xs text-zinc-500 mt-1">Update your password to keep your atelier account secure.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold rounded transition-colors"
              >
                Update Password
              </button>
            </form>
          )}
        </main>
      </div>

      {/* ADD/EDIT ADDRESS MODAL */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setAddressModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
              <h3 className="font-serif-luxury text-xl font-bold text-[#261E1E]">
                {editingAddressId ? 'Edit Address' : 'Add New Delivery Address'}
              </h3>

              <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-[#261E1E] block mb-1">House / Flat / Suite *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.houseFlat}
                    onChange={(e) => setAddrForm({ ...addrForm, houseFlat: e.target.value })}
                    placeholder="e.g. Apt 4B"
                    className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#261E1E] block mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={addrForm.street}
                    onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                    placeholder="e.g. Rue de la Paix"
                    className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">Landmark</label>
                    <input
                      type="text"
                      value={addrForm.landmark || ''}
                      onChange={(e) => setAddrForm({ ...addrForm, landmark: e.target.value })}
                      placeholder="Near Royal Gardens"
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={addrForm.city}
                      onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                      placeholder="Paris"
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={addrForm.state}
                      onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                      placeholder="Ile-de-France"
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={addrForm.pincode}
                      onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })}
                      placeholder="75001"
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#261E1E] block mb-1">Country *</label>
                    <input
                      type="text"
                      required
                      value={addrForm.country}
                      onChange={(e) => setAddrForm({ ...addrForm, country: e.target.value })}
                      placeholder="France"
                      className="w-full p-2.5 bg-[#FBF9F5] border border-[#261E1E]/20 rounded"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addrForm.isDefault}
                    onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                    className="accent-[#4A1525]"
                  />
                  <span>Set as default delivery address for COD orders</span>
                </label>

                <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setAddressModalOpen(false)}
                    className="px-4 py-2 font-semibold text-zinc-600 hover:bg-zinc-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-semibold bg-[#4A1525] text-white rounded hover:bg-[#360D19]"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
