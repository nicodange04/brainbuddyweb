import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Verificar autenticación para rutas de admin (EXCEPTO login y forgot-password)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login') &&
      !request.nextUrl.pathname.startsWith('/admin/forgot-password')) {
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Redirigir a login de admin si no está autenticado
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verificar que el usuario tenga rol de admin
    const { data: userData, error } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('usuario_id', user.id)
      .single()

    if (error || !userData || userData.rol !== 'admin') {
      // Redirigir a página de acceso denegado
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match admin routes except login and forgot-password
     */
    '/admin/((?!login|forgot-password).*)',
  ],
}
