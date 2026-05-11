import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

const cookieName = process.env.NODE_ENV === 'production'
  ? '__Secure-authjs.session-token'
  : 'authjs.session-token';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName });
    if (!token) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { id: clubId, userId } = await params;
    const { status } = await req.json();

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: '유효하지 않은 상태입니다.' }, { status: 400 });
    }

    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { name: true },
    });

    if (!club) {
      return NextResponse.json({ error: '동아리를 찾을 수 없습니다.' }, { status: 404 });
    }

    const membership = await prisma.clubMember.update({
      where: { userId_clubId: { userId, clubId } },
      data: { status },
    });

    const message = status === 'APPROVED'
      ? `${club.name} 동아리 가입이 승인되었습니다!`
      : `${club.name} 동아리 가입이 거절되었습니다.`;

    await prisma.notification.create({
      data: { userId, type: 'JOIN_APPROVED', message, clubId },
    });

    return NextResponse.json(membership);
  } catch (err) {
    console.error('[MEMBER PATCH ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}