import express from 'express';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

// Get all companies
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const companies = [
      {
        id: '1',
        name: 'Spotify',
        logo: '/logos/spotify.png',
        country: 'Sweden',
        city: 'Stockholm',
        employees: '6000+',
        description: 'The world\'s most popular audio streaming subscription service',
        website: 'https://spotify.com',
        activeJobs: 12,
        status: 'active',
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        name: 'Adyen',
        logo: '/logos/adyen.png',
        country: 'Netherlands',
        city: 'Amsterdam',
        employees: '3000+',
        description: 'The payments platform of choice for many of the world\'s leading companies',
        website: 'https://adyen.com',
        activeJobs: 8,
        status: 'active',
        createdAt: '2024-01-02'
      }
    ];

    res.json({ companies });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Create company
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const companyData = req.body;
    const newCompany = {
      id: Date.now().toString(),
      ...companyData,
      createdAt: new Date().toISOString(),
      status: 'active',
      activeJobs: 0
    };

    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Update company
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    res.json({ id, ...updates, updatedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// Delete company
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

export default router;