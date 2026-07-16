"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Folder, 
  File, 
  Plus, 
  ChevronRight, 
  FolderPlus, 
  Trash2, 
  Download, 
  Info, 
  History, 
  Share2, 
  Check, 
  Edit3, 
  X, 
  Upload, 
  Globe, 
  Lock, 
  Users2,
  Loader2
} from "lucide-react";

interface DBFolder {
  id: string;
  name: string;
  parent_id: string | null;
  organization_id: string;
}

interface DBDocument {
  id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  folder_id: string | null;
  owner_id: string;
  organization_id: string;
  project_id: string | null;
  department_id: string | null;
  access_level: string;
  tags: string | null;
  storage_key: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
}

interface Version {
  id: string;
  document_id: string;
  version_number: number;
  storage_key: string;
  size_bytes: number;
  created_at: string;
  created_by_id: string;
}

export default function DocumentManager({ organizationId }: { organizationId: string }) {
  const { getToken } = useAuth();
  
  // Navigation & Data States
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<DBFolder[]>([]);
  const [folders, setFolders] = useState<DBFolder[]>([]);
  const [documents, setDocuments] = useState<DBDocument[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected file details sidebar panel
  const [selectedDoc, setSelectedDoc] = useState<DBDocument | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [activeDetailsTab, setActiveDetailsTab] = useState<"metadata" | "versions" | "share">("metadata");
  const [isUpdatingMeta, setIsUpdatingMeta] = useState(false);

  // Forms
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [uploadProject, setUploadProject] = useState("");
  const [uploadDept, setUploadDept] = useState("Marketing");
  const [uploadAccess, setUploadAccess] = useState("internal");
  const [uploadTags, setUploadTags] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingVersion, setIsUploadingVersion] = useState(false);

  // Sharing form
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState("read");
  const [shareSuccess, setShareSuccess] = useState(false);

  // Metadata Edit States (for details panel)
  const [editFilename, setEditFilename] = useState("");
  const [editProject, setEditProject] = useState("");
  const [editDept, setEditDept] = useState("");
  const [editAccess, setEditAccess] = useState("");
  const [editTags, setEditTags] = useState("");

  const mockDepts = ["Marketing", "HR", "Finance", "Engineering", "Operations", "Legal"];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      
      // Fetch Folders
      const foldersRes = await fetch(`/api/v1/documents/folders/${organizationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (foldersRes.ok) {
        const data = await foldersRes.json();
        setFolders(data);
      }

      // Fetch Documents
      const docsRes = await fetch(`/api/v1/documents/org/${organizationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (docsRes.ok) {
        const data = await docsRes.json();
        setDocuments(data);
      }

      // Fetch Projects
      const projectsRes = await fetch(`/api/v1/projects/org/${organizationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (projectsRes.ok) {
        const body = await projectsRes.json();
        if (body.success) setProjects(body.data);
      }
    } catch (err) {
      console.error("Failed to load documents manager data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setCurrentFolderId(null);
    setFolderPath([]);
    setSelectedDoc(null);
  }, [organizationId]);

  // Fetch versions when selected document changes
  useEffect(() => {
    const fetchVersions = async () => {
      if (!selectedDoc) return;
      try {
        const token = await getToken();
        const res = await fetch(`/api/v1/documents/${selectedDoc.id}/versions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setVersions(data);
        }
      } catch (err) {
        console.error("Failed to fetch versions", err);
      }
    };

    if (selectedDoc) {
      fetchVersions();
      // Pre-populate edit fields
      setEditFilename(selectedDoc.filename);
      setEditProject(selectedDoc.project_id || "");
      setEditDept(selectedDoc.department_id || "");
      setEditAccess(selectedDoc.access_level);
      setEditTags(selectedDoc.tags || "");
    }
  }, [selectedDoc]);

  // Folder Actions
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const token = await getToken();
      const res = await fetch("/api/v1/documents/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newFolderName,
          parent_id: currentFolderId,
          organization_id: organizationId
        })
      });
      if (res.ok) {
        setNewFolderName("");
        setShowFolderForm(false);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to create folder", err);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Are you sure you want to delete this folder and all its contents?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`/api/v1/documents/folders/${folderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        if (currentFolderId === folderId) {
          handleNavigateUp();
        }
        fetchData();
      }
    } catch (err) {
      console.error("Failed to delete folder", err);
    }
  };

  // Document Upload with Metadata
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("organization_id", organizationId);
    if (currentFolderId) formData.append("folder_id", currentFolderId);
    if (uploadProject) formData.append("project_id", uploadProject);
    if (uploadDept) formData.append("department_id", uploadDept);
    formData.append("access_level", uploadAccess);
    if (uploadTags) formData.append("tags", uploadTags);

    try {
      const token = await getToken();
      const res = await fetch("/api/v1/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
      if (res.ok) {
        setUploadTags("");
        fetchData();
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Reset
    }
  };

  // Upload New Version
  const handleVersionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedDoc || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploadingVersion(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = await getToken();
      const res = await fetch(`/api/v1/documents/${selectedDoc.id}/version`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedDoc(updated);
        fetchData();
      }
    } catch (err) {
      console.error("New version upload failed", err);
    } finally {
      setIsUploadingVersion(false);
      e.target.value = "";
    }
  };

  // Restore previous version
  const handleRestoreVersion = async (versionId: string) => {
    if (!selectedDoc) return;
    try {
      const token = await getToken();
      const res = await fetch(`/api/v1/documents/${selectedDoc.id}/versions/${versionId}/restore`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedDoc(updated);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to restore version", err);
    }
  };

  // Update Metadata
  const handleUpdateMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;

    setIsUpdatingMeta(true);
    try {
      const token = await getToken();
      const res = await fetch(`/api/v1/documents/${selectedDoc.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          filename: editFilename,
          project_id: editProject || null,
          department_id: editDept || null,
          access_level: editAccess,
          tags: editTags || null
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedDoc(updated);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to update metadata", err);
    } finally {
      setIsUpdatingMeta(false);
    }
  };

  // Document Sharing
  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !shareEmail.trim()) return;

    try {
      const token = await getToken();
      const res = await fetch(`/api/v1/documents/${selectedDoc.id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: shareEmail, // For simplicity in MVP, we save email as the user_id holder
          role: shareRole
        })
      });
      if (res.ok) {
        setShareEmail("");
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to share document", err);
    }
  };

  // Delete Document
  const handleDeleteDoc = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`/api/v1/documents/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSelectedDoc(null);
        fetchData();
      }
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  // Navigation Logic
  const handleFolderClick = (folder: DBFolder) => {
    setCurrentFolderId(folder.id);
    setFolderPath((prev) => [...prev, folder]);
  };

  const handleBreadcrumbClick = (folderId: string | null, index: number) => {
    setCurrentFolderId(folderId);
    if (folderId === null) {
      setFolderPath([]);
    } else {
      setFolderPath((prev) => prev.slice(0, index + 1));
    }
  };

  const handleNavigateUp = () => {
    if (folderPath.length === 0) return;
    const nextPath = [...folderPath];
    nextPath.pop();
    setFolderPath(nextPath);
    setCurrentFolderId(nextPath.length > 0 ? nextPath[nextPath.length - 1].id : null);
  };

  // Filter content based on current folder
  const currentFolders = folders.filter(f => f.parent_id === currentFolderId);
  const currentDocs = documents.filter(d => d.folder_id === currentFolderId);

  return (
    <div className="flex gap-6 relative items-start">
      {/* File Browser Area */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-150 space-y-6">
        
        {/* Top Control Bar */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium overflow-x-auto py-1">
            <button 
              onClick={() => handleBreadcrumbClick(null, -1)}
              className="hover:text-blue-600 transition-colors"
            >
              Root
            </button>
            {folderPath.map((folder, index) => (
              <div key={folder.id} className="flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                <button
                  onClick={() => handleBreadcrumbClick(folder.id, index)}
                  className="hover:text-blue-600 transition-colors max-w-[120px] truncate"
                >
                  {folder.name}
                </button>
              </div>
            ))}
          </div>

          {/* Quick Folder & Upload Controls */}
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowFolderForm(!showFolderForm)}
              className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all duration-200"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Add Folder</span>
            </button>
            
            <label className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition flex items-center gap-1.5 ${isUploading ? 'opacity-50' : ''}`}>
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
            </label>
          </div>
        </div>

        {/* Upload Settings Drawer (shown next to upload option) */}
        <div className="bg-slate-50 rounded-xl p-4 border border-gray-150 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-medium text-gray-600">
          <div>
            <label className="block text-gray-500 mb-1 font-bold">PROJECT</label>
            <select 
              value={uploadProject} 
              onChange={e => setUploadProject(e.target.value)}
              className="bg-white border border-gray-200 rounded p-1.5 w-full focus:outline-none"
            >
              <option value="">No Project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-500 mb-1 font-bold">DEPARTMENT</label>
            <select 
              value={uploadDept} 
              onChange={e => setUploadDept(e.target.value)}
              className="bg-white border border-gray-200 rounded p-1.5 w-full focus:outline-none"
            >
              {mockDepts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-500 mb-1 font-bold">ACCESS LEVEL</label>
            <select 
              value={uploadAccess} 
              onChange={e => setUploadAccess(e.target.value)}
              className="bg-white border border-gray-200 rounded p-1.5 w-full focus:outline-none"
            >
              <option value="public">Public</option>
              <option value="internal">Internal</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-500 mb-1 font-bold">TAGS (COMMA SEPARATED)</label>
            <input 
              type="text" 
              value={uploadTags} 
              onChange={e => setUploadTags(e.target.value)}
              placeholder="e.g. hr, contract, draft"
              className="bg-white border border-gray-200 rounded p-1.5 w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Add Folder Inline Form */}
        {showFolderForm && (
          <form onSubmit={handleCreateFolder} className="flex gap-2 items-center animate-slide-down">
            <input
              type="text"
              required
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-lg text-xs font-semibold">
              Create
            </button>
            <button type="button" onClick={() => setShowFolderForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Grid List View */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
            <p className="text-xs text-gray-500 font-medium">Loading items...</p>
          </div>
        ) : currentFolders.length === 0 && currentDocs.length === 0 ? (
          <div className="text-center py-16 bg-slate-50/50 border border-dashed border-gray-200 rounded-xl">
            <Folder className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-semibold">This folder is empty</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 border border-gray-150 rounded-xl overflow-hidden shadow-2xs">
            {/* List Folders first */}
            {currentFolders.map((folder) => (
              <div 
                key={folder.id} 
                className="p-3.5 flex justify-between items-center hover:bg-slate-50/60 group cursor-pointer"
                onClick={() => handleFolderClick(folder)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{folder.name}</p>
                    <span className="text-[10px] text-gray-400 font-medium">Directory Folder</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder.id);
                  }}
                  className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50/50 transition duration-150 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* List Documents second */}
            {currentDocs.map((doc) => {
              const extension = doc.filename.split('.').pop()?.toUpperCase() || "DOC";
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div 
                  key={doc.id} 
                  className={`p-3.5 flex justify-between items-center hover:bg-slate-50/60 cursor-pointer ${
                    isSelected ? 'bg-blue-50/40 border-l-2 border-blue-600' : ''
                  }`}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                      {extension}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{doc.filename}</p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {(doc.size_bytes / 1024).toFixed(1)} KB • {doc.access_level.toUpperCase()} • {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    {/* Badge tags */}
                    {doc.tags && (
                      <div className="flex gap-1">
                        {doc.tags.split(",").slice(0, 2).map((tag, i) => (
                          <span key={i} className="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5 rounded font-semibold border border-slate-200">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <a
                      href={`/api/v1/documents/${doc.id}/download`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-gray-400 hover:text-blue-600 p-2 rounded hover:bg-blue-50/50 transition duration-150"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected File Details Slide-over Panel */}
      {selectedDoc && (
        <aside className="w-80 bg-white border border-gray-150 rounded-xl p-5 shadow-sm space-y-6 animate-slide-left sticky top-24 shrink-0">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>File Inspector</span>
            </h3>
            <button onClick={() => setSelectedDoc(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details view Tab navigation */}
          <div className="flex border-b border-gray-100 text-xs font-semibold text-gray-500">
            <button 
              onClick={() => setActiveDetailsTab("metadata")}
              className={`flex-1 pb-2 flex justify-center items-center gap-1 ${activeDetailsTab === "metadata" ? "border-b-2 border-blue-600 text-blue-600" : "hover:text-gray-700"}`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
            <button 
              onClick={() => setActiveDetailsTab("versions")}
              className={`flex-1 pb-2 flex justify-center items-center gap-1 ${activeDetailsTab === "versions" ? "border-b-2 border-blue-600 text-blue-600" : "hover:text-gray-700"}`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History ({versions.length})</span>
            </button>
            <button 
              onClick={() => setActiveDetailsTab("share")}
              className={`flex-1 pb-2 flex justify-center items-center gap-1 ${activeDetailsTab === "share" ? "border-b-2 border-blue-600 text-blue-600" : "hover:text-gray-700"}`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Sharing</span>
            </button>
          </div>

          {/* VIEW: METADATA FORM */}
          {activeDetailsTab === "metadata" && (
            <form onSubmit={handleUpdateMetadata} className="space-y-4 text-xs font-medium text-gray-600">
              <div>
                <label className="block text-gray-500 mb-1">FILE NAME</label>
                <input 
                  type="text" 
                  value={editFilename} 
                  onChange={e => setEditFilename(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded p-2 w-full focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-800"
                />
              </div>

              <div>
                <label className="block text-gray-500 mb-1">PROJECT</label>
                <select 
                  value={editProject} 
                  onChange={e => setEditProject(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded p-2 w-full focus:outline-none text-gray-800"
                >
                  <option value="">No Project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">DEPARTMENT</label>
                <select 
                  value={editDept} 
                  onChange={e => setEditDept(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded p-2 w-full focus:outline-none text-gray-800"
                >
                  {mockDepts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">ACCESS LEVEL</label>
                <select 
                  value={editAccess} 
                  onChange={e => setEditAccess(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded p-2 w-full focus:outline-none text-gray-800"
                >
                  <option value="public">Public</option>
                  <option value="internal">Internal</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">TAGS (COMMA SEPARATED)</label>
                <input 
                  type="text" 
                  value={editTags} 
                  onChange={e => setEditTags(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded p-2 w-full focus:outline-none text-gray-800"
                />
              </div>

              <div className="flex gap-2 justify-between pt-4">
                <button
                  type="button"
                  onClick={() => handleDeleteDoc(selectedDoc.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-2 rounded-lg border border-red-100 transition duration-150 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingMeta}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50 transition duration-150"
                >
                  {isUpdatingMeta ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Info</span>
                </button>
              </div>
            </form>
          )}

          {/* VIEW: VERSIONING HISTORY */}
          {activeDetailsTab === "versions" && (
            <div className="space-y-4">
              {/* Upload new version file button */}
              <div>
                <label className={`cursor-pointer w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${isUploadingVersion ? 'opacity-50' : ''}`}>
                  {isUploadingVersion ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isUploadingVersion ? 'Uploading...' : 'Upload New Version'}</span>
                  <input type="file" className="hidden" onChange={handleVersionUpload} disabled={isUploadingVersion} />
                </label>
              </div>

              {/* Version History List */}
              <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-thin">
                {versions.map((ver) => (
                  <div key={ver.id} className="p-3 bg-slate-50 border border-gray-150 rounded-lg text-xs flex flex-col gap-1 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-center font-bold text-gray-800">
                      <span>Version {ver.version_number}</span>
                      {selectedDoc.storage_key === ver.storage_key && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">Active</span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">Size: {(ver.size_bytes / 1024).toFixed(1)} KB</span>
                    <span className="text-[10px] text-gray-400">Uploaded: {new Date(ver.created_at).toLocaleString()}</span>
                    
                    {selectedDoc.storage_key !== ver.storage_key && (
                      <button
                        onClick={() => handleRestoreVersion(ver.id)}
                        className="text-blue-600 hover:underline font-bold self-start mt-2 text-[10px] flex items-center gap-0.5"
                      >
                        Restore Version
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: SHARING CONTROLS */}
          {activeDetailsTab === "share" && (
            <div className="space-y-4 text-xs font-medium text-gray-600">
              <div className="bg-slate-50 border border-gray-150 rounded-lg p-3 text-[11px] text-slate-500 leading-relaxed flex gap-2">
                <Globe className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Sharing grants specific permissions to team members. Shared links require Clerk validation to download.</span>
              </div>

              <form onSubmit={handleShare} className="space-y-3">
                <div>
                  <label className="block text-gray-500 mb-1">TEAM MEMBER EMAIL</label>
                  <input
                    type="email"
                    required
                    value={shareEmail}
                    onChange={e => setShareEmail(e.target.value)}
                    placeholder="e.g. rahul@clerk.dev"
                    className="bg-gray-50 border border-gray-200 rounded p-2.5 w-full focus:ring-1 focus:ring-blue-500 focus:outline-none text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 mb-1">PERMISSION ROLE</label>
                  <select
                    value={shareRole}
                    onChange={e => setShareRole(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded p-2.5 w-full focus:outline-none text-gray-800"
                  >
                    <option value="read">Read Only</option>
                    <option value="write">Read & Write</option>
                  </select>
                </div>

                {shareSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded text-emerald-700 p-2 text-center text-[10px] font-semibold animate-fade-in">
                    Document shared successfully!
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm shadow-blue-600/25 transition duration-200"
                >
                  Share Document
                </button>
              </form>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
