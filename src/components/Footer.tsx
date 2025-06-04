'use client';

import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

export default function Footer() {
  const { toggleTheme } = useContext(ThemeContext);

    return (
        <footer>
            <SunIcon
                className="w-6 h-6 primary-900 cursor-pointer"
                onClick={toggleTheme} 
            />
            <MoonIcon className="w-6 h-6 text-gray-400 cursor-pointer" />
        </footer>
    );
}
