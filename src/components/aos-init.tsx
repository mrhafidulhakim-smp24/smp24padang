'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AOSInit() {
    useEffect(() => {
        setTimeout(() => {
            AOS.init({
                duration: 800,
                once: true,
            });
        }, 100);
    }, []);
    return null;
}
