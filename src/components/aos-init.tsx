'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS CSS

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      // You can customize AOS options here
      duration: 800,
      once: true, // whether animation should happen only once - while scrolling down
    });
  }, []);
  return null; // This component doesn't render anything
}
