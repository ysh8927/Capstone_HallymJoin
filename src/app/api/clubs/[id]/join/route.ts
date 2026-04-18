import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { id: clubId } = await params;

    // 이미 가입 신청했는지 확인
    const existing = await prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId: token.id as string,
          clubId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: '이미 신청하셨습니다.' }, { status: 400 });
    }

    // 가입 신청 생성
    const membership = await prisma.clubMember.create({
      data: {
        userId: token.id as string,
        clubId,
        status: 'PENDING',
      },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch (err) {
    console.error('[CLUB JOIN ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}