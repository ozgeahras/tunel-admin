import express from 'express';
import { authenticateAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Mock companies data
let mockCompanies = [
  {
    id: '1',
    name: 'Spotify',
    slug: 'spotify',
    logo: '/logos/spotify.png',
    website: 'https://spotify.com',
    country: 'Sweden',
    city: 'Stockholm',
    employees: '6000+',
    foundedYear: 2006,
    industry: 'Music Streaming',
    description: 'The world\'s most popular audio streaming subscription service with millions of tracks and podcasts.',
    culture: 'Innovative, collaborative, and music-focused environment with strong emphasis on creativity.',
    benefits: [
      'Visa sponsorship for international talent',
      'Flexible working arrangements',
      'Comprehensive health insurance',
      'Stock options and equity participation',
      'Learning and development budget',
      'Wellness programs and mental health support'
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'Python', 'Kafka', 'Kubernetes'],
    activeJobs: 12,
    totalApplications: 234,
    status: 'active',
    featured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Adyen',
    slug: 'adyen',
    logo: '/logos/adyen.png',
    website: 'https://adyen.com',
    country: 'Netherlands',
    city: 'Amsterdam',
    employees: '3000+',
    foundedYear: 2006,
    industry: 'Financial Technology',
    description: 'The payments platform of choice for many of the world\'s leading companies, providing modern payment solutions.',
    culture: 'Fast-paced, international environment focused on innovation and technical excellence.',
    benefits: [
      'Full visa sponsorship and relocation support',
      'Competitive salary and bonus structure',
      'International career opportunities',
      'Learning budget for professional development',
      'Health and wellness programs',
      'Flexible working policies'
    ],
    techStack: ['Java', 'Python', 'AWS', 'Kubernetes', 'Docker', 'Kafka'],
    activeJobs: 8,
    totalApplications: 156,
    status: 'active',
    featured: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '3',
    name: 'Klarna',
    slug: 'klarna',
    logo: '/logos/klarna.png',
    website: 'https://klarna.com',
    country: 'Sweden',
    city: 'Stockholm',
    employees: '4000+',
    foundedYear: 2005,
    industry: 'Financial Technology',
    description: 'Leading global retail bank, payments and shopping service provider.',
    culture: 'Bold, diverse, and inclusive culture with focus on innovation and customer experience.',
    benefits: [
      'Visa sponsorship available',
      'Flexible working arrangements',
      'Parental leave and family support',
      'Health and wellness benefits',
      'Professional development opportunities',
      'Equity participation'
    ],
    techStack: ['Python', 'React', 'PostgreSQL', 'AWS', 'Docker', 'Microservices'],
    activeJobs: 6,
    totalApplications: 98,
    status: 'active',
    featured: false,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-08T09:15:00Z'
  }
];

// Get all companies with filtering and pagination
router.get('/', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const country = req.query.country as string;
    const industry = req.query.industry as string;
    const featured = req.query.featured as string;

    let filteredCompanies = [...mockCompanies];

    // Apply filters
    if (search) {
      filteredCompanies = filteredCompanies.filter(company => 
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.city.toLowerCase().includes(search.toLowerCase()) ||
        company.industry.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (country) {
      filteredCompanies = filteredCompanies.filter(company => company.country === country);
    }

    if (industry) {
      filteredCompanies = filteredCompanies.filter(company => company.industry === industry);
    }

    if (featured !== undefined) {
      filteredCompanies = filteredCompanies.filter(company => 
        company.featured === (featured === 'true')
      );
    }

    // Sort by name
    filteredCompanies.sort((a, b) => a.name.localeCompare(b.name));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

    res.json({
      success: true,
      companies: paginatedCompanies,
      pagination: {
        page,
        limit,
        total: filteredCompanies.length,
        pages: Math.ceil(filteredCompanies.length / limit),
        hasNext: endIndex < filteredCompanies.length,
        hasPrev: page > 1
      },
      stats: {
        totalCompanies: mockCompanies.length,
        featuredCompanies: mockCompanies.filter(c => c.featured).length,
        activeCompanies: mockCompanies.filter(c => c.status === 'active').length
      }
    });
  } catch (error) {
    console.error('❌ Error fetching companies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch companies'
    });
  }
});

// Get single company by ID
router.get('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const company = mockCompanies.find(c => c.id === id);

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    res.json({
      success: true,
      company
    });
  } catch (error) {
    console.error('❌ Error fetching company:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch company'
    });
  }
});

// Create new company
router.post('/', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const companyData = req.body;
    
    // Validation
    const requiredFields = ['name', 'country', 'city', 'industry', 'description'];
    const missingFields = requiredFields.filter(field => !companyData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields
      });
    }

    // Check for duplicate company name
    const existingCompany = mockCompanies.find(c => 
      c.name.toLowerCase() === companyData.name.toLowerCase()
    );

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        error: 'Company with this name already exists'
      });
    }

    const newCompany = {
      id: (mockCompanies.length + 1).toString(),
      slug: companyData.name.toLowerCase().replace(/\s+/g, '-'),
      ...companyData,
      activeJobs: 0,
      totalApplications: 0,
      status: companyData.status || 'active',
      featured: companyData.featured || false,
      techStack: companyData.techStack || [],
      benefits: companyData.benefits || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockCompanies.push(newCompany);

    console.log(`✅ Company created: ${newCompany.name} by ${req.admin?.email}`);

    res.status(201).json({
      success: true,
      company: newCompany,
      message: 'Company created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating company:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create company'
    });
  }
});

// Update company
router.put('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const companyIndex = mockCompanies.findIndex(c => c.id === id);
    
    if (companyIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    // Update slug if name changed
    if (updates.name && updates.name !== mockCompanies[companyIndex].name) {
      updates.slug = updates.name.toLowerCase().replace(/\s+/g, '-');
    }

    const updatedCompany = {
      ...mockCompanies[companyIndex],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    mockCompanies[companyIndex] = updatedCompany;

    console.log(`✅ Company updated: ${updatedCompany.name} by ${req.admin?.email}`);

    res.json({
      success: true,
      company: updatedCompany,
      message: 'Company updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating company:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update company'
    });
  }
});

// Delete company
router.delete('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const companyIndex = mockCompanies.findIndex(c => c.id === id);
    
    if (companyIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    const deletedCompany = mockCompanies[companyIndex];
    mockCompanies.splice(companyIndex, 1);

    console.log(`🗑️ Company deleted: ${deletedCompany.name} by ${req.admin?.email}`);

    res.json({
      success: true,
      message: 'Company deleted successfully',
      deletedCompany: {
        id: deletedCompany.id,
        name: deletedCompany.name
      }
    });
  } catch (error) {
    console.error('❌ Error deleting company:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete company'
    });
  }
});

// Toggle company featured status
router.patch('/:id/featured', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;
    
    const companyIndex = mockCompanies.findIndex(c => c.id === id);
    
    if (companyIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    mockCompanies[companyIndex].featured = featured;
    mockCompanies[companyIndex].updatedAt = new Date().toISOString();

    console.log(`⭐ Company featured status changed: ${mockCompanies[companyIndex].name} → ${featured} by ${req.admin?.email}`);

    res.json({
      success: true,
      company: mockCompanies[companyIndex],
      message: `Company ${featured ? 'featured' : 'unfeatured'} successfully`
    });
  } catch (error) {
    console.error('❌ Error updating company featured status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update company featured status'
    });
  }
});

export default router;