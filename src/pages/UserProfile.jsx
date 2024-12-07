import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, Mail, Phone, GraduationCap, Trophy, Briefcase, Share2, FileText, User } from 'lucide-react';
import toast from 'react-hot-toast';
import UserAvatar from '../components/UserAvatar';
import ImageViewer from '../components/ImageViewer';
import Modal from '../components/Modal';
import ReviewForm from '../components/ReviewForm';
import { useAuth } from '../context/AuthContext';
import GuestLogin from '../components/GuestLogin';
import MediaGallery from '../components/MediaGallery';
import ResumeViewer from '../components/ResumeViewer';

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showGuestLogin, setShowGuestLogin] = useState(false);
  const [reviewers, setReviewers] = useState({});
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    if (profile?.reviews) {
      fetchReviewers();
    }
  }, [profile?.reviews]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/${userId}`, {
        withCredentials: true
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewers = async () => {
    try {
      const reviewerIds = profile.reviews.map(review => review.userId);
      const uniqueIds = [...new Set(reviewerIds)];
      
      const reviewersData = {};
      await Promise.all(
        uniqueIds.map(async (reviewerId) => {
          const response = await axios.get(`http://localhost:5000/api/profile/${reviewerId}`, {
            withCredentials: true
          });
          reviewersData[reviewerId] = response.data;
        })
      );
      setReviewers(reviewersData);
    } catch (error) {
      console.error('Error fetching reviewers:', error);
    }
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${profile.name}'s Profile on EVIO`,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Profile link copied to clipboard!');
    }
  };

  const handleImageClick = (images, startIndex = 0) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
  };

  const handleReviewSubmit = async (reviewData) => {
    if (!user) {
      setShowGuestLogin(true);
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/profile/${userId}/review`, reviewData, {
        withCredentials: true
      });
      toast.success('Review submitted successfully');
      setShowReviewForm(false);
      fetchUserProfile();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-8 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-6">
              <UserAvatar user={profile} size="xl" />
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-xl mt-2">{profile.age} years old</p>
                <div className="flex items-center mt-4">
                  <Star className="w-6 h-6 fill-current" />
                  <span className="ml-2 text-xl">{profile.averageRating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <Share2 className="w-6 h-6" />
              </button>
              {user && user._id !== profile._id && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Rate Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Resume Section */}
          {profile.resume?.url && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center mb-2">
                <FileText className="w-5 h-5 mr-2" />
                Resume
              </h3>
              <ResumeViewer resumeUrl={profile.resume.url} />
            </div>
          )}
        </div>
      </div>

      {/* Education Section */}
      {profile.education?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
            <GraduationCap className="w-6 h-6 mr-2" />
            Education
          </h2>
          <div className="grid gap-6">
            {profile.education.map((edu) => (
              <div key={edu._id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-600 text-lg">{edu.institutionName}</h3>
                <p className="text-gray-600 mt-1">{edu.type}</p>
                <p className="text-gray-500">
                  {edu.startYear} - {edu.endYear || 'Present'}
                </p>
                {edu.marks && (
                  <p className="text-gray-600 mt-1">Marks/Grade: {edu.marks}</p>
                )}
                {edu.degree && (
                  <p className="text-gray-600">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {profile.projects?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
            <Briefcase className="w-6 h-6 mr-2" />
            Projects
          </h2>
          <div className="grid gap-6">
            {profile.projects.map((project) => (
              <div key={project._id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-600 text-lg">{project.title}</h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
                {project.media && project.media.length > 0 && (
                  <div className="mt-4">
                    <MediaGallery
                      media={project.media}
                      onImageClick={handleImageClick}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Section */}
      {profile.achievements?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
            <Trophy className="w-6 h-6 mr-2" />
            Achievements
          </h2>
          <div className="grid gap-6">
            {profile.achievements.map((achievement) => (
              <div key={achievement._id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-600 text-lg">{achievement.title}</h3>
                <p className="text-gray-600 mt-2">{achievement.description}</p>
                <p className="text-gray-500 mt-2">
                  {new Date(achievement.date).toLocaleDateString()}
                </p>
                {achievement.media?.url && (
                  <div className="mt-4">
                    <MediaGallery
                      media={[achievement.media]}
                      onImageClick={handleImageClick}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {profile.reviews?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>
          <div className="grid gap-6">
            {profile.reviews.map((review) => (
              <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="font-medium text-gray-700">
                      {reviewers[review.userId]?.name || 'Anonymous User'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 ${
                          index < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-4 text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImages && (
        <ImageViewer
          images={selectedImages}
          currentIndex={currentImageIndex}
          onClose={() => setSelectedImages(null)}
        />
      )}

      {/* Review Form Modal */}
      <Modal
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        title="Write a Review"
      >
        <ReviewForm
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowReviewForm(false)}
        />
      </Modal>

      {/* Guest Login Modal */}
      <Modal
        isOpen={showGuestLogin}
        onClose={() => setShowGuestLogin(false)}
        title="Guest Login"
      >
        <GuestLogin onClose={() => setShowGuestLogin(false)} />
      </Modal>
    </div>
  );
}

export default UserProfile;