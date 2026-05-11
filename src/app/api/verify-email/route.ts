import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const verificationCodes = new Map<string, { code: string; expires: number }>();

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
    const expires = Date.now() + 5 * 60 * 1000;
    verificationCodes.set(email, { code, expires });

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

    const stored = verificationCodes.get(email);
    if (!stored) {
      return NextResponse.json({ error: 'No code found' }, { status: 400 });
    }
    if (Date.now() > stored.expires) {
      verificationCodes.delete(email);
      return NextResponse.json({ error: 'Code expired' }, { status: 400 });
    }
    if (stored.code !== code) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }

    verificationCodes.delete(email);
    return NextResponse.json({ success: true, message: 'Verified' });
  } catch (err) {
    console.error('[VERIFY CODE ERROR]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}