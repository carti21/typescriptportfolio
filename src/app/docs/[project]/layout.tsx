import type { ReactNode } from "react"

import { notFound } from "next/navigation"
import { Fragment } from "react"

import { Main } from "@/components/main"
import { getDocs } from "@/data/docs"
import { mergeMetadata, siteUrl } from "@/utils/seo"

import { DocsNav } from "../_components/docs-nav"

type DocsLayoutProps = {
  params: { project: string }
  children: ReactNode
}

export async function generateMetadata({ params: { project } }: DocsLayoutProps) {
  const docs = await getDocs(project)
  if (!docs) return {}

  const metadataBase = new URL(siteUrl())
  metadataBase.hostname = `${project}.${metadataBase.hostname}`

  return mergeMetadata({
    metadataBase,
    icons: { icon: new URL("/icon", metadataBase) },
    title: { default: docs.title, template: `%s | ${docs.title}` },
    openGraph: {
      images: [
        {
          url: new URL("/opengraph-image", metadataBase),
          alt: `${docs.title} website image`,
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  })
}

export default async function DocsLayout({ params: { project }, children }: DocsLayoutProps) {
  const docs = await getDocs(project)
  if (!docs) notFound()

  return (
    <Fragment>
      <DocsNav docs={docs} />
      <Main className="relative z-20">{children}</Main>
    </Fragment>
  )
}
