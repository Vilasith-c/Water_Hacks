"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
  Landmark,
  SlidersHorizontal
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

  // Sync user profile and load stats
  const fetchDashboardStats = async () => {
    if (!userId || !organizationId) return;
    setStatsLoading(true);
    try {
      const token = await getToken();
      
      // Sync profile
      await fetch("http://localhost:8000/api/v1/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Get projects count
      const projRes = await fetch(`http://localhost:8000/api/v1/projects/org/${organizationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (projRes.ok) {
        const body = await projRes.json();
        if (body.success) setTotalProjects(body.data.length);
      }

      // Get documents count
      const docsRes = await fetch(`http://localhost:8000/api/documents/org/${organizationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (docsRes.ok) {
        const body = await docsRes.json();
        setTotalDocuments(body.length);
      }

      // Get folders count
      const foldersRes = await fetch(`http://localhost:8000/api/documents/folders/${organizationId}`, {
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

  useEffect(() => {
    fetchDashboardStats();
  }, [userId, organizationId]);

  // Hook search execution
  const executeSearch = async () => {
    if (!organizationId) return;
    setIsSearching(true);
    try {
      const token = await getToken();
      let url = `http://localhost:8000/api/v1/search?organization_id=${organizationId}`;
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

  // Trigger search when query or filters change
  useEffect(() => {
    if (activeTab === "search") {
      executeSearch();
    }
  }, [searchQuery, searchFilterDept, searchFilterAccess, activeTab, organizationId]);

  // Mock initial logs for audit trail
  useEffect(() => {
    setApiLogs([
      {
        id: "1",
        user: "John Doe",
        action: "Upload Document",
        resource: "Employee_Handbook.pdf",
        time: "09:21 AM",
        hash: "a4f2bc...de39"
      },
      {
        id: "2",
        user: "Sarah Jenkins",
        action: "Approve Leave Workflow",
        resource: "Leave_Policy_v2.docx",
        time: "09:24 AM",
        hash: "e903bc...48a2"
      },
      {
        id: "3",
        user: "System",
        action: "Permission Audit",
        resource: "Access Rules Engine",
        time: "10:00 AM",
        hash: "ff83a2...de77"
      }
    ]);
  }, []);

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6">
        <div className="text-center p-10 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full backdrop-blur-md">
          <div className="w-16 h-16 bg-blue-600/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Enterprise Collab
          </h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
            Secure, AI-powered collaboration and document intelligence for high-performing teams.
          </p>
          <a 
            href="/sign-in" 
            className="inline-flex items-center justify-center bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-blue-700 transition duration-200 active:scale-95 w-full gap-2"
          >
            <span>Access Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans">
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
            <div className="space-y-8 animate-fade-in">
              {/* Header Greeting */}
              <div>
                <h1 className="text-2xl font-extrabold text-gray-800">Welcome to your Dashboard</h1>
                <p className="text-sm text-gray-500 font-medium">Here's a summary of what's happening in your organization today.</p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-150 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Total Projects</span>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-extrabold text-gray-800">
                      {statsLoading ? <Loader2 className="w-6 h-6 animate-spin text-gray-400" /> : totalProjects}
                    </span>
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-150 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Total Documents</span>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-extrabold text-gray-800">
                      {statsLoading ? <Loader2 className="w-6 h-6 animate-spin text-gray-400" /> : totalDocuments}
                    </span>
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-150 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Total Folders</span>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-extrabold text-gray-800">
                      {statsLoading ? <Loader2 className="w-6 h-6 animate-spin text-gray-400" /> : totalFolders}
                    </span>
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                      <Folder className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-150 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Storage Usage</span>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-extrabold text-gray-800">45%</span>
                    <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                </div>
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
            </div>
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
              <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/25 flex items-center justify-center border border-indigo-400/20 text-indigo-300">
                    <MessageSquareCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Gemini Document AI</h3>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Ready to assist
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat messages layout */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                <div className="flex gap-3 max-w-xl">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">AI</div>
                  <div className="bg-white border border-gray-150 p-4 rounded-xl shadow-sm text-sm text-gray-800 leading-relaxed">
                    Hello! I'm your Gemini AI Document Assistant. You can upload files on the Documents page and ask me to summarize them, explain policies, or run semantic search queries. How can I help you today?
                  </div>
                </div>
              </div>

              {/* Input section */}
              <div className="p-4 bg-white border-t border-gray-100 flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Ask a question about your enterprise documents..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-sm shadow-blue-600/25 transition-all duration-200 active:scale-95">
                  <Send className="w-4 h-4" />
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

          {/* Fallback placeholers for unfinished tabs */}
          {["members", "departments", "settings", "analytics", "notifications"].includes(activeTab) && (
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
