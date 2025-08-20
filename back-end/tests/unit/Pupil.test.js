const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Pupil = require('../../src/models/Pupil');

describe('Pupil Model', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Pupil.deleteMany({});
  });

  describe('Schema Validation', () => {
    it('should create a valid pupil with required fields', async () => {
      const validPupil = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male'
      });

      const savedPupil = await validPupil.save();
      expect(savedPupil._id).toBeDefined();
      expect(savedPupil.forename).toBe('John');
      expect(savedPupil.surname).toBe('Smith');
      expect(savedPupil.gender).toBe('Male');
      expect(savedPupil.createdAt).toBeDefined();
      expect(savedPupil.updatedAt).toBeDefined();
    });

    it('should fail validation when required fields are missing', async () => {
      const invalidPupil = new Pupil({
        forename: 'John'
        // Missing surname, dob, gender
      });

      await expect(invalidPupil.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const pupilWithInvalidEmail = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male',
        email: 'invalid-email'
      });

      await expect(pupilWithInvalidEmail.save()).rejects.toThrow();
    });

    it('should accept valid email format', async () => {
      const pupilWithValidEmail = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male',
        email: 'john.smith@example.com'
      });

      const savedPupil = await pupilWithValidEmail.save();
      expect(savedPupil.email).toBe('john.smith@example.com');
    });

    it('should validate gender enum values', async () => {
      const pupilWithInvalidGender = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'InvalidGender'
      });

      await expect(pupilWithInvalidGender.save()).rejects.toThrow();
    });

    it('should validate pupil type enum values', async () => {
      const pupilWithValidType = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male',
        pupilType: 'Automatic'
      });

      const savedPupil = await pupilWithValidType.save();
      expect(savedPupil.pupilType).toBe('Automatic');
    });

    it('should validate license type enum values', async () => {
      const pupilWithValidLicense = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male',
        licenseType: 'Provisional'
      });

      const savedPupil = await pupilWithValidLicense.save();
      expect(savedPupil.licenseType).toBe('Provisional');
    });

    it('should validate UK postcode format', async () => {
      const pupilWithValidPostcode = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male',
        pickupAddress: {
          postcode: 'SO16 3AB',
          houseNo: '123',
          address: 'Main Street'
        }
      });

      const savedPupil = await pupilWithValidPostcode.save();
      expect(savedPupil.pickupAddress.postcode).toBe('SO16 3AB');
    });

    it('should reject invalid postcode format', async () => {
      const pupilWithInvalidPostcode = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male',
        pickupAddress: {
          postcode: 'INVALID',
          houseNo: '123',
          address: 'Main Street'
        }
      });

      await expect(pupilWithInvalidPostcode.save()).rejects.toThrow();
    });
  });

  describe('Default Values', () => {
    it('should set default values correctly', async () => {
      const pupil = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male'
      });

      const savedPupil = await pupil.save();
      expect(savedPupil.pupilType).toBe('Manual Gearbox');
      expect(savedPupil.pupilOwner).toBe('Instructor');
      expect(savedPupil.licenseType).toBe('No License');
      expect(savedPupil.allowTextMessaging).toBe(false);
      expect(savedPupil.passedTheory).toBe(false);
      expect(savedPupil.fott).toBe(false);
      expect(savedPupil.fullAccess).toBe(false);
      expect(savedPupil.pupilCaution).toBe(false);
      expect(savedPupil.discount).toBe('0%');
    });
  });

  describe('Virtual Properties', () => {
    it('should calculate full name virtual', async () => {
      const pupil = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male'
      });

      const savedPupil = await pupil.save();
      expect(savedPupil.fullName).toBe('John Smith');
    });

    it('should calculate age virtual', async () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25); // 25 years ago

      const pupil = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: birthDate,
        gender: 'Male'
      });

      const savedPupil = await pupil.save();
      expect(savedPupil.age).toBe(25);
    });
  });

  describe('Instance Methods', () => {
    it('should return safe object without password', async () => {
      const pupil = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male',
        onlinePassword: 'secret123'
      });

      const savedPupil = await pupil.save();
      const safeObject = savedPupil.toSafeObject();
      
      expect(safeObject.onlinePassword).toBeUndefined();
      expect(safeObject.forename).toBe('John');
      expect(safeObject.surname).toBe('Smith');
    });
  });

  describe('Static Methods', () => {
    it('should find pupil by email', async () => {
      const pupil = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male',
        email: 'john.smith@example.com'
      });

      await pupil.save();
      
      const foundPupil = await Pupil.findByEmail('john.smith@example.com');
      expect(foundPupil).toBeTruthy();
      expect(foundPupil.forename).toBe('John');
    });

    it('should find pupil by mobile', async () => {
      const pupil = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male',
        home: {
          mobile: '07123456789'
        }
      });

      await pupil.save();
      
      const foundPupil = await Pupil.findByMobile('07123456789');
      expect(foundPupil).toBeTruthy();
      expect(foundPupil.forename).toBe('John');
    });
  });

  describe('Pre-save Middleware', () => {
    it('should convert email to lowercase', async () => {
      const pupil = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male',
        email: 'JOHN.SMITH@EXAMPLE.COM'
      });

      const savedPupil = await pupil.save();
      expect(savedPupil.email).toBe('john.smith@example.com');
    });

    it('should convert postcode to uppercase', async () => {
      const pupil = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male',
        pickupAddress: {
          postcode: 'so16 3ab'
        }
      });

      const savedPupil = await pupil.save();
      expect(savedPupil.pickupAddress.postcode).toBe('SO16 3AB');
    });

    it('should prevent duplicate emails', async () => {
      const pupil1 = new Pupil({
        forename: 'John',
        surname: 'Smith',
        dob: new Date('1995-03-15'),
        gender: 'Male',
        email: 'john.smith@example.com'
      });

      await pupil1.save();

      const pupil2 = new Pupil({
        forename: 'Jane',
        surname: 'Doe',
        dob: new Date('1990-01-01'),
        gender: 'Female',
        email: 'john.smith@example.com'
      });

      await expect(pupil2.save()).rejects.toThrow('Email already exists');
    });
  });

  describe('Indexes', () => {
    it('should have proper indexes defined', () => {
      const indexes = Pupil.schema.indexes();
      
      // Check that indexes are defined
      expect(indexes.length).toBeGreaterThan(0);
      
      // Check for specific indexes
      const indexFields = indexes.map(index => Object.keys(index[0]));
      expect(indexFields.some(fields => fields.includes('surname') && fields.includes('forename'))).toBe(true);
      expect(indexFields.some(fields => fields.includes('email'))).toBe(true);
      expect(indexFields.some(fields => fields.includes('home.mobile'))).toBe(true);
    });
  });
});