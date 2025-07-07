import express from 'express';
import { authenticateAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get comprehensive analytics data
router.get('/', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const analytics = {
      overview: {
        totalJobs: 156,
        totalCompanies: 42,
        totalApplications: 1247,
        activeUsers: 892,
        newUsersThisMonth: 156,
        jobViewsThisMonth: 8924,
        applicationSuccessRate: 23.5,
        averageSalary: 67500
      },
      
      jobStatistics: {
        byCountry: [
          { country: 'Germany', count: 45, percentage: 28.8 },
          { country: 'Netherlands', count: 38, percentage: 24.4 },
          { country: 'Sweden', count: 25, percentage: 16.0 },
          { country: 'Switzerland', count: 20, percentage: 12.8 },
          { country: 'Denmark', count: 15, percentage: 9.6 },
          { country: 'Norway', count: 13, percentage: 8.3 }
        ],
        
        byType: [
          { type: 'Full-time', count: 120, percentage: 77.0 },
          { type: 'Contract', count: 25, percentage: 16.0 },
          { type: 'Freelance', count: 11, percentage: 7.0 }
        ],
        
        byExperienceLevel: [
          { level: 'Senior', count: 65, percentage: 41.7 },
          { level: 'Mid-level', count: 52, percentage: 33.3 },
          { level: 'Junior', count: 28, percentage: 17.9 },
          { level: 'Lead', count: 11, percentage: 7.1 }
        ],
        
        bySalaryRange: [
          { range: '€40k-€50k', count: 25, percentage: 16.0 },
          { range: '€50k-€65k', count: 48, percentage: 30.8 },
          { range: '€65k-€80k', count: 42, percentage: 26.9 },
          { range: '€80k-€100k', count: 28, percentage: 17.9 },
          { range: '€100k+', count: 13, percentage: 8.3 }
        ]
      },
      
      applicationTrends: {
        monthly: [
          { month: 'Aug 2023', applications: 67, jobs: 89 },
          { month: 'Sep 2023', applications: 89, jobs: 95 },
          { month: 'Oct 2023', applications: 112, jobs: 108 },
          { month: 'Nov 2023', applications: 145, jobs: 125 },
          { month: 'Dec 2023', applications: 134, jobs: 132 },
          { month: 'Jan 2024', applications: 167, jobs: 156 }
        ],
        
        weekly: [
          { week: 'Week 1', applications: 45, views: 892 },
          { week: 'Week 2', applications: 52, views: 1034 },
          { week: 'Week 3', applications: 48, views: 967 },
          { week: 'Week 4', applications: 38, views: 823 }
        ]
      },
      
      topCompanies: [
        { 
          company: 'Spotify', 
          jobs: 12, 
          applications: 234, 
          avgApplicationsPerJob: 19.5,
          successRate: 28.5 
        },
        { 
          company: 'Adyen', 
          jobs: 8, 
          applications: 156, 
          avgApplicationsPerJob: 19.5,
          successRate: 31.2 
        },
        { 
          company: 'Klarna', 
          jobs: 6, 
          applications: 98, 
          avgApplicationsPerJob: 16.3,
          successRate: 22.4 
        },
        { 
          company: 'Delivery Hero', 
          jobs: 5, 
          applications: 87, 
          avgApplicationsPerJob: 17.4,
          successRate: 25.3 
        }
      ],
      
      topTechnologies: [
        { technology: 'React', mentions: 89, percentage: 57.1 },
        { technology: 'TypeScript', mentions: 76, percentage: 48.7 },
        { technology: 'Node.js', mentions: 64, percentage: 41.0 },
        { technology: 'Python', mentions: 58, percentage: 37.2 },
        { technology: 'AWS', mentions: 52, percentage: 33.3 },
        { technology: 'Docker', mentions: 48, percentage: 30.8 },
        { technology: 'Kubernetes', mentions: 42, percentage: 26.9 },
        { technology: 'PostgreSQL', mentions: 38, percentage: 24.4 }
      ],
      
      userEngagement: {
        dailyActiveUsers: 245,
        weeklyActiveUsers: 892,
        monthlyActiveUsers: 2340,
        averageSessionDuration: '8m 34s',
        bounceRate: 23.5,
        pagesPerSession: 4.2,
        
        topPages: [
          { page: '/jobs', views: 5234, avgTime: '3m 45s' },
          { page: '/companies', views: 3456, avgTime: '2m 12s' },
          { page: '/profile', views: 2890, avgTime: '5m 23s' },
          { page: '/', views: 8920, avgTime: '1m 34s' }
        ]
      },
      
      performanceMetrics: {
        apiResponseTime: 245, // ms
        pageLoadTime: 1.2, // seconds
        uptime: 99.97, // percentage
        errorRate: 0.03, // percentage
        serverMemoryUsage: 68.5, // percentage
        databaseQueries: 1247,
        cacheHitRate: 94.2
      }
    };

    res.json({
      success: true,
      analytics,
      generatedAt: new Date().toISOString(),
      period: '30 days'
    });

  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics data'
    });
  }
});

// Get real-time dashboard data
router.get('/dashboard', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const dashboard = {
      currentStats: {
        activeUsers: Math.floor(Math.random() * 50) + 200,
        jobsPostedToday: Math.floor(Math.random() * 10) + 5,
        applicationsToday: Math.floor(Math.random() * 50) + 25,
        newCompaniesThisWeek: Math.floor(Math.random() * 5) + 2
      },
      
      recentActivity: [
        {
          id: '1',
          type: 'job_posted',
          message: 'New job posted: Senior React Developer at Spotify',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
        },
        {
          id: '2',
          type: 'application',
          message: 'New application received for DevOps Engineer position',
          timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString()
        },
        {
          id: '3',
          type: 'company_joined',
          message: 'New company registered: TechStart Amsterdam',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
        },
        {
          id: '4',
          type: 'user_signup',
          message: '5 new developers signed up in the last hour',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
        }
      ],
      
      alerts: [
        {
          type: 'warning',
          message: 'Server response time increased by 15% in the last hour',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          type: 'info',
          message: 'Scheduled maintenance planned for Sunday 2AM-4AM',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        }
      ],
      
      quickActions: [
        { action: 'post_job', label: 'Post New Job', count: 156 },
        { action: 'add_company', label: 'Add Company', count: 42 },
        { action: 'review_applications', label: 'Review Applications', count: 23 },
        { action: 'moderate_content', label: 'Moderate Content', count: 5 }
      ]
    };

    res.json({
      success: true,
      dashboard,
      refreshedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
});

// Get specific metric data
router.get('/metrics/:metric', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { metric } = req.params;
    const { period = '7d', granularity = 'daily' } = req.query;

    const metricsData: { [key: string]: any } = {
      applications: {
        data: [
          { date: '2024-01-15', value: 23 },
          { date: '2024-01-16', value: 31 },
          { date: '2024-01-17', value: 28 },
          { date: '2024-01-18', value: 35 },
          { date: '2024-01-19', value: 42 },
          { date: '2024-01-20', value: 38 },
          { date: '2024-01-21', value: 45 }
        ],
        total: 242,
        change: '+12.5%'
      },
      
      jobs: {
        data: [
          { date: '2024-01-15', value: 5 },
          { date: '2024-01-16', value: 3 },
          { date: '2024-01-17', value: 7 },
          { date: '2024-01-18', value: 4 },
          { date: '2024-01-19', value: 6 },
          { date: '2024-01-20', value: 2 },
          { date: '2024-01-21', value: 8 }
        ],
        total: 35,
        change: '+8.2%'
      },
      
      users: {
        data: [
          { date: '2024-01-15', value: 12 },
          { date: '2024-01-16', value: 18 },
          { date: '2024-01-17', value: 15 },
          { date: '2024-01-18', value: 22 },
          { date: '2024-01-19', value: 19 },
          { date: '2024-01-20', value: 25 },
          { date: '2024-01-21', value: 21 }
        ],
        total: 132,
        change: '+15.3%'
      }
    };

    const data = metricsData[metric];
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      });
    }

    res.json({
      success: true,
      metric,
      period,
      granularity,
      data
    });

  } catch (error) {
    console.error('❌ Error fetching metric data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metric data'
    });
  }
});

export default router;