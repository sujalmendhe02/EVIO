import React from 'react';
import { Trash2 } from 'lucide-react';
import MediaGallery from './MediaGallery';

function AchievementCard({ achievement, onDelete, onImageClick }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{achievement.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(achievement.date).toLocaleDateString()}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(achievement._id)}
            className="text-red-500 hover:text-red-700 ml-4"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
      {achievement.media && (
        <MediaGallery 
          media={[achievement.media]} 
          onImageClick={onImageClick}
        />
      )}
    </div>
  );
}

export default AchievementCard;