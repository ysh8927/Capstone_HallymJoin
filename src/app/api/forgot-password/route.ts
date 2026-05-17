import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: '이메일이 필요합니다.' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: '가입되지 않은 학번입니다.' }, { status: 404 });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    await prisma.$executeRaw`
      INSERT INTO verification_codes (email, code, expires_at)
      VALUES (${email}, ${code}, ${expiresAt})
      ON CONFLICT (email) DO UPDATE SET code = ${code}, expires_at = ${expiresAt}
    `;

    await transporter.sendMail({
      from: `"한림 클럽링크" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '[한림 클럽링크] 비밀번호 재설정 코드',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 16px;">
          <h2 style="color: #4f46e5; margin-bottom: 8px;">한림 클럽링크</h2>
          <p style="color: #374151; margin-bottom: 24px;">비밀번호 재설정 코드입니다. 코드는 5분간 유효합니다.</p>
          <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5;">${code}</span>
          </div>
          <p style="color: #9ca3af; font-size: 12px;">본인이 요청하지 않은 경우 이 이메일을 무시하세요.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[FORGOT PASSWORD ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 코드 검증만 하고 삭제 안 함
export async function PATCH(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    const result = await prisma.$queryRaw<{ code: string; expires_at: bigint }[]>`
      SELECT code, expires_at FROM verification_codes WHERE email = ${email}
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ error: '인증 코드를 찾을 수 없습니다.' }, { status: 400 });
    }

    const stored = result[0];

    if (Date.now() > Number(stored.expires_at)) {
      await prisma.$executeRaw`DELETE FROM verification_codes WHERE email = ${email}`;
      return NextResponse.json({ error: '인증 코드가 만료되었습니다.' }, { status: 400 });
    }

    if (stored.code !== code) {
      return NextResponse.json({ error: '인증 코드가 올바르지 않습니다.' }, { status: 400 });
    }

    // 삭제하지 않고 검증만 함 (PUT에서 사용)
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[VERIFY RESET CODE ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 비밀번호 변경 후 코드 삭제
export async function PUT(req: NextRequest) {
  try {
    const { email, code, password } = await req.json();

    const result = await prisma.$queryRaw<{ code: string; expires_at: bigint }[]>`
      SELECT code, expires_at FROM verification_codes WHERE email = ${email}
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 400 });
    }

    const stored = result[0];
    if (Date.now() > Number(stored.expires_at) || stored.code !== code) {
      return NextResponse.json({ error: '인증 코드가 유효하지 않습니다.' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    await prisma.$executeRaw`DELETE FROM verification_codes WHERE email = ${email}`;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[RESET PASSWORD ERROR]', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}