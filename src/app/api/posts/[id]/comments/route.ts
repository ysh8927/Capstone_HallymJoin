import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

const cookieName = process.env.NODE_ENV === 'production'
  ? '__Secure-authjs.session-token'
  : 'authjs.session-token';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName });
    if (!token) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { id: postId } = await params;
    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: '댓글 내용을 입력해주세요.' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, title: true },
    });

    if (!post) {
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName });
    if (!token) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { id: postId } = await params;
    const { commentId } = await req.json();

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { likes: { increment: 1 } },
    });

    return NextResponse.json(comment);
  } catch (err) {
    console.error('[COMMENT LIKE ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}