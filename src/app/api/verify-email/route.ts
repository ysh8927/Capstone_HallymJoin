import { NextRequest, NextResponse } from 'next/server';

const verificationCodes = new Map();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000;
    verificationCodes.set(email, { code, expires });
    console.log(`\n🔐 [CODE] ${email}: ${code}\n`);
    return NextResponse.json({ success: true, message: 'Code sent (check console)' });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}