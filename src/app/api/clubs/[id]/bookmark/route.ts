import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

// 북마크 추가
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { id: clubId } = await params;

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_clubId: {
          userId: token.id as string,
          clubId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: '이미 북마크에 추가되었습니다.' }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: token.id as string,
        clubId,
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (err) {
    console.error('[BOOKMARK POST ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 북마크 삭제
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { id: clubId } = await params;

    await prisma.bookmark.delete({
      where: {
        userId_clubId: {
          userId: token.id as string,
          clubId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[BOOKMARK DELETE ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}