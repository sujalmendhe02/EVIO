import React from 'react';
import { User } from 'lucide-react';

function UserAvatar({ user, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200`}>
      {user?.profilePhoto?.url ? (
        <img
          src={`http://localhost:5000${user.profilePhoto.url}`}
          alt={user.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/128?text=Profile';
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <User className="w-1/2 h-1/2 text-gray-400" />
        </div>
      )}
    </div>
  );
}

export default UserAvatar;