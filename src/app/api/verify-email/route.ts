import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

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
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

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
      subject: '[한림 클럽링크] 이메일 인증 코드',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 16px;">
          <h2 style="color: #4f46e5; margin-bottom: 8px;">한림 클럽링크</h2>
          <p style="color: #374151; margin-bottom: 24px;">아래 인증 코드를 입력해주세요. 코드는 5분간 유효합니다.</p>
          <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5;">${code}</span>
          </div>
          <p style="color: #9ca3af; font-size: 12px;">본인이 요청하지 않은 경우 이 이메일을 무시하세요.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Code sent' });
  } catch (err) {
    console.error('[VERIFY EMAIL ERROR]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code required' }, { status: 400 });
    }

    const result = await prisma.$queryRaw<{ code: string; expires_at: bigint }[]>`
      SELECT code, expires_at FROM verification_codes WHERE email = ${email}
    `;

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'No code found' }, { status: 400 });
    }

    const stored = result[0];

    if (Date.now() > Number(stored.expires_at)) {
      await prisma.$executeRaw`DELETE FROM verification_codes WHERE email = ${email}`;
      return NextResponse.json({ error: 'Code expired' }, { status: 400 });
    }

    if (stored.code !== code) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }

    await prisma.$executeRaw`DELETE FROM verification_codes WHERE email = ${email}`;
    return NextResponse.json({ success: true, message: 'Verified' });
  } catch (err) {
    console.error('[VERIFY CODE ERROR]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}