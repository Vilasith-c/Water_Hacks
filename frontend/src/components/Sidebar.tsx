"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FolderGit2, 
  FileText, 
  MessageSquareCode, 
  Search, 
  Users, 
  Building2, 
  ShieldAlert, 
  History, 
  BarChart3, 
  Settings, 
  Bell,
  LogOut,
  Hexagon
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  orgName?: string;
}

export default function Sidebar({ activeTab, setActiveTab, orgName = "Enterprise Workspace" }: SidebarProps) {
  const { user, logout } = useAuth();
  const isAdmin = true; // Set to true for MVP

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, category: "Workspace" },
    { id: "projects", label: "Projects", icon: FolderGit2, category: "Workspace" },
    { id: "documents", label: "Documents", icon: FileText, category: "Workspace" },
    { id: "ai", label: "AI Assistant", icon: MessageSquareCode, category: "Workspace" },
    
    { id: "members", label: "Members", icon: Users, category: "Organization" },
    { id: "departments", label: "Departments", icon: Building2, category: "Organization" },
    
    { id: "audit", label: "Audit Logs", icon: History, category: "Administration", adminOnly: true },
    { id: "analytics", label: "Analytics", icon: BarChart3, category: "Administration", adminOnly: true },
    { id: "settings", label: "Settings", icon: Settings, category: "Administration" }
  ];

  const categories = ["Workspace", "Organization", "Administration"];

  return (
    <aside className="w-64 bg-black text-gray-100 flex flex-col h-screen border-r border-[#1a1a1a] shadow-2xl transition-all duration-300 relative z-40">
      {/* Workspace Switcher / Header */}
      <div className="p-6 border-b border-[#1a1a1a] flex items-center gap-4 relative overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.div 
          whileHover={{ rotate: 90 }} 
          transition={{ duration: 0.3 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center font-bold text-black shadow-[0_0_15px_rgba(205,157,57,0.4)] relative z-10"
        >
          <Hexagon className="w-6 h-6 fill-black/20" />
        </motion.div>
        <div className="flex flex-col overflow-hidden relative z-10">
          <span className="font-extrabold text-sm truncate text-white tracking-wide">{orgName}</span>
          <span className="text-xs text-gold-500 font-bold uppercase tracking-widest">Premium Tier</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin scrollbar-thumb-[#222]">
        {categories.map((category) => {
          const categoryItems = navItems.filter(
            item => item.category === category && (!item.adminOnly || isAdmin)
          );

          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <h4 className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {category}
              </h4>
              <div className="space-y-1 relative">
                {categoryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors duration-200 group ${
                        isActive
                          ? "text-black"
                          : "text-gray-400 hover:text-gold-100 hover:bg-[#111]"
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-600 rounded-xl shadow-[0_0_15px_rgba(205,157,57,0.3)]"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon className={`w-4.5 h-4.5 relative z-10 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-black" : "text-gray-500 group-hover:text-gold-300"}`} />
                      <span className="relative z-10">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Section / Bottom Bar */}
      <div className="p-5 border-t border-[#1a1a1a] bg-[#050505] flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-gold-400 text-xs shadow-inner">
            {user?.email ? user.email[0].toUpperCase() : "U"}
          </div>
          <div className="flex flex-col overflow-hidden max-w-[120px]">
            <span className="text-xs font-bold text-gray-200 truncate">{user?.email || "tester@example.com"}</span>
            <button 
              onClick={() => logout()}
              className="text-[10px] text-gray-500 hover:text-red-400 font-semibold text-left transition-colors flex items-center gap-1 mt-0.5"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab("notifications")}
          className="relative p-2 rounded-xl text-gray-500 hover:bg-[#111] hover:text-gold-400 transition-all duration-200"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-gold-500 shadow-[0_0_5px_rgba(205,157,57,0.8)] border-2 border-[#050505]"></span>
        </motion.button>
      </div>
    </aside>
  );
}
