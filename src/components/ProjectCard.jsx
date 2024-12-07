import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import MediaGallery from './MediaGallery';

function ProjectCard({ project, onDelete, onImageClick }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
            <p className="text-gray-600 mt-2">{project.description}</p>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(project._id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {project.media && project.media.length > 0 && (
          <MediaGallery 
            media={project.media} 
            onImageClick={onImageClick}
          />
        )}
        
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;