import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Award,
  Truck,
  Users,
  Briefcase,
  FileText,
  BookOpen,
  Inbox,
  Shield,
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();

  if (!user) return null;

  const userLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/pickup/new', label: 'Schedule Pickup', icon: PlusCircle },
    { to: '/dashboard/pickups', label: 'My Pickups', icon: History },
    { to: '/dashboard/rewards', label: 'Green Rewards', icon: Award },
    { to: '/awareness', label: 'Awareness Hub', icon: BookOpen },
  ];

  const collectorLinks = [
    { to: '/collector', label: 'Overview', icon: LayoutDashboard },
    { to: '/collector/available', label: 'Available Pickups', icon: Inbox },
    { to: '/collector/pickups', label: 'Assigned Pickups', icon: Truck },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Analytics', icon: LayoutDashboard },
    { to: '/admin/requests', label: 'Manage Pickups', icon: Truck },
    { to: '/admin/users', label: 'Manage Users', icon: Users },
    { to: '/admin/collectors', label: 'Manage Collectors', icon: Briefcase },
    { to: '/admin/reports', label: 'Reports', icon: FileText },
  ];

  // Admin gets all sections grouped together
  const isAdmin = user.role === 'admin';

  const renderLink = (link) => {
    const Icon = link.icon;
    return (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.to === '/dashboard' || link.to === '/collector' || link.to === '/admin'}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${
            isActive
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
              : 'text-slate-400 border border-transparent hover:bg-slate-800/40 hover:text-slate-200'
          }`
        }
      >
        <Icon className="h-4.5 w-4.5" />
        <span>{link.label}</span>
      </NavLink>
    );
  };

  const renderSectionHeader = (label) => (
    <div className="px-3 pt-4 pb-1">
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
        {label}
      </span>
    </div>
  );

  return (
    <aside
      className={`fixed top-16 bottom-0 left-0 z-30 w-64 border-r border-slate-800 bg-slate-900 transition-transform lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-full flex-col justify-between px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          <div className="px-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Navigation Menu
            </span>
          </div>

          {isAdmin ? (
            <>
              {/* Admin Section */}
              {renderSectionHeader('Admin Panel')}
              {adminLinks.map(renderLink)}

              {/* User Section */}
              {renderSectionHeader('User Dashboard')}
              {userLinks.map(renderLink)}

              {/* Collector Section */}
              {renderSectionHeader('Collector Console')}
              {collectorLinks.map(renderLink)}

              {/* Common */}
              {renderSectionHeader('Resources')}
              {renderLink({ to: '/awareness', label: 'Awareness Hub', icon: BookOpen })}
            </>
          ) : (
            <>
              {(user.role === 'collector' ? collectorLinks : userLinks).map(renderLink)}
              {user.role === 'collector' &&
                renderLink({ to: '/awareness', label: 'Awareness Hub', icon: BookOpen })}
            </>
          )}
        </div>

        {/* Info card at bottom of sidebar */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 mt-4 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              {isAdmin ? 'Admin Access' : 'Eco Score'}
            </span>
          </div>
          <p className="text-xs font-semibold text-emerald-400">
            {user.role === 'user' ? `${user.greenScore} Points` : isAdmin ? 'Full System Access' : 'Eco Dashboard'}
          </p>
          {user.role === 'user' && (
            <p className="text-[10px] text-slate-500 mt-1">
              Keep recycling to grow your score!
            </p>
          )}
          {isAdmin && (
            <p className="text-[10px] text-slate-500 mt-1">
              You have access to all panels.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

