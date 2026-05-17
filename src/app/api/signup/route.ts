import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { studentId, name, password, grade, department } = await req.json();

    if (!studentId || !name || !password) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 });
    }
    if (!/^\d{8,9}$/.test(studentId)) {
      return NextResponse.json({ error: '올바른 학번 형식이 아닙니다.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: '비밀번호는 8자 이상이어야 합니다.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { studentId } });
    if (existing) {
      return NextResponse.json({ error: '이미 가입된 학번입니다.' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        studentId,
        email:      `${studentId}@hallym.ac.kr`,
        name,
        password:   hashed,
        grade:      grade && grade !== '' ? grade : '1',
        department: department ?? '',
      },
    });

    return NextResponse.json({
      message: '회원가입이 완료되었습니다.',
      userId:  user.id,
    }, { status: 201 });

  } catch (err) {
    console.error('[SIGNUP ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}