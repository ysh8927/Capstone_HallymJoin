import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg3)] flex flex-col">
      {/* Minimal header */}
      <header className="px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">H</span>
          </div>
          <span className="font-serif font-semibold text-sm text-[var(--txt)]">한림 클럽링크</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      <footer className="py-4 text-center text-[11px] text-[var(--txt3)]">
        © 2025 한림대학교 총동아리연합회
      </footer>
    </div>
  );
}
