import type { NextRequest } from "next/server"

import { NextResponse } from "next/server"

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
}

export function middleware(req: NextRequest) {
  const parts = req.headers.get("host")!.replace(/:\d+$/, ".local").split(".")
  const docsProject = parts.length === 3 ? parts[0] : null
  if (docsProject) {
    return NextResponse.rewrite(new URL(`/docs/${docsProject}${req.nextUrl.pathname}`, req.url))
  }
}
