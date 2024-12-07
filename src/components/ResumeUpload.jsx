import React from 'react';
import { FileUp, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function ResumeUpload({ user, onResumeUpdate }) {
  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:5000/api/profile/resume', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onResumeUpdate(response.data);
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload resume');
    }
  };

  const handleDeleteResume = async () => {
    try {
      const response = await axios.delete('http://localhost:5000/api/profile/resume', {
        withCredentials: true
      });
      onResumeUpdate(response.data);
      toast.success('Resume deleted successfully');
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Resume</h3>
        {user?.resume?.url && (
          <button
            onClick={handleDeleteResume}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {user?.resume?.url ? (
        <div className="mt-2">
          <a
            href={`http://localhost:5000${user.resume.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            View Resume
          </a>
        </div>
      ) : (
        <div className="mt-2">
          <label className="block">
            <span className="sr-only">Upload Resume</span>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload Resume</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="application/pdf"
                      onChange={handleResumeChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
              </div>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;