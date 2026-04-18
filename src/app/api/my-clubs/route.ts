import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    // 가입한 동아리 (승인된 것만)
    const joinedClubs = await prisma.clubMember.findMany({
      where: {
        userId: token.id as string,
        status: 'APPROVED',
      },
      include: {
        club: true,
      },
    });

    // 북마크한 동아리
    const bookmarkedClubs = await prisma.bookmark.findMany({
      where: {
        userId: token.id as string,
      },
      include: {
        club: true,
      },
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