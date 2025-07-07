import express from 'express';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

// Get all jobs with pagination
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';

    // Mock data - replace with Supabase queries
    const jobs = [
      {
        id: '1',
        title: 'Senior React Developer',
        company: 'Spotify',
        location: 'Stockholm, Sweden',
        country: 'Sweden',
        type: 'full-time',
        salaryMin: 70000,
        salaryMax: 95000,
        currency: 'EUR',
        status: 'active',
        applications: 23,
        createdAt: '2024-01-15',
        technologies: ['React', 'TypeScript', 'Node.js'],
        description: 'Join our team building next-generation music streaming experiences...'
      },
      {
        id: '2',
        title: 'DevOps Engineer',
        company: 'Adyen',
        location: 'Amsterdam, Netherlands',
        country: 'Netherlands',
        type: 'full-time',
        salaryMin: 65000,
        salaryMax: 85000,
        currency: 'EUR',
        status: 'active',
        applications: 15,
        createdAt: '2024-01-10',
        technologies: ['AWS', 'Kubernetes', 'Docker'],
        description: 'Scale payment infrastructure for global merchants...'
      }
    ];

    res.json({
      jobs,
      pagination: {
        page,
        limit,
        total: jobs.length,
        pages: Math.ceil(jobs.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Create new job
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const jobData = req.body;
    // Add job to database
    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      createdAt: new Date().toISOString(),
      status: 'active',
      applications: 0
    };

    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Update job in database
    res.json({ id, ...updates, updatedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    // Delete from database
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// Toggle job status
router.patch('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    res.json({ id, status, updatedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job status' });
  }
});

export default router;