import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const acceptHeader = request.headers.get('accept') || ''
  const isHomepage = request.nextUrl.pathname === '/' || request.nextUrl.pathname === ''

  if (isHomepage && acceptHeader.includes('text/markdown')) {
    // Generate a simple markdown representation of the homepage
    const markdownContent = `# TraderAdd | The intelligent trading journal

TraderAdd helps traders journal, review, analyze and improve their trading process with analytics, charts and AI-powered insights.

## Features
- Journaling
- Analytics
- Charts
- AI-powered insights

[Learn more](/features)
`
    return new NextResponse(markdownContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'x-markdown-tokens': '50' // Approximation for now
      }
    })
  }
}

export const config = {
  matcher: '/',
}
