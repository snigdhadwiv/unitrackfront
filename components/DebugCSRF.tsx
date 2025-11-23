"use client"
import { useEffect } from 'react';
import { getCSRFToken } from '@/lib/utils';

export default function DebugCSRF() {
  useEffect(() => {
    console.log('🔍 CSRF Token:', getCSRFToken());
    console.log('🍪 All Cookies:', document.cookie);
    
    // Check if API service can get token
    const token = getCSRFToken();
    if (!token) {
      console.warn('⚠️ No CSRF token found! Make sure to visit Django admin first or get a token');
    } else {
      console.log('✅ CSRF token found:', token);
    }
  }, []);

  return null;
}