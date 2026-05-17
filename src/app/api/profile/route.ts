import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import bcrypt from 'bcryptjs';

const cookieName = process.env.NODE_ENV === 'production'
  ? '__Secure-authjs.session-token'
  : 'authjs.session-token';

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName });
    if (!token) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });

    const { name, department, grade, currentPw, newPw } = await req.json();

    // 비밀번호 변경인 경우
    if (currentPw && newPw) {
      const user = await prisma.user.findUnique({ where: { id: token.id as string } });
      if (!user) return NextResponse.json({ error: '유저를 찾을 수 없습니다.' }, { status: 404 });

      const isValid = await bcrypt.compare(currentPw, user.password);
      if (!isValid) return NextResponse.json({ error: '현재 비밀번호가 올바르지 않습니다.' }, { status: 400 });

      const hashed = await bcrypt.hash(newPw, 12);
      await prisma.user.update({
        where: { id: token.id as string },
        data: { password: hashed },
      });

      return NextResponse.json({ success: true, message: '비밀번호가 변경되었습니다.' });
    }

    // 프로필 변경
    const updated = await prisma.user.update({
      where: { id: token.id as string },
      data: {
        ...(name       && { name }),
        ...(department && { department }),
        ...(grade      && { grade }),
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error('[PROFILE PATCH ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}