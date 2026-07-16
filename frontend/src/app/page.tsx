"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import DocumentManager from "@/components/DocumentManager";
import ProjectManager from "@/components/ProjectManager";
import { 
  FolderGit2, 
  FileText, 
  MessageSquareCode, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  ShieldAlert,
  Loader2,
  Lock,
  ArrowRight,
  Sparkles,
  Send,
  Search,
  Folder,
  SlidersHorizontal,
  Key,
  Database,
  Cpu,
  RefreshCw,
  Info
} from "lucide-react";

export default function Home() {
  const { user, loading: authLoading, getToken } = useAuth();
  const userId = user?.uid;
  const isLoaded = !authLoading;
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orgName, setOrgName] = useState("Enterprise Workspace");
  const [organizationId, setOrganizationId] = useState("org_default_test_id");
  const [isOpenCreateProject, setIsOpenCreateProject] = useState(false);
  const [apiLogs, setApiLogs] = useState<any[]>([]);

  // Dynamic statistics
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalFolders, setTotalFolders] = useState(0);
  const [statsLoading, setStatsLoading] = useState(false);

  // Search view states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilterDept, setSearchFilterDept] = useState("");
  const [searchFilterAccess, setSearchFilterAccess] = useState("");
  const [searchResults, setSearchResults] = useState<{ documents: any[]; folders: any[] }>({
    documents: [],
    folders: []
  });
  const [isSearching, setIsSearching] = useState(false);

  const mockDepts = ["Marketing", "HR", "Finance", "Engineering", "Operations", "Legal"];

  // AI Integration States
  const [providersMetadata, setProvidersMetadata] = useState<any[]>([]);
  const [orgCredentials, setOrgCredentials] = useState<any[]>([]);
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);

  // AI Settings configuration form
  const [settingsProvider, setSettingsProvider] = useState("groq");
  const [settingsModel, setSettingsModel] = useState("llama-3.3-70b-versatile");
  const [settingsSecretKey, setSettingsSecretKey] = useState("");
  const [settingsBaseUrl, setSettingsBaseUrl] = useState("");
  const [settingsTemp, setSettingsTemp] = useState(0.7);
  const [settingsMaxTokens, setSettingsMaxTokens] = useState(2048);
  const [settingsEnabled, setSettingsEnabled] = useState(true);
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResponse, setTestResponse] = useState<{ status: string; message: string; latency_ms?: number } | null>(null);

  // AI Chat states
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      role: "ai",
      content: "Hello! I am your AI Document Assistant. You can upload files on the Documents page and ask me to summarize them, explain policies, or answer queries using your configured LLM gateway.",
      provider: "system",
      model: "initialization"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatProvider, setChatProvider] = useState("groq");
  const [chatModel, setChatModel] = useState("llama-3.3-70b-versatile");
  const [chatTemp, setChatTemp] = useState(0.7);
  const [chatMaxTokens, setChatMaxTokens] = useState(2048);
  const [isStatelessMode, setIsStatelessMode] = useState(false);
  const [statelessKey, setStatelessKey] = useState("");
  const [isChatSending, setIsChatSending] = useState(false);

  // Sync stats
  const fetchDashboardStats = async () => {
    if (!userId || !organizationId) return;
    setStatsLoading(true);
    try {
      const token = await getToken();
      
      // Get projects count
      const projRes = await fetch(`/api/v1/projects/org/${organizationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (projRes.ok) {
        const body = await projRes.json();
        if (body.success) setTotalProjects(body.data.length);
      }

      // Get documents count
      const docsRes = await fetch(`/api/v1/documents/org/${organizationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (docsRes.ok) {
        const body = await docsRes.json();
        setTotalDocuments(body.length);
      }

      // Get folders count
      const foldersRes = await fetch(`/api/v1/documents/folders/${organizationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (foldersRes.ok) {
        const body = await foldersRes.json();
        setTotalFolders(body.length);
      }
    } catch (err) {
      console.error("Error fetching dashboard statistics", err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch AI configurations
  const fetchAIConfiguration = async () => {
    if (!userId || !organizationId) return;
    setIsMetadataLoading(true);
    try {
      const token = await getToken();
      
      // Fetch metadata providers list
      const provsRes = await fetch("/api/v1/ai/providers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (provsRes.ok) {
        const data = await provsRes.json();
        setProvidersMetadata(data);
      }

      // Fetch saved credentials
      const credsRes = await fetch(`/api/v1/ai/credentials/org/${organizationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (credsRes.ok) {
        const data = await credsRes.json();
        setOrgCredentials(data);
      }
    } catch (err) {
      console.error("Failed to load AI providers settings", err);
    } finally {
      setIsMetadataLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchAIConfiguration();
  }, [userId, organizationId]);

  // Hook search execution
  const executeSearch = async () => {
    if (!organizationId) return;
    setIsSearching(true);
    try {
      const token = await getToken();
      let url = `/api/v1/search?organization_id=${organizationId}`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      if (searchFilterDept) url += `&department_id=${encodeURIComponent(searchFilterDept)}`;
      if (searchFilterAccess) url += `&access_level=${encodeURIComponent(searchFilterAccess)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const body = await res.json();
        if (body.success) {
          setSearchResults(body.data);
        }
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch audit logs from database
  const fetchAuditLogs = async () => {
    try {
      const token = await getToken();
      const res = await fetch("/api/v1/audit/logs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const formattedLogs = data.map((log: any) => ({
          id: log.id,
          user: log.user_name || "System",
          action: log.action,
          resource: log.resource,
          time: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hash: log.current_hash ? `${log.current_hash.slice(0, 6)}...${log.current_hash.slice(-4)}` : "None"
        }));
        setApiLogs(formattedLogs);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    }
  };

  // Trigger search or audit logs fetch on tab / query changes
  useEffect(() => {
    if (activeTab === "search") {
      executeSearch();
    } else if (activeTab === "audit" || activeTab === "dashboard") {
      fetchAuditLogs();
    }
  }, [searchQuery, searchFilterDept, searchFilterAccess, activeTab, organizationId]);

  // Update default models when provider changes in settings form
  useEffect(() => {
    const selectedMeta = providersMetadata.find(p => p.id === settingsProvider);
    if (selectedMeta) {
      setSettingsModel(selectedMeta.default_model);
    }
  }, [settingsProvider, providersMetadata]);

  // Update default models when provider changes in Chat view
  useEffect(() => {
    const selectedMeta = providersMetadata.find(p => p.id === chatProvider);
    if (selectedMeta) {
      setChatModel(selectedMeta.default_model);
    }
  }, [chatProvider, providersMetadata]);

  // Connection tester
  const handleTestConnection = async () => {
    if (!settingsSecretKey) {
      setTestResponse({ status: "error", message: "Please supply an API Key / Token to test." });
      return;
    }
    setIsTestingConnection(true);
    setTestResponse(null);
    try {
      const token = await getToken();
      const res = await fetch("/api/v1/ai/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          provider: settingsProvider,
          model: settingsModel,
          secret_key: settingsSecretKey,
          base_url: settingsBaseUrl || null
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTestResponse(data);
      } else {
        setTestResponse({ status: "error", message: "Failed to query test connection." });
      }
    } catch (err: any) {
      setTestResponse({ status: "error", message: err.message || "Network request failed." });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Credentials saver
  const handleSaveCredentials = async () => {
    if (!settingsSecretKey) {
      alert("Please supply an API Key / Token.");
      return;
    }
    setIsSavingCreds(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/v1/ai/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          organization_id: organizationId,
          provider: settingsProvider,
          model: settingsModel,
          secret_key: settingsSecretKey,
          base_url: settingsBaseUrl || null,
          temperature: settingsTemp,
          max_tokens: settingsMaxTokens,
          enabled: settingsEnabled
        })
      });
      if (res.ok) {
        alert("AI Provider Credentials saved successfully!");
        setSettingsSecretKey(""); // Clear secret field
        fetchAIConfiguration(); // Refresh saved credentials list
      } else {
        alert("Failed to save credentials.");
      }
    } catch (err: any) {
      alert(`Error saving credentials: ${err.message}`);
    } finally {
      setIsSavingCreds(false);
    }
  };

  // Chat sender
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userPrompt = chatInput;
    setChatInput("");
    setIsChatSending(true);

    const newUserMsg = {
      role: "user",
      content: userPrompt
    };
    setChatMessages(prev => [...prev, newUserMsg]);

    try {
      const token = await getToken();
      const headers: any = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      };

      const res = await fetch(`/api/v1/ai/chat?organization_id=${organizationId}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          provider: isStatelessMode ? chatProvider : undefined, // Stateful falls back to db
          model: chatModel,
          prompt: userPrompt,
          api_key: isStatelessMode && statelessKey ? statelessKey : undefined,
          temperature: chatTemp,
          max_tokens: chatMaxTokens
        })
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, {
          role: "ai",
          content: data.content,
          provider: data.provider,
          model: data.model,
          latency: data.latency_ms,
          tokens: data.tokens
        }]);
      } else {
        const errBody = await res.text();
        setChatMessages(prev => [...prev, {
          role: "ai",
          content: `Gateway Error: ${errBody}`,
          provider: "error",
          model: "system"
        }]);
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, {
        role: "ai",
        content: `Network Error: ${err.message}`,
        provider: "error",
        model: "system"
      }]);
    } finally {
      setIsChatSending(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // Not Authenticated view
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-900/20 via-black to-black opacity-60"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative text-center p-12 bg-[#050505]/80 border border-gold-900/30 rounded-[2rem] shadow-[0_0_50px_rgba(205,157,57,0.05)] max-w-lg w-full backdrop-blur-2xl"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-gold-500/10 to-gold-600/5 text-gold-400 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gold-500/20 shadow-inner"
          >
            <Sparkles className="w-12 h-12" />
          </motion.div>
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent tracking-tight">
            NEXORA
          </h1>
          <p className="text-gray-400 mb-10 max-w-md mx-auto leading-relaxed text-lg">
            Secure, AI-powered collaboration and document intelligence for elite teams.
          </p>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/sign-in" 
            className="inline-flex items-center justify-center bg-gradient-to-r from-gold-500 to-gold-600 text-black font-extrabold px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(205,157,57,0.3)] hover:shadow-[0_0_40px_rgba(205,157,57,0.5)] transition-all duration-300 w-full gap-3 text-lg"
          >
            <span>Access Workspace</span>
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-gray-100 overflow-hidden font-sans selection:bg-gold-500/30">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} orgName={orgName} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <TopNav 
          orgName={orgName} 
          setOrgName={setOrgName}
          setOrganizationId={(id) => {
            setOrganizationId(id);
            fetchDashboardStats();
            fetchAIConfiguration();
          }}
          onOpenCreateProject={() => setIsOpenCreateProject(true)} 
          onSearch={(query) => {
            setSearchQuery(query);
            setActiveTab("search");
          }}
        />

        {/* Tab Content Render */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto space-y-8 scrollbar-thin scrollbar-thumb-gray-200">
          
          {/* TAB: DASHBOARD */}
          {activeTab === "dashboard" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Header Greeting */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome to your Dashboard</h1>
                  <p className="text-sm text-gold-200/60 font-medium mt-1">Here's a summary of what's happening in your organization today.</p>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div whileHover={{ y: -5, scale: 1.02 }} className="group relative bg-[#0a0a0a] border border-[#1a1a1a] hover:border-gold-500/40 p-6 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-gold-200/50 text-xs font-bold uppercase tracking-widest block mb-2 relative z-10">Total Projects</span>
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-4xl font-extrabold text-white tracking-tighter">
                      {statsLoading ? <Loader2 className="w-6 h-6 animate-spin text-gold-500/50" /> : totalProjects}
                    </span>
                    <div className="w-12 h-12 bg-gold-500/10 text-gold-400 rounded-xl flex items-center justify-center border border-gold-500/20 group-hover:bg-gold-500/20 transition-colors shadow-inner">
                      <FolderGit2 className="w-6 h-6" />
                    </div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -5, scale: 1.02 }} className="group relative bg-[#0a0a0a] border border-[#1a1a1a] hover:border-gold-500/40 p-6 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-gold-200/50 text-xs font-bold uppercase tracking-widest block mb-2 relative z-10">Total Documents</span>
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-4xl font-extrabold text-white tracking-tighter">
                      {statsLoading ? <Loader2 className="w-6 h-6 animate-spin text-gold-500/50" /> : totalDocuments}
                    </span>
                    <div className="w-12 h-12 bg-gold-500/10 text-gold-400 rounded-xl flex items-center justify-center border border-gold-500/20 group-hover:bg-gold-500/20 transition-colors shadow-inner">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -5, scale: 1.02 }} className="group relative bg-[#0a0a0a] border border-[#1a1a1a] hover:border-gold-500/40 p-6 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-gold-200/50 text-xs font-bold uppercase tracking-widest block mb-2 relative z-10">Total Folders</span>
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-4xl font-extrabold text-white tracking-tighter">
                      {statsLoading ? <Loader2 className="w-6 h-6 animate-spin text-gold-500/50" /> : totalFolders}
                    </span>
                    <div className="w-12 h-12 bg-gold-500/10 text-gold-400 rounded-xl flex items-center justify-center border border-gold-500/20 group-hover:bg-gold-500/20 transition-colors shadow-inner">
                      <Folder className="w-6 h-6" />
                    </div>
                  </div>
                </motion.div>

                <motion.div whileHover={{ y: -5, scale: 1.02 }} className="group relative bg-[#0a0a0a] border border-[#1a1a1a] hover:border-gold-500/40 p-6 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-gold-200/50 text-xs font-bold uppercase tracking-widest block mb-2 relative z-10">Storage Usage</span>
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-4xl font-extrabold text-white tracking-tighter">45%</span>
                    <div className="w-12 h-12 bg-gold-500/10 text-gold-400 rounded-xl flex items-center justify-center border border-gold-500/20 group-hover:bg-gold-500/20 transition-colors shadow-inner">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Activity vs Insights columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity log summary */}
                <div className="lg:col-span-2 bg-white border border-gray-150 p-6 rounded-xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span>Recent Activities</span>
                    </h2>
                    <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => setActiveTab("audit")}>View All</span>
                  </div>
                  <div className="space-y-4">
                    {apiLogs.map((log) => (
                      <div key={log.id} className="flex justify-between items-start hover:bg-gray-50/50 p-2.5 rounded-lg transition-colors duration-150">
                        <div className="flex gap-3">
                          <span className="w-2 h-2 mt-2 rounded-full bg-blue-500"></span>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{log.user} performed: {log.action}</p>
                            <p className="text-xs text-gray-400 font-medium">Resource: {log.resource} • {log.time}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono bg-slate-50 text-slate-400 px-2 py-0.5 rounded border border-slate-100 flex items-center gap-1 shadow-2xs">
                          <Lock className="w-2.5 h-2.5 text-slate-400" />
                          {log.hash}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Suggestions widget */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-950 p-6 rounded-xl shadow-lg flex flex-col justify-between text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <MessageSquareCode className="w-40 h-40" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/25 flex items-center justify-center border border-indigo-400/20">
                        <ShieldAlert className="w-4 h-4 text-indigo-300" />
                      </div>
                      <h2 className="text-base font-bold text-indigo-100">AI Permission Audit</h2>
                    </div>
                    <p className="text-sm text-indigo-200/90 leading-relaxed font-medium mb-4">
                      "User <strong>John Doe</strong> has manager-level access to Financial documents, but has not accessed them in over <strong>90 days</strong>."
                    </p>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-indigo-950/20">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition duration-200 shadow-md">
                      Review Access Permissions
                    </button>
                    <button className="w-full bg-slate-800/80 hover:bg-slate-700/80 text-indigo-200 font-semibold py-2 px-4 rounded-lg text-xs transition duration-200">
                      Ignore Recommendation
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: PROJECTS */}
          {activeTab === "projects" && (
            <div className="animate-fade-in">
              <ProjectManager 
                organizationId={organizationId} 
                isOpenModal={isOpenCreateProject} 
                setIsOpenModal={setIsOpenCreateProject} 
              />
            </div>
          )}

          {/* TAB: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h1 className="text-xl font-bold text-gray-800">Document Management</h1>
                <p className="text-sm text-gray-500">Securely upload, organize, and inspect your organization documents.</p>
              </div>
              <DocumentManager organizationId={organizationId} />
            </div>
          )}

          {/* TAB: SEARCH */}
          {activeTab === "search" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-xl font-bold text-gray-800">Enterprise Search</h1>
                <p className="text-sm text-gray-500 font-medium">Keyword and filter queries to search across organization files.</p>
              </div>

              {/* Filter controls */}
              <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-2xs flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search documents or folders..."
                    className="w-full bg-gray-50 border border-gray-250 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                  <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                  <span>Filters:</span>
                </div>

                <select
                  value={searchFilterDept}
                  onChange={(e) => setSearchFilterDept(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none font-medium text-gray-700"
                >
                  <option value="">All Departments</option>
                  {mockDepts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                <select
                  value={searchFilterAccess}
                  onChange={(e) => setSearchFilterAccess(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none font-medium text-gray-700"
                >
                  <option value="">All Access Levels</option>
                  <option value="public">Public</option>
                  <option value="internal">Internal</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>

              {/* Results display */}
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                  <p className="text-xs text-gray-500 font-medium">Searching workspace...</p>
                </div>
              ) : searchResults.folders.length === 0 && searchResults.documents.length === 0 ? (
                <div className="bg-white border border-gray-150 p-12 rounded-xl text-center shadow-2xs">
                  <p className="text-sm font-semibold text-gray-500">No matching documents or folders found.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Matching Folders */}
                  {searchResults.folders.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Matching Folders ({searchResults.folders.length})</h3>
                      <div className="bg-white border border-gray-150 rounded-xl divide-y divide-gray-100 overflow-hidden shadow-2xs">
                        {searchResults.folders.map(f => (
                          <div 
                            key={f.id} 
                            onClick={() => {
                              setActiveTab("documents");
                            }}
                            className="p-3.5 flex items-center gap-3 hover:bg-slate-50/50 cursor-pointer"
                          >
                            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                              <Folder className="w-4.5 h-4.5 fill-current" />
                            </div>
                            <span className="text-sm font-bold text-gray-800">{f.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Documents */}
                  {searchResults.documents.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Matching Documents ({searchResults.documents.length})</h3>
                      <div className="bg-white border border-gray-150 rounded-xl divide-y divide-gray-100 overflow-hidden shadow-2xs">
                        {searchResults.documents.map(doc => {
                          const extension = doc.filename.split('.').pop()?.toUpperCase() || "DOC";
                          return (
                            <div 
                              key={doc.id} 
                              onClick={() => {
                                setActiveTab("documents");
                              }}
                              className="p-3.5 flex justify-between items-center hover:bg-slate-50/50 cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-[10px]">
                                  {extension}
                                </div>
                                <div>
                                  <span className="text-sm font-bold text-gray-800 block">{doc.filename}</span>
                                  <span className="text-[10px] text-gray-400 font-medium">
                                    {(doc.size_bytes / 1024).toFixed(1)} KB • {doc.access_level.toUpperCase()} • Dept: {doc.department_id || "None"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {doc.tags && doc.tags.split(",").map((t: string, idx: number) => (
                                  <span key={idx} className="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5 rounded border border-slate-200 font-semibold">
                                    {t.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: AI ASSISTANT */}
          {activeTab === "ai" && (
            <div className="animate-fade-in h-[calc(100vh-180px)] flex flex-col bg-white border border-gray-150 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/25 flex items-center justify-center border border-indigo-400/20 text-indigo-300">
                    <MessageSquareCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Enterprise AI Gateway</h3>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Stateless / Stateful BYOK Active
                    </span>
                  </div>
                </div>

                {/* Gateway config bar */}
                <div className="flex flex-wrap items-center gap-3">
                  <select 
                    value={chatProvider}
                    onChange={(e) => setChatProvider(e.target.value)}
                    className="bg-slate-800 text-white border border-slate-700 text-xs font-semibold rounded-lg p-2 focus:outline-none"
                  >
                    {providersMetadata.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>

                  <select 
                    value={chatModel}
                    onChange={(e) => setChatModel(e.target.value)}
                    className="bg-slate-800 text-white border border-slate-700 text-xs font-semibold rounded-lg p-2 focus:outline-none"
                  >
                    {providersMetadata.find(p => p.id === chatProvider)?.models.map((m: string) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white">
                    <input 
                      type="checkbox"
                      id="statelessToggle"
                      checked={isStatelessMode}
                      onChange={(e) => setIsStatelessMode(e.target.checked)}
                      className="rounded accent-blue-500 focus:ring-0"
                    />
                    <label htmlFor="statelessToggle" className="cursor-pointer font-semibold">Custom Key</label>
                  </div>

                  {isStatelessMode && (
                    <input 
                      type="password"
                      placeholder="Bearer API Key..."
                      value={statelessKey}
                      onChange={(e) => setStatelessKey(e.target.value)}
                      className="bg-slate-800 text-white border border-slate-700 text-xs rounded-lg p-2 placeholder-slate-500 focus:outline-none w-32"
                    />
                  )}
                </div>
              </div>

              {/* Chat messages layout */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                {chatMessages.map((msg, index) => {
                  const isAI = msg.role === "ai";
                  return (
                    <div key={index} className={`flex gap-3 ${isAI ? "max-w-xl" : "max-w-xl ml-auto justify-end"}`}>
                      {isAI && (
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">AI</div>
                      )}
                      <div className={`p-4 rounded-xl text-sm leading-relaxed shadow-xs ${
                        isAI 
                          ? "bg-white border border-gray-150 text-gray-800" 
                          : "bg-blue-600 text-white"
                      }`}>
                        <p>{msg.content}</p>
                        
                        {isAI && msg.provider !== "system" && msg.provider !== "error" && (
                          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center gap-3 text-[10px] text-gray-400 font-semibold">
                            <span className="bg-slate-100 px-2 py-0.5 rounded uppercase">{msg.provider}</span>
                            <span>Model: {msg.model}</span>
                            {msg.latency && <span>{msg.latency} ms</span>}
                            {msg.tokens && <span>{msg.tokens} tokens</span>}
                          </div>
                        )}
                      </div>
                      {!isAI && (
                        <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">U</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Input section */}
              <div className="p-4 bg-white border-t border-gray-100 flex gap-3 items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                  disabled={isChatSending}
                  placeholder="Ask a question about your enterprise documents..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200"
                />
                <button 
                  onClick={handleSendChatMessage}
                  disabled={isChatSending}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  {isChatSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB: AUDIT LOGS */}
          {activeTab === "audit" && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h1 className="text-xl font-bold text-gray-800">Immutable Audit Logs</h1>
                <p className="text-sm text-gray-500">Tamper-evident record of organizational transactions and changes.</p>
              </div>
              <div className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-sm">
                <table className="min-w-full divide-y divide-gray-100 text-left">
                  <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Resource</th>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4 text-right">Blockchain Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                    {apiLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                        <td className="px-6 py-4 font-semibold text-gray-900">{log.user}</td>
                        <td className="px-6 py-4">{log.action}</td>
                        <td className="px-6 py-4 text-gray-500 font-medium">{log.resource}</td>
                        <td className="px-6 py-4 text-gray-400 font-semibold">{log.time}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-mono text-xs bg-slate-50 text-slate-400 px-2.5 py-1 rounded border border-slate-100 inline-flex items-center gap-1 shadow-2xs">
                            <Lock className="w-3 h-3 text-slate-400" />
                            {log.hash}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS (PRO / AI GATEWAY CONFIG) */}
          {activeTab === "settings" && (
            <div className="animate-fade-in space-y-8">
              <div>
                <h1 className="text-xl font-bold text-gray-800">AI Gateway Settings</h1>
                <p className="text-sm text-gray-500 font-medium">Configure credentials and defaults for your Bring Your Own Key (BYOK) providers.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration form card */}
                <div className="lg:col-span-2 bg-white border border-gray-150 p-6 rounded-xl shadow-sm space-y-6">
                  <h2 className="text-base font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Key className="w-5 h-5 text-blue-600" />
                    <span>Provider Credentials Manager</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Provider</label>
                      <select
                        value={settingsProvider}
                        onChange={(e) => setSettingsProvider(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 font-medium focus:outline-none"
                      >
                        {providersMetadata.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Default Model</label>
                      <select
                        value={settingsModel}
                        onChange={(e) => setSettingsModel(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 font-medium focus:outline-none"
                      >
                        {providersMetadata.find(p => p.id === settingsProvider)?.models.map((m: string) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">API Token / Secret Key</label>
                      <input
                        type="password"
                        placeholder="Enter API key"
                        value={settingsSecretKey}
                        onChange={(e) => setSettingsSecretKey(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Custom Base URL (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. https://api.groq.com/openai/v1"
                        value={settingsBaseUrl}
                        onChange={(e) => setSettingsBaseUrl(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Temperature: {settingsTemp}</label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={settingsTemp}
                        onChange={(e) => setSettingsTemp(parseFloat(e.target.value))}
                        className="w-full accent-blue-600 mt-2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Max Output Tokens: {settingsMaxTokens}</label>
                      <input
                        type="number"
                        value={settingsMaxTokens}
                        onChange={(e) => setSettingsMaxTokens(parseInt(e.target.value) || 2048)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 justify-end">
                    <button
                      onClick={handleTestConnection}
                      disabled={isTestingConnection || !settingsSecretKey}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-lg text-xs flex items-center gap-2 transition duration-200 active:scale-95 disabled:opacity-50"
                    >
                      {isTestingConnection ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                      <span>Test Connection</span>
                    </button>

                    <button
                      onClick={handleSaveCredentials}
                      disabled={isSavingCreds || !settingsSecretKey}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg text-xs flex items-center gap-2 shadow-sm transition duration-200 active:scale-95 disabled:opacity-50"
                    >
                      {isSavingCreds ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>Save Configuration</span>
                    </button>
                  </div>

                  {/* Connection check alert */}
                  {testResponse && (
                    <div className={`p-4 rounded-lg border text-xs font-medium ${
                      testResponse.status === "success" 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}>
                      <p className="font-bold mb-1">Result: {testResponse.status.toUpperCase()}</p>
                      <p>{testResponse.message}</p>
                      {testResponse.latency_ms && <p className="mt-1">Latency: {testResponse.latency_ms} ms</p>}
                    </div>
                  )}
                </div>

                {/* Info side pane */}
                <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white border border-indigo-950 p-6 rounded-xl shadow-lg space-y-6">
                  <h2 className="text-base font-bold text-indigo-100 flex items-center gap-2 border-b border-indigo-900/40 pb-3">
                    <Database className="w-5 h-5 text-indigo-400" />
                    <span>Configured Gateway Providers</span>
                  </h2>

                  <div className="space-y-4">
                    {isMetadataLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto" />
                    ) : orgCredentials.length === 0 ? (
                      <p className="text-xs text-indigo-300/80 leading-relaxed font-medium">
                        No stateful database configurations configured yet. All chat completions will run on stateless header mode or fallback to default settings.
                      </p>
                    ) : (
                      orgCredentials.map(cred => (
                        <div key={cred.id} className="bg-slate-950/40 border border-slate-900/60 p-3 rounded-lg flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-white block uppercase tracking-wider">{cred.provider}</span>
                            <span className="text-[10px] text-slate-400">Default Model: {cred.model}</span>
                          </div>
                          <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                            Configured
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-4 border-t border-indigo-900/40 space-y-3">
                    <div className="flex gap-2.5 text-xs text-indigo-200 leading-relaxed">
                      <Info className="w-4 h-4 shrink-0 text-indigo-400" />
                      <span>Saved credentials are encrypted at rest using symmetric key cryptography and are never leaked to the client interface.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback placeholers for unfinished tabs */}
          {["members", "departments", "analytics", "notifications"].includes(activeTab) && (
            <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm animate-fade-in">
              <h2 className="text-lg font-bold text-gray-800 capitalize mb-2">{activeTab} Section</h2>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                This feature is planned for a later phase of the Roadmap and is under active construction.
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
