import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateAdmin, AuthRequest } from '../middleware/auth';

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
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'));
    }
  }
});

// Mock homepage content
let homepageContent = {
  hero: {
    title: 'Find Your Dream Job in Europe',
    subtitle: 'Connect with top European companies offering visa sponsorship for Turkish developers',
    searchPlaceholder: 'Search for jobs, companies, or skills...',
    backgroundImage: '/images/hero-bg.jpg'
  },
  stats: {
    jobs: { label: 'Active Jobs', value: 500 },
    companies: { label: 'Partner Companies', value: 50 },
    countries: { label: 'European Countries', value: 15 }
  },
  features: {
    visaOnly: {
      title: 'Visa Sponsorship Guaranteed',
      description: 'Every job posting guarantees visa sponsorship for Turkish citizens seeking European opportunities'
    },
    smartFiltering: {
      title: 'AI-Powered Job Matching',
      description: 'Find jobs that perfectly match your skills and career goals with our intelligent recommendation system'
    },
    turkishProfessionals: {
      title: 'Turkish Developer Community',
      description: 'Connect with other Turkish developers who have successfully relocated to Europe and share experiences'
    }
  },
  successStories: [
    {
      id: '1',
      name: 'Mehmet Akın',
      role: 'Frontend Developer',
      company: 'Spotify',
      location: 'Berlin, Germany',
      salary: '€65,000/year',
      story: 'Found my dream job at a Berlin startup through Tunel. The visa process was seamless and the company was incredibly supportive.',
      image: '/images/testimonial-1.jpg'
    },
    {
      id: '2',
      name: 'Ayşe Yılmaz',
      role: 'Full Stack Developer',
      company: 'Adyen',
      location: 'Amsterdam, Netherlands',
      salary: '€70,000/year',
      story: 'Relocated to Amsterdam with my family. The job market insights and company culture information helped me choose the perfect fit.',
      image: '/images/testimonial-2.jpg'
    }
  ],
  companiesShowcase: [
    { name: 'Spotify', color: 'blue-600', logo: '/logos/spotify.png' },
    { name: 'Adyen', color: 'green-600', logo: '/logos/adyen.png' },
    { name: 'Klarna', color: 'purple-600', logo: '/logos/klarna.png' },
    { name: 'Delivery Hero', color: 'orange-600', logo: '/logos/delivery-hero.png' },
    { name: 'Takeaway', color: 'red-600', logo: '/logos/takeaway.png' },
    { name: 'Bunq', color: 'indigo-600', logo: '/logos/bunq.png' }
  ]
};

// Get homepage content
router.get('/homepage', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    res.json({
      success: true,
      content: homepageContent,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching homepage content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch homepage content'
    });
  }
});

// Update homepage content
router.put('/homepage', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    // Merge with existing content
    homepageContent = {
      ...homepageContent,
      ...content
    };

    console.log(`✅ Homepage content updated by ${req.admin?.email}`);

    res.json({
      success: true,
      message: 'Homepage content updated successfully',
      content: homepageContent
    });
  } catch (error) {
    console.error('❌ Error updating homepage content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update homepage content'
    });
  }
});

// Upload single image
router.post('/upload', authenticateAdmin, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    console.log(`📷 Image uploaded: ${req.file.filename} by ${req.admin?.email}`);

    res.json({
      success: true,
      image: {
        url: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image'
    });
  }
});

// Upload multiple images
router.post('/upload/multiple', authenticateAdmin, upload.array('images', 10), async (req: AuthRequest, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const uploadedImages = files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    console.log(`📷 ${files.length} images uploaded by ${req.admin?.email}`);

    res.json({
      success: true,
      images: uploadedImages,
      message: `${files.length} images uploaded successfully`
    });
  } catch (error) {
    console.error('❌ Error uploading images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload images'
    });
  }
});

// Get all uploaded images
router.get('/images', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    // Mock images list - in real app, scan uploads directory
    const images = [
      {
        id: '1',
        filename: 'hero-bg-123456.jpg',
        url: '/uploads/hero-bg-123456.jpg',
        originalName: 'hero-background.jpg',
        size: 1024000,
        mimetype: 'image/jpeg',
        uploadedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        filename: 'company-logo-789012.png',
        url: '/uploads/company-logo-789012.png',
        originalName: 'spotify-logo.png',
        size: 512000,
        mimetype: 'image/png',
        uploadedAt: '2024-01-14T14:30:00Z'
      }
    ];

    res.json({
      success: true,
      images,
      total: images.length
    });
  } catch (error) {
    console.error('❌ Error fetching images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch images'
    });
  }
});

// Delete image
router.delete('/images/:filename', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { filename } = req.params;
    
    // In real app, delete file from filesystem
    console.log(`🗑️ Image deleted: ${filename} by ${req.admin?.email}`);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete image'
    });
  }
});

export default router;