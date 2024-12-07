import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MapPin, Mail, Phone, ChevronDown, ChevronUp, Share2, Trophy, GraduationCap, Briefcase, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReviewForm from '../components/ReviewForm';
import UserAvatar from '../components/UserAvatar';
import Modal from '../components/Modal';
import GuestLogin from '../components/GuestLogin';
import ImageViewer from '../components/ImageViewer';

function Home() {
  const [users, setUsers] = useState([]);
  const [expandedUsers, setExpandedUsers] = useState({});
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [showGuestLogin, setShowGuestLogin] = useState(false);
  const [reviewedProfiles, setReviewedProfiles] = useState({});
  const [selectedImages, setSelectedImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile/all', { 
        withCredentials: true 
      });
      // Filter out guest profiles and the current user's profile
      const filteredUsers = response.data.filter(u => !u.isGuest && (!user || u._id !== user._id));
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const toggleUserExpand = (userId) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleReviewSubmit = async (userId, reviewData) => {
    if (!user) {
      setShowGuestLogin(true);
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/profile/${userId}/review`, reviewData, { withCredentials: true });
      toast.success('Review submitted successfully');
      setReviewedProfiles((prev) => ({ ...prev, [userId]: true }));
      fetchUsers();
      setShowReviewForm(null);
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const handleShare = (userId) => {
    const shareUrl = `${window.location.origin}/user/${userId}`;
    if (navigator.share) {
      navigator.share({
        title: 'Check out this profile on EVIO',
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Profile link copied to clipboard!');
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="space-y-6">
      {users.map((profile) => {
        const isExpanded = expandedUsers[profile._id];
        return (
          <div key={profile._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <UserAvatar user={profile} size="lg" />
                  <div>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-blue-100">{profile.age} years old</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleShare(profile._id)}
                    className="text-white hover:text-blue-200"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <div className="flex items-center">
                    <Star className="w-6 h-6 fill-current" />
                    <span className="ml-1 text-xl">{profile.averageRating?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2" />
                  {profile.email}
                </div>
                {profile.contact && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-2" />
                    {profile.contact}
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    {profile.address}
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="mt-6 space-y-6">
                  {profile.education?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                        <GraduationCap className="w-5 h-5 mr-2" />
                        Education
                      </h3>
                      {profile.education.map((edu) => (
                        <div key={edu._id} className="text-gray-600">
                          <p>{edu.marks ? `${edu.marks} at ${edu.institutionName}` : edu.institutionName}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-col items-center gap-4">
                <button
                  onClick={() => toggleUserExpand(profile._id)}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      View Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      View More
                    </>
                  )}
                </button>
                <div className="flex gap-4">
                  {!reviewedProfiles[profile._id] && user?.email !== profile.email && (
                    <button
                      onClick={() => user ? setShowReviewForm(profile._id) : setShowGuestLogin(true)}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Rate Profile
                    </button>
                  )}
                  <button
                    onClick={() => handleViewProfile(profile._id)}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Profile
                  </button>
                </div>
              </div>
            </div>

            {showReviewForm === profile._id && (
              <div className="p-6 border-t border-gray-200">
                <ReviewForm
                  onSubmit={(reviewData) => handleReviewSubmit(profile._id, reviewData)}
                  onCancel={() => setShowReviewForm(null)}
                />
              </div>
            )}
          </div>
        );
      })}

      <Modal
        isOpen={showGuestLogin}
        onClose={() => setShowGuestLogin(false)}
        title="Guest Login"
      >
        <GuestLogin onClose={() => setShowGuestLogin(false)} />
      </Modal>

      {selectedImages && (
        <ImageViewer
          images={selectedImages}
          currentIndex={currentImageIndex}
          onClose={() => setSelectedImages(null)}
        />
      )}
    </div>
  );
}

export default Home;