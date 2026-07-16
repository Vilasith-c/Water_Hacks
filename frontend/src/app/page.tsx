"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
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
  Send
} from "lucide-react";

export default function Home() {
  const { userId, isLoaded, getToken } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orgName, setOrgName] = useState("Enterprise Workspace");
  const [organizationId, setOrganizationId] = useState("org_default_test_id");
  const [isOpenCreateProject, setIsOpenCreateProject] = useState(false);
  const [apiLogs, setApiLogs] = useState<any[]>([]);

  // Sync user profile upon load
  useEffect(() => {
    const syncUserProfile = async () => {
      if (!userId) return;
      try {
        const token = await getToken();
        await fetch("http://localhost:8000/api/v1/users/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error("Failed to sync user profile", err);
      }
    };
    syncUserProfile();
  }, [userId]);

  // Mock initial logs for audit trail in Phase 1
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
          setOrganizationId={setOrganizationId}
          onOpenCreateProject={() => setIsOpenCreateProject(true)} 
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
                    <span className="text-3xl font-extrabold text-gray-800">3</span>
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-150 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Recent Documents</span>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-extrabold text-gray-800">14</span>
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-150 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Pending Approvals</span>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-extrabold text-amber-600">3</span>
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
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
