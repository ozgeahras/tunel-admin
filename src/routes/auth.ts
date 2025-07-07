import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Admin login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    // Check admin credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tunel.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email !== adminEmail) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // For development, allow plain text password comparison
    // In production, you'd hash the stored password
    const isValidPassword = password === adminPassword || 
      await bcrypt.compare(password, await bcrypt.hash(adminPassword, 10));
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    const token = jwt.sign(
      { 
        id: '1', 
        email: email,
        name: 'Admin',
        role: 'admin'
      },
      jwtSecret,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        issuer: 'tunel-admin'
      }
    );

    // Return success response
    res.json({
      success: true,
      token,
      admin: {
        id: '1',
        email: email,
        name: 'Admin',
        role: 'admin'
      },
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });

    console.log(`✅ Admin login successful: ${email} at ${new Date().toISOString()}`);
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Something went wrong during authentication'
    });
  }
});

// Verify token endpoint
router.get('/verify', authenticateAdmin, (req: AuthRequest, res) => {
  res.json({
    success: true,
    admin: req.admin,
    message: 'Token is valid'
  });
});

// Logout endpoint (client-side token removal)
router.post('/logout', authenticateAdmin, (req: AuthRequest, res) => {
  console.log(`📤 Admin logout: ${req.admin?.email} at ${new Date().toISOString()}`);
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get admin profile
router.get('/profile', authenticateAdmin, (req: AuthRequest, res) => {
  res.json({
    success: true,
    admin: {
      ...req.admin,
      loginCount: 1, // In real app, track this in database
      lastLogin: new Date().toISOString(),
      permissions: ['read', 'write', 'delete', 'manage']
    }
  });
});

export default router;