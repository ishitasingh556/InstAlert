const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, phoneNumber, emergencyContacts } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      emergencyContacts: emergencyContacts || []
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location,
        bloodGroup: user.bloodGroup,
        medicalConditions: user.medicalConditions,
        emergencyContacts: user.emergencyContacts,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location,
        bloodGroup: user.bloodGroup,
        medicalConditions: user.medicalConditions,
        emergencyContacts: user.emergencyContacts,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (!req.body.password) {
        return res.status(400).json({ message: 'Password is required to update details' });
      }

      if (!(await user.matchPassword(req.body.password))) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.location = req.body.location || user.location;
      user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
      user.medicalConditions = req.body.medicalConditions || user.medicalConditions;
      
      if (req.body.emergencyContacts) {
        user.emergencyContacts = req.body.emergencyContacts;
      }

      if (req.body.newPassword) {
        user.password = req.body.newPassword;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        location: updatedUser.location,
        bloodGroup: updatedUser.bloodGroup,
        medicalConditions: updatedUser.medicalConditions,
        emergencyContacts: updatedUser.emergencyContacts,
        token: generateToken(updatedUser._id) // keep the same token approach
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addEmergencyContact = async (req, res) => {
  const { name, phoneNumber, email } = req.body;
  
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.emergencyContacts.push({ name, phoneNumber, email });
      await user.save();
      res.json(user.emergencyContacts);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmergencyContact = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.emergencyContacts = user.emergencyContacts.filter(
        (contact) => contact._id.toString() !== req.params.id
      );
      await user.save();
      res.json(user.emergencyContacts);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const googleLogin = async (req, res) => {
  const { email, name, googleId, imageUrl } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist (Registration via Google)
      // We set a random password because password is required in the schema
      const randomPassword = Math.random().toString(36).slice(-8);
      user = await User.create({
        name,
        email,
        password: randomPassword,
        phoneNumber: 'Not provided', // Google doesn't always give phone
        emergencyContacts: []
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      location: user.location,
      bloodGroup: user.bloodGroup,
      medicalConditions: user.medicalConditions,
      emergencyContacts: user.emergencyContacts,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, addEmergencyContact, deleteEmergencyContact, updateProfile, googleLogin };
