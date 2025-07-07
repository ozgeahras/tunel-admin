import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get homepage content
router.get('/homepage', authenticateAdmin, async (req, res) => {
  try {
    const content = {
      hero: {
        title: 'Find Your Dream Job in Europe',
        subtitle: 'Connect with top European companies offering visa sponsorship for Turkish developers',
        searchPlaceholder: 'Search for jobs...',
        allCountries: 'All Countries',
        searchButton: 'Search Jobs'
      },
      stats: {
        jobs: 'Active Jobs',
        companies: 'Partner Companies',
        countries: 'European Countries'
      },
      features: {
        visaOnly: {
          title: 'Visa Sponsorship Only',
          description: 'Every job posting guarantees visa sponsorship for Turkish citizens'
        },
        smartFiltering: {
          title: 'Smart Job Matching',
          description: 'Find jobs that match your skills and career goals with our AI-powered recommendations'
        },
        turkishProfessionals: {
          title: 'Turkish Professional Network',
          description: 'Connect with other Turkish developers who have successfully relocated to Europe'
        }
      },
      successStories: [
        {
          id: '1',
          name: 'Mehmet Akın',
          role: 'Frontend Developer',
          company: 'Berlin Startup',
          location: 'Berlin, Germany',
          salary: '€65,000/year',
          story: 'Found my dream job at a Berlin startup through Tunel. The visa process was seamless and the company was incredibly supportive.',
          image: '/avatars/mehmet.jpg'
        }
      ],
      companies: [
        { name: 'Spotify', color: 'blue' },
        { name: 'Adyen', color: 'green' },
        { name: 'Klarna', color: 'purple' }
      ]
    };

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Update homepage content
router.put('/homepage', authenticateAdmin, async (req, res) => {
  try {
    const content = req.body;
    // Save to database
    res.json({ message: 'Homepage content updated successfully', content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Upload image
router.post('/upload', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get all uploaded images
router.get('/images', authenticateAdmin, async (req, res) => {
  try {
    // In a real app, scan the uploads directory
    const images = [
      { id: '1', filename: 'hero-bg.jpg', url: '/uploads/hero-bg.jpg', size: 1024000 },
      { id: '2', filename: 'company-logo.png', url: '/uploads/company-logo.png', size: 512000 }
    ];

    res.json({ images });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Analytics data
router.get('/analytics', authenticateAdmin, async (req, res) => {
  try {
    const analytics = {
      overview: {
        totalJobs: 156,
        totalCompanies: 42,
        totalApplications: 1247,
        activeUsers: 892
      },
      jobStats: {
        byCountry: [
          { country: 'Germany', count: 45 },
          { country: 'Netherlands', count: 38 },
          { country: 'Sweden', count: 25 },
          { country: 'Switzerland', count: 20 }
        ],
        byType: [
          { type: 'Full-time', count: 120 },
          { type: 'Contract', count: 25 },
          { type: 'Freelance', count: 11 }
        ]
      },
      applicationTrends: [
        { month: 'Jan', applications: 89 },
        { month: 'Feb', applications: 145 },
        { month: 'Mar', applications: 203 },
        { month: 'Apr', applications: 167 }
      ]
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;