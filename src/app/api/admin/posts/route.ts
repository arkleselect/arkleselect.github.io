import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(req: NextRequest) {
    return NextResponse.json({ message: "Stub for build test" });
}
/*
// Original logic for local use
*/
