import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['image', 'video', 'pdf'], 
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  filename: String
});

const reviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  media: [mediaSchema],
  reviews: [reviewSchema],
  averageRating: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const educationSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true 
  },
  institutionName: { 
    type: String, 
    required: true 
  },
  startYear: { 
    type: Number, 
    required: true 
  },
  endYear: Number,
  marks: String,
  degree: String,
  field: String
});

const achievementSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  media: {
    type: { 
      type: String, 
      enum: ['image', 'video'], 
      required: false 
    },
    url: { 
      type: String, 
      required: false 
    },
    filename: String
  },
  ratings: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    rating: { 
      type: Number, 
      min: 1, 
      max: 5 
    }
  }],
  averageRating: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  guestId: {
    type: String,
    sparse: true,
    unique: true
  },
  age: { 
    type: Number,
    min: 1,
    max: 120
  },
  contact: String,
  address: String,
  profilePhoto: {
    type: { 
      type: String, 
      enum: ['image'], 
      required: false 
    },
    url: { 
      type: String, 
      required: false 
    },
    filename: String
  },
  resume: {
    type: { 
      type: String, 
      enum: ['pdf'], 
      required: false 
    },
    url: { 
      type: String, 
      required: false 
    },
    filename: String
  },
  education: [educationSchema],
  achievements: [achievementSchema],
  projects: [projectSchema],
  reviews: [reviewSchema],
  averageRating: { 
    type: Number, 
    default: 0 
  },
  profileLocked: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

userSchema.pre('save', function(next) {
  const user = this;
  
  // Generate guestId for guest users if not already set
  if (user.isGuest && !user.guestId) {
    user.guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  if (user.isModified('achievements')) {
    user.achievements.forEach(achievement => {
      if (achievement.isNew) {
        achievement.createdAt = new Date();
      }
      achievement.updatedAt = new Date();
    });
  }

  if (user.isModified('projects')) {
    user.projects.forEach(project => {
      if (project.isNew) {
        project.createdAt = new Date();
      }
      project.updatedAt = new Date();
    });
  }

  next();
});

userSchema.methods.calculateAverageRatings = function() {
  if (this.reviews && this.reviews.length > 0) {
    this.averageRating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
  }

  this.achievements.forEach(achievement => {
    if (achievement.ratings && achievement.ratings.length > 0) {
      achievement.averageRating = achievement.ratings.reduce((acc, rating) => acc + rating.rating, 0) / achievement.ratings.length;
    }
  });

  this.projects.forEach(project => {
    if (project.reviews && project.reviews.length > 0) {
      project.averageRating = project.reviews.reduce((acc, review) => acc + review.rating, 0) / project.reviews.length;
    }
  });
};

export default mongoose.model('User', userSchema);