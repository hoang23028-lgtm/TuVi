'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Lập lá số' },
  { href: '/huong-dan', label: 'Hướng dẫn' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-3 md:px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-red-600 flex items-center justify-center text-white text-sm font-bold shadow">
            命
          </span>
          <span className="font-bold text-gray-800 group-hover:text-amber-700 transition-colors hidden sm:block">
            Tử Vi Đẩu Số Pro
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-amber-100 text-amber-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
