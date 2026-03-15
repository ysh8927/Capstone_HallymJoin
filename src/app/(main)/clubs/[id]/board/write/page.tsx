import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CLUBS } from '@/data/clubs';
import WriteForm from '@/components/board/WriteForm';

interface Props { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return CLUBS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const club = CLUBS.find((c) => c.id === id);
  return { title: club ? `글 작성 — ${club.name}` : '글 작성' };
}

export default async function WritePostPage({ params }: Props) {
  const { id } = await params;
  const club = CLUBS.find((c) => c.id === id);
  if (!club) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[var(--txt3)] mb-5">
        <Link href="/clubs" className="hover:text-[var(--txt2)] transition-colors">동아리</Link>
        <span>/</span>
        <Link href={`/clubs/${club.id}`} className="hover:text-[var(--txt2)] transition-colors">{club.name}</Link>
        <span>/</span>
        <span className="text-[var(--txt2)] font-medium">게시글 작성</span>
      </div>

      {/* Back link */}
      <Link
        href={`/clubs/${club.id}`}
        className="inline-flex items-center gap-1.5 text-xs text-[var(--txt2)] hover:text-[var(--txt)] mb-5 transition-colors"
      >
        <ArrowLeft size={13} />
        {club.name} 게시판으로 돌아가기
      </Link>

      <WriteForm clubId={club.id} clubName={club.name} />
    </div>
  );
}
