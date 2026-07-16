"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { FolderGit2, Plus, Calendar, CheckCircle2, Archive, Loader2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  organization_id: string;
}

interface ProjectManagerProps {
  organizationId: string;
  isOpenModal: boolean;
  setIsOpenModal: (open: boolean) => void;
}

export default function ProjectManager({ organizationId, isOpenModal, setIsOpenModal }: ProjectManagerProps) {
  const { getToken } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchProjects = async () => {
    if (!organizationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`/api/v1/projects/org/${organizationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const body = await res.json();
        // Since backend standardizes response as StandardResponse: { success: true, data: [...] }
        if (body.success) {
          setProjects(body.data);
        } else {
          setProjects([]);
        }
      } else {
        setError("Failed to fetch projects");
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
      setError("Network error fetching projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [organizationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const token = await getToken();
      const res = await fetch("/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          organization_id: organizationId
        })
      });

      if (res.ok) {
        const body = await res.json();
        if (body.success) {
          setName("");
          setDescription("");
          setIsOpenModal(false);
          fetchProjects(); // refresh list
        }
      }
    } catch (err) {
      console.error("Failed to create project", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Projects Grid Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white">Projects</h2>
          <p className="text-sm text-gray-400 font-medium">Manage and track work in your organization.</p>
        </div>
        <button
          onClick={() => setIsOpenModal(true)}
          className="bg-gradient-to-r from-gold-600 to-gold-500 text-black hover:from-gold-500 hover:to-gold-400 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(205,157,57,0.3)] transition-all duration-300 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin mb-2" />
          <p className="text-sm text-gray-500 font-medium">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center text-sm text-red-600">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-12 text-center shadow-2xl">
          <div className="w-12 h-12 bg-gold-500/10 text-gold-400 rounded-xl border border-gold-500/20 flex items-center justify-center mx-auto mb-4">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Projects Found</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6 leading-relaxed">
            Get started by creating your first workspace project to organize documents and workflows.
          </p>
          <button
            onClick={() => setIsOpenModal(true)}
            className="bg-gradient-to-r from-gold-600 to-gold-500 text-black hover:from-gold-500 hover:to-gold-400 font-bold px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-[0_0_15px_rgba(205,157,57,0.3)]"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-[#0a0a0a] border border-[#1a1a1a] hover:border-gold-500/40 rounded-xl p-5 hover:shadow-[0_0_20px_rgba(205,157,57,0.05)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 bg-gold-500/10 text-gold-400 rounded-lg flex items-center justify-center border border-gold-500/20 group-hover:bg-gold-500/20 transition-all duration-350">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                    project.status === "active" 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {project.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg mb-1 leading-snug group-hover:text-gold-400 transition-colors duration-200">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                  {project.description || "No description provided."}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1a1a1a] flex items-center justify-between text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gold-500/60" />
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gold-400 bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 rounded">
                  Workspace Project
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal (Slide/Overlay) */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#0a0a0a] rounded-xl shadow-2xl max-w-md w-full p-6 border border-[#1a1a1a] m-4 relative animate-scale-up text-white">
            <h3 className="text-lg font-extrabold text-white mb-2">Create New Project</h3>
            <p className="text-sm text-gray-400 mb-6">Group your documents, tasks, and team discussions.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q3 Marketing Plan"
                  className="w-full bg-[#111] border border-[#222] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the scope and objective..."
                  rows={3}
                  className="w-full bg-[#111] border border-[#222] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500 transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 border border-[#222] text-gray-400 hover:text-white text-sm font-semibold rounded-lg hover:bg-[#111] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-gold-600 to-gold-500 text-black hover:from-gold-500 hover:to-gold-400 font-bold text-sm px-5 py-2 rounded-lg flex items-center gap-1.5 shadow-[0_0_15px_rgba(205,157,57,0.3)] transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Project</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
