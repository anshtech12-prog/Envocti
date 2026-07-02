import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Search, ShieldAlert, Award, Phone, Mail, UserCheck, ShieldX, Key, LogIn } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ManageUsers = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleImpersonate = async (id, name, role) => {
    if (!window.confirm(`Are you sure you want to log in as ${name}? You will be logged out of your admin session.`)) return;

    try {
      const res = await api.post(`/admin/users/${id}/impersonate`);
      if (res.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data);
        toast.success(`Logged in as ${name}!`);
        if (role === 'collector') {
          navigate('/collector');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to impersonate user');
    }
  };

  const handleChangePassword = async (id, name) => {
    const newPassword = window.prompt(`Enter a new password for ${name} (minimum 6 characters):`);
    if (newPassword === null) return; // cancelled
    if (newPassword.trim().length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const res = await api.put(`/admin/users/${id}`, {
        password: newPassword.trim(),
      });
      if (res.success) {
        toast.success(`Successfully updated password for ${name}!`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', {
        params: {
          search: search || undefined,
          role: roleFilter || undefined,
          page,
          limit: 10,
        },
      });
      if (res.success) {
        setUsers(res.data);
        setTotalPages(res.pagination.pages);
      }
    } catch (err) {
      toast.error('Failed to load user accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, page]);

  const toggleUserActive = async (id, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this user account?`)) return;

    try {
      const res = await api.put(`/admin/users/${id}`, {
        isActive: !currentStatus,
      });
      if (res.success) {
        toast.success(`User successfully ${action}d!`);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update user status');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Manage Users</h1>
        <p className="text-xs text-slate-400">View registered citizen and collector accounts, search profiles, and restrict access.</p>
      </div>

      {/* Filters bar */}
      <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full sm:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
          />
        </div>

        {/* Role selection */}
        <div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-350 outline-none focus:border-emerald-500"
          >
            <option value="">All Roles</option>
            <option value="user">User / Citizen</option>
            <option value="collector">Collector</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>

      {/* Table grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-12 text-center text-xs text-slate-500">
          No registered user profiles match search parameters.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/40 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Green Score</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-800/10">
                      <td className="px-5 py-4 font-semibold text-white">{u.name}</td>
                      <td className="px-5 py-4 text-slate-400">{u.email}</td>
                      <td className="px-5 py-4">{u.phone}</td>
                      <td className="px-5 py-4 capitalize">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                          u.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : u.role === 'collector'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-emerald-400 font-bold">
                        {u.role === 'user' ? u.greenScore : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                          u.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-medium">
                        {u.role !== 'admin' && (
                          <div className="flex items-center justify-end gap-2">
                            {/* Impersonate Button */}
                            <button
                              onClick={() => handleImpersonate(u._id, u.name, u.role)}
                              title={`Login as ${u.name}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-[11px] font-bold text-purple-400 hover:bg-purple-500 hover:text-white transition-colors"
                            >
                              <LogIn className="h-3.5 w-3.5" />
                              Login As
                            </button>

                            {/* Reset Password Button */}
                            <button
                              onClick={() => handleChangePassword(u._id, u.name)}
                              title="Set New Password"
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-400 hover:bg-amber-500 hover:text-white transition-colors"
                            >
                              <Key className="h-3.5 w-3.5" />
                              Password
                            </button>

                            {/* Suspend / Activate Button */}
                            <button
                              onClick={() => toggleUserActive(u._id, u.isActive)}
                              title={u.isActive ? 'Suspend Account' : 'Reactivate Account'}
                              className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors ${
                                u.isActive
                                  ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white'
                                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950'
                              }`}
                            >
                              {u.isActive ? (
                                <>
                                  <ShieldX className="h-3.5 w-3.5" />
                                  Suspend
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-3.5 w-3.5" />
                                  Activate
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-900/60 pt-4 px-2">
              <span className="text-[10px] text-slate-500 font-medium">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-350 hover:bg-slate-800 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-350 hover:bg-slate-800 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
