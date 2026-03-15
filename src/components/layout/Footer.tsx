export default function Footer() {
  return (
    <footer className="border-t border-[var(--bdr)] bg-[var(--bg)] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">H</span>
              </div>
              <span className="text-sm font-semibold text-[var(--txt)] font-serif">한림 클럽링크</span>
            </div>
            <p className="text-xs text-[var(--txt3)]">한림대학교 동아리 플랫폼 · 캡스톤디자인 2025</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--txt3)]">
            <span>개인정보처리방침</span>
            <span>이용약관</span>
            <span>문의</span>
          </div>
        </div>
        <p className="text-[11px] text-[var(--txt3)] mt-4">
          © 2025 한림대학교 소프트웨어학부. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
