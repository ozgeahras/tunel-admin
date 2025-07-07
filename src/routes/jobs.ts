import express from 'express';
import { authenticateAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Mock data - replace with actual database
let mockJobs = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'Spotify',
    companyId: '1',
    location: 'Stockholm',
    country: 'Sweden',
    type: 'full-time',
    salaryMin: 70000,
    salaryMax: 95000,
    currency: 'EUR',
    status: 'active',
    applications: 23,
    views: 156,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    technologies: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    description: 'Join our team building next-generation music streaming experiences. We offer a remote-first culture with visa sponsorship available.',
    requirements: [
      '5+ years React experience',
      'TypeScript proficiency',
      'Experience with state management',
      'API integration skills'
    ],
    benefits: ['Visa sponsorship', 'Remote work', 'Health insurance', 'Stock options']
  },
  {
    id: '2',
    title: 'DevOps Engineer',
    company: 'Adyen',
    companyId: '2',
    location: 'Amsterdam',
    country: 'Netherlands',
    type: 'full-time',
    salaryMin: 65000,
    salaryMax: 85000,
    currency: 'EUR',
    status: 'active',
    applications: 15,
    views: 89,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    technologies: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
    description: 'Scale payment infrastructure for global merchants. Work with cutting-edge cloud technologies and microservices.',
    requirements: [
      '3+ years DevOps experience',
      'AWS/Azure expertise',
      'Kubernetes knowledge',
      'CI/CD pipeline experience'
    ],
    benefits: ['Visa sponsorship', 'Learning budget', 'Flexible hours', 'Relocation support']
  }
];

// Get all jobs with filtering and pagination
router.get('/', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const status = req.query.status as string;
    const country = req.query.country as string;
    const company = req.query.company as string;

    let filteredJobs = [...mockJobs];

    // Apply filters
    if (search) {
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.technologies.some(tech => tech.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (status) {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }

    if (country) {
      filteredJobs = filteredJobs.filter(job => job.country === country);
    }

    if (company) {
      filteredJobs = filteredJobs.filter(job => job.company === company);
    }

    // Sort by created date (newest first)
    filteredJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    res.json({
      success: true,
      jobs: paginatedJobs,
      pagination: {
        page,
        limit,
        total: filteredJobs.length,
        pages: Math.ceil(filteredJobs.length / limit),
        hasNext: endIndex < filteredJobs.length,
        hasPrev: page > 1
      },
      filters: {
        search: search || null,
        status: status || null,
        country: country || null,
        company: company || null
      }
    });
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch jobs' 
    });
  }
});

// Get single job by ID
router.get('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const job = mockJobs.find(j => j.id === id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('❌ Error fetching job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch job'
    });
  }
});

// Create new job
router.post('/', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const jobData = req.body;
    
    // Validation
    const requiredFields = ['title', 'company', 'location', 'country', 'type', 'salaryMin', 'salaryMax'];
    const missingFields = requiredFields.filter(field => !jobData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields
      });
    }

    const newJob = {
      id: (mockJobs.length + 1).toString(),
      ...jobData,
      status: jobData.status || 'active',
      applications: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      technologies: jobData.technologies || [],
      requirements: jobData.requirements || [],
      benefits: jobData.benefits || []
    };

    mockJobs.push(newJob);

    console.log(`✅ Job created: ${newJob.title} by ${req.admin?.email}`);

    res.status(201).json({
      success: true,
      job: newJob,
      message: 'Job created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create job'
    });
  }
});

// Update job
router.put('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const jobIndex = mockJobs.findIndex(j => j.id === id);
    
    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const updatedJob = {
      ...mockJobs[jobIndex],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    mockJobs[jobIndex] = updatedJob;

    console.log(`✅ Job updated: ${updatedJob.title} by ${req.admin?.email}`);

    res.json({
      success: true,
      job: updatedJob,
      message: 'Job updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update job'
    });
  }
});

// Delete job
router.delete('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const jobIndex = mockJobs.findIndex(j => j.id === id);
    
    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const deletedJob = mockJobs[jobIndex];
    mockJobs.splice(jobIndex, 1);

    console.log(`🗑️ Job deleted: ${deletedJob.title} by ${req.admin?.email}`);

    res.json({
      success: true,
      message: 'Job deleted successfully',
      deletedJob: {
        id: deletedJob.id,
        title: deletedJob.title
      }
    });
  } catch (error) {
    console.error('❌ Error deleting job:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete job'
    });
  }
});

// Toggle job status
router.patch('/:id/status', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['active', 'paused', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: active, paused, or closed'
      });
    }

    const jobIndex = mockJobs.findIndex(j => j.id === id);
    
    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    mockJobs[jobIndex].status = status;
    mockJobs[jobIndex].updatedAt = new Date().toISOString();

    console.log(`🔄 Job status changed: ${mockJobs[jobIndex].title} → ${status} by ${req.admin?.email}`);

    res.json({
      success: true,
      job: mockJobs[jobIndex],
      message: `Job status updated to ${status}`
    });
  } catch (error) {
    console.error('❌ Error updating job status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update job status'
    });
  }
});

export default router;