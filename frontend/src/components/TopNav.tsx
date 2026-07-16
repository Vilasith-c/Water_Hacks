"use client";

import { useState } from "react";
import { Search, Bell, Sparkles, Plus, Landmark } from "lucide-react";

interface TopNavProps {
  onSearch?: (query: string) => void;
  onOpenCreateProject?: () => void;
  orgName?: string;
  setOrgName?: (name: string) => void;
  setOrganizationId: (id: string) => void;
}

export default function TopNav({ 
  onSearch, 
  onOpenCreateProject, 
  orgName = "Enterprise Workspace",
  setOrgName,
  setOrganizationId
}: TopNavProps) {
  const [searchVal, setSearchVal] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrgId = e.target.value;
    setOrganizationId(selectedOrgId);
    
    if (setOrgName) {
      setOrgName(selectedOrgId === "org_default_test_id" ? "Enterprise Workspace" : "Alternate Workspace");
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/90">
      {/* Left side: Org Switcher / Selector */}
      <div className="flex items-center gap-3">
        <Landmark className="w-5 h-5 text-blue-600" />
        <select 
          onChange={handleOrgChange}
          defaultValue="org_default_test_id"
          className="bg-gray-50 border border-gray-200 text-gray-800 text-sm font-semibold rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 transition-all duration-200"
        >
          <option value="org_default_test_id">Enterprise Workspace</option>
          <option value="org_alternate_test_id">Alternate Workspace</option>
        </select>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-lg mx-8 relative hidden md:block">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchVal}
          onChange={handleSearchChange}
          placeholder="Search documents, projects or audit logs... (Ctrl+K)"
          className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200"
        />
      </div>

      {/* Right side: Quick Action Buttons & Profile */}
      <div className="flex items-center gap-4">
        {onOpenCreateProject && (
          <button
            onClick={onOpenCreateProject}
            className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}
        
        <div className="h-8 w-px bg-gray-200"></div>

        {/* AI Quick Chat badge */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs text-indigo-700 font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-600" />
          <span>Gemini AI Active</span>
        </div>
      </div>
    </header>
  );
}
