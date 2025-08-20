const mongoose = require('mongoose');

const pupilSchema = new mongoose.Schema({
  // Personal Details
  title: { 
    type: String, 
    enum: ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'],
    trim: true
  },
  forename: { 
    type: String, 
    required: [true, 'Forename is required'], 
    trim: true,
    maxlength: [50, 'Forename cannot exceed 50 characters']
  },
  surname: { 
    type: String, 
    required: [true, 'Surname is required'], 
    trim: true,
    maxlength: [50, 'Surname cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    lowercase: true, 
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  dob: { 
    type: Date, 
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(v) {
        return v <= new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  gender: { 
    type: String, 
    required: [true, 'Gender is required'], 
    enum: {
      values: ['Male', 'Female', 'Other'],
      message: 'Gender must be Male, Female, or Other'
    }
  },
  
  // Contact Information
  home: {
    mobile: { 
      type: String, 
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[\d\s\-\+\(\)]+$/.test(v);
        },
        message: 'Invalid mobile number format'
      }
    },
    work: { 
      type: String, 
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[\d\s\-\+\(\)]+$/.test(v);
        },
        message: 'Invalid work number format'
      }
    }
  },
  allowTextMessaging: { 
    type: Boolean, 
    default: false 
  },
  
  // Addresses
  pickupAddress: {
    postcode: { 
      type: String, 
      trim: true,
      uppercase: true,
      validate: {
        validator: function(v) {
          return !v || /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i.test(v);
        },
        message: 'Invalid UK postcode format'
      }
    },
    houseNo: { 
      type: String, 
      trim: true 
    },
    address: { 
      type: String, 
      trim: true 
    }
  },
  homeAddress: {
    postcode: { 
      type: String, 
      trim: true,
      uppercase: true,
      validate: {
        validator: function(v) {
          return !v || /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i.test(v);
        },
        message: 'Invalid UK postcode format'
      }
    },
    houseNo: { 
      type: String, 
      trim: true 
    },
    address: { 
      type: String, 
      trim: true 
    }
  },
  
  // Extra Details
  pupilType: { 
    type: String, 
    enum: {
      values: ['Manual Gearbox', 'Automatic', 'Motorcycle', 'HGV'],
      message: 'Invalid pupil type'
    },
    default: 'Manual Gearbox'
  },
  pupilOwner: { 
    type: String, 
    default: 'Instructor',
    trim: true
  },
  allocatedTo: { 
    type: String, 
    trim: true 
  },
  licenseType: { 
    type: String, 
    enum: {
      values: ['No License', 'Provisional', 'Full License'],
      message: 'Invalid license type'
    },
    default: 'No License'
  },
  licenseNo: { 
    type: String, 
    trim: true 
  },
  passedTheory: { 
    type: Boolean, 
    default: false 
  },
  certNo: { 
    type: String, 
    trim: true 
  },
  datePassed: { 
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v <= new Date();
      },
      message: 'Date passed cannot be in the future'
    }
  },
  fott: { 
    type: Boolean, 
    default: false 
  },
  fullAccess: { 
    type: Boolean, 
    default: false 
  },
  usualAvailability: { 
    type: String, 
    trim: true 
  },
  discount: { 
    type: String, 
    default: '0%',
    trim: true
  },
  defaultProduct: { 
    type: String, 
    trim: true 
  },
  onlinePassword: { 
    type: String, 
    trim: true 
  },
  pupilCaution: { 
    type: Boolean, 
    default: false 
  },
  notes: { 
    type: String, 
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
pupilSchema.index({ surname: 1, forename: 1 });
pupilSchema.index({ email: 1 });
pupilSchema.index({ 'home.mobile': 1 });
pupilSchema.index({ createdAt: -1 });
pupilSchema.index({ allocatedTo: 1 });

// Virtual for full name
pupilSchema.virtual('fullName').get(function() {
  return `${this.forename} ${this.surname}`;
});

// Virtual for age calculation
pupilSchema.virtual('age').get(function() {
  if (!this.dob) return null;
  const today = new Date();
  const birthDate = new Date(this.dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Instance method for data transformation
pupilSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.onlinePassword;
  return obj;
};

// Static method to find by email
pupilSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find by mobile
pupilSchema.statics.findByMobile = function(mobile) {
  return this.findOne({ 'home.mobile': mobile });
};

// Pre-save middleware to ensure email uniqueness when provided
pupilSchema.pre('save', async function(next) {
  if (this.email && this.isModified('email')) {
    const existingPupil = await this.constructor.findOne({ 
      email: this.email, 
      _id: { $ne: this._id } 
    });
    if (existingPupil) {
      const error = new Error('Email already exists');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Pre-save middleware to format postcode
pupilSchema.pre('save', function(next) {
  if (this.pickupAddress && this.pickupAddress.postcode) {
    this.pickupAddress.postcode = this.pickupAddress.postcode.toUpperCase();
  }
  if (this.homeAddress && this.homeAddress.postcode) {
    this.homeAddress.postcode = this.homeAddress.postcode.toUpperCase();
  }
  next();
});

const Pupil = mongoose.model('Pupil', pupilSchema);

module.exports = Pupil;