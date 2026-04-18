import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  // Auth protection is handled client-side via AuthContext
  // (same as the mobile app approach)
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
