"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function DocumentManager({ organizationId }: { organizationId: string }) {
  const { getToken } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:8000/api/documents/org/${organizationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [organizationId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("organization_id", organizationId);

    try {
      const token = await getToken();
      const res = await fetch("http://localhost:8000/api/documents/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
      if (res.ok) {
        fetchDocuments(); // Refresh the list
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleDownload = (docId: string, filename: string) => {
    window.open(`http://localhost:8000/api/documents/${docId}/download`, "_blank");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
        <div>
          <label className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 ${isUploading ? 'opacity-50' : ''}`}>
            {isUploading ? 'Uploading...' : 'Upload File'}
            <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>
      </div>
      
      {documents.length === 0 ? (
        <p className="text-gray-500 text-sm py-4">No documents uploaded yet.</p>
      ) : (
        <div className="divide-y divide-gray-100 border border-gray-100 rounded">
          {documents.map((doc) => (
            <div key={doc.id} className="p-3 flex justify-between items-center hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-xs font-bold">
                  {doc.filename.split('.').pop()?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{doc.filename}</p>
                  <p className="text-xs text-gray-500">{(doc.size_bytes / 1024).toFixed(1)} KB • {new Date(doc.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDownload(doc.id, doc.filename)}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
