"use client";

import { useAuth } from "@/context/AuthContext";
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
  LogOut
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
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen border-r border-slate-800 shadow-xl transition-all duration-300">
      {/* Workspace Switcher / Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
          A
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold text-sm truncate text-white">{orgName}</span>
          <span className="text-xs text-slate-400 font-medium">Free Tier MVP</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7 scrollbar-thin scrollbar-thumb-slate-800">
        {categories.map((category) => {
          const categoryItems = navItems.filter(
            item => item.category === category && (!item.adminOnly || isAdmin)
          );

          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <h4 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {category}
              </h4>
              <div className="space-y-1">
                {categoryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Section / Bottom Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
            {user?.email ? user.email[0].toUpperCase() : "U"}
          </div>
          <div className="flex flex-col overflow-hidden max-w-[120px]">
            <span className="text-xs font-semibold text-white truncate">{user?.email || "tester@example.com"}</span>
            <button 
              onClick={() => logout()}
              className="text-[10px] text-red-400 hover:text-red-300 font-semibold text-left transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab("notifications")}
          className="relative p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500"></span>
        </button>
      </div>
    </aside>
  );
}
