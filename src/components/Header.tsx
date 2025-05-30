'use client';

import Link from 'next/link';

const Header = () => {
  return (
    <>
      <header className="fixed top-0 w-full bg-[#1a1a1a]/90 backdrop-blur-md z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              ENGRAM
            </Link>
          </div>
          <div className="flex items-center">
            <a
              href="http://github.com/kuberwastaken/engram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300"
            >
              GitHub
            </a>
          </div>
        </nav>
      </header>
      <div className="mt-16 text-center text-lg text-[#a1a1a1] py-4 mb-8">
        The centralized, No BS Open-Source hub for IP University Material
      </div>
    </>
  );
};

export default Header;
