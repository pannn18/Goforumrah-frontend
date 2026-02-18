import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export { default } from 'next-auth/middleware'

export const config = { matcher: ['/user/:path*', '/agent/:path*', '/admin/:path*', '/business/hotel/:path*', '/business/car/:path*'] }

export async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const origin = req.nextUrl.origin
  const isUser = token?.role === 'customer'
  const isAgent = token?.role === 'agent'
  const isAdmin = token?.role === 'admin'
  const isBusinessHotelAdmin = token?.role === 'admin-hotel'
  const isBusinessCarAdmin = token?.role === 'admin-car'


  // Customer
  if (req.nextUrl.pathname.startsWith('/user') && !isUser) return NextResponse.redirect(origin)

  // Agent
  if (req.nextUrl.pathname.startsWith('/agent') && !isAgent) return NextResponse.redirect(origin)

  // Administrator
  if (req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login') && !isAdmin) return NextResponse.redirect(origin + '/admin/login')

  // Business Hotel Admin
  if (req.nextUrl.pathname.startsWith('/business/hotel') && !['/business/hotel/login', '/business/hotel/signup', '/business/hotel/forgot-password'].filter((excluded) => req.nextUrl.pathname.startsWith(excluded)).length && !isBusinessHotelAdmin) return NextResponse.redirect(origin + '/business/hotel/login')

  // Business Car Admin
  if (req.nextUrl.pathname.startsWith('/business/car') && !['/business/car/login', '/business/car/signup', '/business/car/forgot-password'].filter((excluded) => req.nextUrl.pathname.startsWith(excluded)).length && !isBusinessCarAdmin) return NextResponse.redirect(origin + '/business/car/login')
}