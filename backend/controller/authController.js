import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Agency from '../models/Agency.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password, role, agencyName, routes } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // If role is admin, check if admin already exists
    if (role === 'admin') {
      const adminExists = await User.findOne({ role: 'admin' });
      if (adminExists) {
        return res.status(400).json({ message: 'Admin already exists. Only one admin is allowed.' });
      }
    }

    let agencyId = null;
    let finalAgencyName = null;

    // If user role, handle agency
    if (role === 'user') {
      if (!agencyName || !routes || routes.length === 0) {
        return res.status(400).json({ message: 'Agency name and routes are required for user role' });
      }

      // Check if agency already exists
      let agency = await Agency.findOne({ name: agencyName });
      
      if (!agency) {
        // Create new agency
        agency = await Agency.create({
          name: agencyName,
          routes: routes
        });
      } else {
        // Update routes if agency exists
        const uniqueRoutes = [...new Set([...agency.routes, ...routes])];
        agency.routes = uniqueRoutes;
        await agency.save();
      }

      agencyId = agency._id;
      finalAgencyName = agency.name;
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
      agencyId,
      agencyName: finalAgencyName,
      routes: role === 'user' ? routes : []
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        agencyId: user.agencyId,
        agencyName: user.agencyName,
        routes: user.routes,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).populate('agencyId');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        agencyId: user.agencyId?._id || null,
        agencyName: user.agencyName,
        routes: user.agencyId?.routes || [],
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('agencyId');
    
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        agencyId: user.agencyId?._id || null,
        agencyName: user.agencyName,
        routes: user.agencyId?.routes || []
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').populate('agencyId');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
