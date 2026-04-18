import 'dotenv/config';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { id: postId } = await params;
    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: '댓글 내용을 입력해주세요.' }, { status: 400 });
    }

    // 게시글 정보 조회 (작성자 확인용)
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, title: true },
    });

    if (!post) {
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 댓글 생성
    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: token.id as string,
        text,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    // 본인 게시글이 아닐 때만 알림 생성
    if (post.authorId !== token.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: 'COMMENT',
          message: `${comment.author.name}님이 "${post.title}" 게시글에 댓글을 달았습니다.`,
          postId,
        },
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    console.error('[COMMENT POST ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}