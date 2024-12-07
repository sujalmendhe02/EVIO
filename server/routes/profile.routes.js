import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "74e9ad2a27e4ab78f019c30e9eb5dfca39c9a3fdb589e1d7d57694d36b58b478");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Get all users (excluding guests and current user)
router.get('/all', auth, async (req, res) => {
  try {
    const users = await User.find({
      isGuest: false,
      _id: { $ne: req.userId }
    }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get current user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Get user profile by ID
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update profile
router.put('/', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Upload profile photo
router.post('/photo', auth, upload.single('profilePhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile photo if exists
    if (user.profilePhoto?.filename) {
      const oldFilePath = path.join('uploads', user.profilePhoto.filename);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    user.profilePhoto = {
      type: 'image',
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    };

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading profile photo' });
  }
});

// Upload resume
router.post('/resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old resume if exists
    if (user.resume?.filename) {
      const oldFilePath = path.join('uploads', user.resume.filename);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    user.resume = {
      type: 'pdf',
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    };

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading resume' });
  }
});

// Delete resume
router.delete('/resume', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.resume?.filename) {
      const filePath = path.join('uploads', user.resume.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.resume = undefined;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume' });
  }
});

// Add project
router.post('/project', auth, upload.array('media', 5), async (req, res) => {
  try {
    const { title, description } = req.body;
    const user = await User.findById(req.userId);
    
    const media = req.files?.map(file => ({
      type: file.mimetype.startsWith('image/') ? 'image' : 'video',
      url: `/uploads/${file.filename}`,
      filename: file.filename
    })) || [];

    const newProject = {
      title,
      description,
      media,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    user.projects.push(newProject);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error adding project' });
  }
});

// Delete project
router.delete('/project/:projectId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const project = user.projects.id(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete associated media files
    if (project.media && project.media.length > 0) {
      project.media.forEach(media => {
        if (media.filename) {
          const filePath = path.join('uploads', media.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }

    user.projects = user.projects.filter(p => p._id.toString() !== req.params.projectId);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

// Add achievement
router.post('/achievement', auth, upload.single('media'), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const achievement = {
      title,
      description,
      date: new Date(date),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (req.file) {
      achievement.media = {
        type: req.file.mimetype.startsWith('image/') ? 'image' : 'video',
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename
      };
    }

    user.achievements.push(achievement);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error adding achievement' });
  }
});

// Delete achievement
router.delete('/achievement/:achievementId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const achievement = user.achievements.id(req.params.achievementId);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    // Delete associated media file
    if (achievement.media?.filename) {
      const filePath = path.join('uploads', achievement.media.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.achievements = user.achievements.filter(a => a._id.toString() !== req.params.achievementId);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting achievement' });
  }
});

// Add review
router.post('/:userId/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has already reviewed
    const existingReview = user.reviews.find(
      review => review.userId.toString() === req.userId
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this profile' });
    }

    user.reviews.push({
      userId: req.userId,
      rating,
      comment,
      createdAt: new Date()
    });

    user.calculateAverageRatings();
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
});

export default router;