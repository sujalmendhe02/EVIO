import React from 'react';
import { FileText } from 'lucide-react';

function ResumeViewer({ resumeUrl }) {
  if (!resumeUrl) return null;

  return (
    <div className="mt-4">
      <a
        href={`http://localhost:5000${resumeUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
      >
        <FileText className="w-5 h-5 mr-2" />
        View Resume
      </a>
    </div>
  );
}

export default ResumeViewer;