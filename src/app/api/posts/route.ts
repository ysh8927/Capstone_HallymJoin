import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clubId = searchParams.get('clubId');

    if (!clubId) {
      return NextResponse.json({ error: 'clubId가 필요합니다.' }, { status: 400 });
    }

    const posts = await prisma.post.findMany({
      where: { clubId },
      include: {
        author: { select: { id: true, name: true, studentId: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(posts);
  } catch (err) {
    console.error('[POSTS GET ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { clubId, category, title, body, isPinned } = await req.json();

    if (!clubId || !category || !title || !body) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        clubId,
        authorId: token.id as string,
        category,
        title,
        body,
        isPinned: isPinned ?? false,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error('[POSTS POST ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}