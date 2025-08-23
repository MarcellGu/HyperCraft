import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

// 定义不需要重定向的路径
const publicPaths = ['/auth/login', '/auth/signup']

export function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl

    // 如果访问根路径，重定向到登录页面
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // 检查是否为公共路径
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    // 如果不是公共路径，可以根据需要添加身份验证逻辑
    // 这里只是一个示例，实际应用中你可能需要检查认证状态
    if (!isPublicPath) {
        // 示例：如果需要身份验证但未登录，重定向到登录页面
        // 这里需要根据你的认证逻辑来实现
        // if (!isLoggedIn) {
        //   return NextResponse.redirect(new URL('/auth/login', request.url))
        // }
    }

    return NextResponse.next()
}

// 配置匹配器，只对特定路径应用中间件
export const config = {
    matcher: [
        '/',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
