import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

const cookieName = process.env.NODE_ENV === 'production'
  ? '__Secure-authjs.session-token'
  : 'authjs.session-token';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName });
    if (!token) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const joinedClubs = await prisma.clubMember.findMany({
      where: { userId: token.id as string, status: 'APPROVED' },
      include: { club: true },
    });

    const bookmarkedClubs = await prisma.bookmark.findMany({
      where: { userId: token.id as string },
      include: { club: true },
    });

    return NextResponse.json({
      joined: joinedClubs.map(m => m.club),
      bookmarked: bookmarkedClubs.map(b => b.club),
    });
  } catch (err) {
    console.error('[MY CLUBS ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}