import { NextResponse } from 'next/server'

/**
 * I prototipi /lab (noindex, non produzione) restano raggiungibili in dev e
 * nei preview, ma vengono chiusi (404) sul deploy di PRODUZIONE così non sono
 * pubblici al lancio. Su Vercel VERCEL_ENV vale 'production' solo sul dominio.
 */
export function middleware() {
  if (process.env.VERCEL_ENV === 'production') {
    return new NextResponse(null, { status: 404 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/lab/:path*',
}
