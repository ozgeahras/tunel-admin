'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useLanguage, LANGUAGE_OPTIONS, Language } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './auth/LoginModal';

export default function Navigation() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/jobs', label: t.nav.jobs },
    { href: '/companies', label: t.nav.companies },
    ...(user ? [
      user.type === 'individual' 
        ? { href: '/my-applications', label: 'My Applications' }
        : { href: '/dashboard', label: 'Dashboard' },
      ...(user.type === 'individual' ? [{ href: '/profile', label: t.nav.profile }] : [])
    ] : []),
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Tunel
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language Selector & Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <span>{LANGUAGE_OPTIONS.find(opt => opt.code === language)?.flag}</span>
                <span>{LANGUAGE_OPTIONS.find(opt => opt.code === language)?.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.code}
                      onClick={() => {
                        setLanguage(option.code as Language);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                        language === option.code ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                      }`}
                    >
                      <span>{option.flag}</span>
                      <span>{option.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      {user.type === 'individual' ? '👤 My Profile' : '🏢 Company Profile'}
                    </Link>
                    {user.type === 'company' ? (
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        📊 Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/my-applications"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        📋 My Applications
                      </Link>
                    )}
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      ⚙️ Settings
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  {t.nav.register}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </nav>
  );
}