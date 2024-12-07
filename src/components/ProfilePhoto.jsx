import React from 'react';
import { Camera } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function ProfilePhoto({ user, onPhotoUpdate }) {
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      const response = await axios.post('http://localhost:5000/api/profile/photo', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onPhotoUpdate(response.data);
      toast.success('Profile photo updated successfully');
    } catch (error) {
      toast.error('Failed to update profile photo');
    }
  };

  return (
    <div className="relative">
      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
        {user?.profilePhoto?.url ? (
          <img
            src={`http://localhost:5000${user.profilePhoto.url}`}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/128?text=Profile';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No Photo</span>
          </div>
        )}
      </div>
      <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
        <Camera className="w-5 h-5 text-white" />
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handlePhotoChange}
        />
      </label>
    </div>
  );
}

export default ProfilePhoto;