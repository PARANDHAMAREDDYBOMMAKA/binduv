import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://groww.in/v1/api/primaries/v1/ipo/open', {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Referer': 'https://www.nseindia.com/'
      },
      cache: 'no-store'
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
