"use client";

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
      const res = await fetch(`http://127.0.0.1:8000/api/v1/projects/org/${organizationId}`, {
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
      const res = await fetch("http://127.0.0.1:8000/api/v1/projects", {
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
          <h2 className="text-xl font-bold text-gray-800">Projects</h2>
          <p className="text-sm text-gray-500">Manage and track work in your organization.</p>
        </div>
        <button
          onClick={() => setIsOpenModal(true)}
          className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-sm shadow-blue-600/25 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-sm text-gray-500 font-medium">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center text-sm text-red-600">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">No Projects Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            Get started by creating your first workspace project to organize documents and workflows.
          </p>
          <button
            onClick={() => setIsOpenModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white border border-gray-150 rounded-xl p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-350">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                    project.status === "active" 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {project.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-1 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                  {project.description || "No description provided."}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-blue-600 bg-blue-50/55 px-2 py-0.5 rounded">
                  Workspace Project
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal (Slide/Overlay) */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-100 m-4 relative animate-scale-up">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Create New Project</h3>
            <p className="text-sm text-gray-500 mb-6">Group your documents, tasks, and team discussions.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q3 Marketing Plan"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the scope and objective..."
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 border border-gray-250 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm shadow-blue-600/25 transition-all duration-200 disabled:opacity-50"
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
