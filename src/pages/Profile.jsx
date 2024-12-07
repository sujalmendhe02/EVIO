import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit2, GraduationCap, Trophy, Briefcase, Trash2, FileText } from 'lucide-react';
import ProjectForm from '../components/ProjectForm';
import AchievementForm from '../components/AchievementForm';
import AchievementCard from '../components/AchievementCard';
import ProfilePhoto from '../components/ProfilePhoto';
import ResumeUpload from '../components/ResumeUpload';
import Modal from '../components/Modal';
import ImageViewer from '../components/ImageViewer';
import MediaGallery from '../components/MediaGallery';

function Profile() {
  const { user, setUser } = useAuth();
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [achievementForm, setAchievementForm] = useState({
    title: '',
    description: '',
    date: '',
    media: null
  });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImages, setSelectedImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editFormData, setEditFormData] = useState({
    age: '',
    contact: '',
    address: ''
  });

  const [educationForm, setEducationForm] = useState({
    type: '',
    institutionName: '',
    startYear: '',
    endYear: '',
    marks: '',
    degree: '',
    field: ''
  });

  useEffect(() => {
    if (user) {
      setEditFormData({
        age: user.age || '',
        contact: user.contact || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:5000/api/profile',
        editFormData,
        { withCredentials: true }
      );
      setUser(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/profile/education',
        educationForm,
        { withCredentials: true }
      );
      setUser(response.data);
      setShowEducationForm(false);
      setEducationForm({
        type: '',
        institutionName: '',
        startYear: '',
        endYear: '',
        marks: '',
        degree: '',
        field: ''
      });
      toast.success('Education added successfully');
    } catch (error) {
      toast.error('Failed to add education');
    }
  };

  const handleDeleteEducation = async (educationId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/profile/education/${educationId}`,
        { withCredentials: true }
      );
      setUser(response.data);
      toast.success('Education deleted successfully');
    } catch (error) {
      toast.error('Failed to delete education');
    }
  };

  const handleDeleteAchievement = async (achievementId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/profile/achievement/${achievementId}`,
        { withCredentials: true }
      );
      setUser(response.data);
      toast.success('Achievement deleted successfully');
    } catch (error) {
      toast.error('Failed to delete achievement');
    }
  };

  const handleProjectDelete = async (projectId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/profile/project/${projectId}`,
        { withCredentials: true }
      );
      setUser(response.data);
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleImageClick = (images, startIndex = 0) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-6">
            <ProfilePhoto user={user} onPhotoUpdate={setUser} />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                value={editFormData.age}
                onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact</label>
              <input
                type="text"
                value={editFormData.contact}
                onChange={(e) => setEditFormData({ ...editFormData, contact: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">Age: {user.age}</p>
            <p className="text-gray-600">Contact: {user.contact}</p>
            <p className="text-gray-600">Address: {user.address}</p>
          </div>
        )}

        {/* Resume Section */}
        <div className="mt-6">
          <ResumeUpload user={user} onResumeUpdate={setUser} />
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <GraduationCap className="w-6 h-6 mr-2" />
            Education
          </h2>
          <button
            onClick={() => setShowEducationForm(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </button>
        </div>

        <div className="space-y-4">
          {user.education?.map((edu) => (
            <div key={edu._id} className="flex justify-between items-start bg-gray-50 p-4 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{edu.institutionName}</h3>
                <p className="text-sm text-gray-600">{edu.type}</p>
                <p className="text-sm text-gray-600">
                  {edu.startYear} - {edu.endYear || 'Present'}
                </p>
                {edu.marks && <p className="text-sm text-gray-600">Marks: {edu.marks}</p>}
              </div>
              <button
                onClick={() => handleDeleteEducation(edu._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Trophy className="w-6 h-6 mr-2" />
            Achievements
          </h2>
          <button
            onClick={() => setShowAchievementForm(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Achievement
          </button>
        </div>

        <div className="space-y-4">
          {user.achievements?.map((achievement) => (
            <AchievementCard
              key={achievement._id}
              achievement={achievement}
              onDelete={handleDeleteAchievement}
              onImageClick={handleImageClick}
            />
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Briefcase className="w-6 h-6 mr-2" />
            Projects
          </h2>
          <button
            onClick={() => setShowProjectForm(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </button>
        </div>

        <div className="space-y-6">
          {user.projects?.map((project) => (
            <div key={project._id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                </div>
                <button
                  onClick={() => handleProjectDelete(project._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              {project.media && project.media.length > 0 && (
                <MediaGallery
                  media={project.media}
                  onImageClick={handleImageClick}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Education Form Modal */}
      <Modal
        isOpen={showEducationForm}
        onClose={() => setShowEducationForm(false)}
        title="Add Education"
      >
        <form onSubmit={handleEducationSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              value={educationForm.type}
              onChange={(e) => setEducationForm({ ...educationForm, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Institution Name</label>
            <input
              type="text"
              value={educationForm.institutionName}
              onChange={(e) => setEducationForm({ ...educationForm, institutionName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Year</label>
              <input
                type="number"
                value={educationForm.startYear}
                onChange={(e) => setEducationForm({ ...educationForm, startYear: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Year</label>
              <input
                type="number"
                value={educationForm.endYear}
                onChange={(e) => setEducationForm({ ...educationForm, endYear: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Marks/Grade</label>
            <input
              type="text"
              value={educationForm.marks}
              onChange={(e) => setEducationForm({ ...educationForm, marks: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Degree</label>
            <input
              type="text"
              value={educationForm.degree}
              onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Field of Study</label>
            <input
              type="text"
              value={educationForm.field}
              onChange={(e) => setEducationForm({ ...educationForm, field: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Education
          </button>
        </form>
      </Modal>

      {/* Achievement Form Modal */}
      <Modal
        isOpen={showAchievementForm}
        onClose={() => setShowAchievementForm(false)}
        title="Add Achievement"
      >
        <AchievementForm
          achievementForm={achievementForm}
          setAchievementForm={setAchievementForm}
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            formData.append('title', achievementForm.title);
            formData.append('description', achievementForm.description);
            formData.append('date', achievementForm.date);
            if (achievementForm.media) {
              formData.append('media', achievementForm.media);
            }
            try {
              const response = await axios.post(
                'http://localhost:5000/api/profile/achievement',
                formData,
                {
                  withCredentials: true,
                  headers: { 'Content-Type': 'multipart/form-data' }
                }
              );
              setUser(response.data);
              setShowAchievementForm(false);
              toast.success('Achievement added successfully');
            } catch (error) {
              toast.error('Failed to add achievement');
            }
          }}
        />
      </Modal>

      {/* Project Form Modal */}
      <Modal
        isOpen={showProjectForm}
        onClose={() => setShowProjectForm(false)}
        title="Add Project"
      >
        <ProjectForm
          onProjectAdded={() => {
            setShowProjectForm(false);
            toast.success('Project added successfully');
          }}
        />
      </Modal>

      {/* Image Viewer Modal */}
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

export default Profile;