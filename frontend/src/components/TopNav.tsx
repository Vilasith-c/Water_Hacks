"use client";

import { useState } from "react";
import { Search, Sparkles, Plus, Landmark } from "lucide-react";
import { motion } from "framer-motion";

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
    <header className="bg-black/50 border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md backdrop-blur-xl">
      {/* Left side: Org Switcher / Selector */}
      <div className="flex items-center gap-3">
        <Landmark className="w-5 h-5 text-gold-500" />
        <select 
          onChange={handleOrgChange}
          defaultValue="org_default_test_id"
          className="bg-[#111] border border-[#222] text-gray-200 text-sm font-semibold rounded-lg focus:ring-gold-500/50 focus:border-gold-500/50 p-2.5 transition-all duration-200 outline-none"
        >
          <option value="org_default_test_id">Enterprise Workspace</option>
          <option value="org_alternate_test_id">Alternate Workspace</option>
        </select>
      </div>

      {/* Center: Global Search */}
      <motion.div 
        animate={{ width: isSearchFocused ? "40%" : "30%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative hidden md:block mx-8 origin-center"
      >
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className={`w-4 h-4 transition-colors duration-300 ${isSearchFocused ? "text-gold-400" : "text-gray-500"}`} />
        </div>
        <input
          type="text"
          value={searchVal}
          onChange={handleSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder="Search documents, projects or audit logs... (Ctrl+K)"
          className="w-full bg-[#111] border border-[#222] rounded-full pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-300"
        />
        <div className="absolute inset-0 -z-10 rounded-full blur-md opacity-0 transition-opacity duration-300 bg-gold-500/10 pointer-events-none" style={{ opacity: isSearchFocused ? 1 : 0 }} />
      </motion.div>

      {/* Right side: Quick Action Buttons & Profile */}
      <div className="flex items-center gap-4">
        {onOpenCreateProject && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenCreateProject}
            className="bg-gradient-to-r from-gold-600 to-gold-500 text-black hover:from-gold-500 hover:to-gold-400 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(205,157,57,0.3)] transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </motion.button>
        )}
        
        <div className="h-8 w-px bg-[#222]"></div>

        {/* AI Quick Chat badge */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-gold-500/10 border border-gold-500/20 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs text-gold-400 font-semibold shadow-inner cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-gold-500" />
          <span>Gemini AI Active</span>
        </motion.div>
      </div>
    </header>
  );
}
