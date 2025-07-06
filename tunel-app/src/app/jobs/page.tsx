'use client';

import { useState, useEffect } from 'react';
import JobCard from '@/components/JobCard';
import { Job, mockJobs, searchJobs, EU_COUNTRIES } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

export default function JobsPage() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const searchCountry = selectedCountry === t.home.allCountries ? 'Tüm Ülkeler' : selectedCountry;
      const filteredJobs = searchJobs(searchQuery, searchCountry);
      setJobs(filteredJobs);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCountry]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const countries = [t.home.allCountries, ...EU_COUNTRIES];
  
  // Initialize selectedCountry with translated value
  useEffect(() => {
    if (!selectedCountry) {
      setSelectedCountry(t.home.allCountries);
    }
  }, [t.home.allCountries, selectedCountry]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.jobs.title}</h1>
          <p className="text-gray-600">
            {t.jobs.subtitle}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t.jobs.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:w-64">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              {t.jobs.filterButton}
            </button>
          </form>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? t.jobs.searching : `${jobs.length} ${t.jobs.resultsFound}`}
            {selectedCountry !== t.home.allCountries && ` (${selectedCountry})`}
            {searchQuery && ` - "${searchQuery}" için`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Job Cards */}
        {!loading && (
          <div className="grid gap-6">
            {jobs.length > 0 ? (
              jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t.jobs.noResults.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t.jobs.noResults.description}
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCountry(t.home.allCountries);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                >
                  {t.jobs.noResults.clearFilters}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}