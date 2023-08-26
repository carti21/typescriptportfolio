import type { PackageManager } from "@/components/mdx/package-manager-command"

import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Fragment } from "react"

import { Hero } from "@/components/hero"
import { MDX } from "@/components/mdx"
import { PackageManagerCommandProvider } from "@/components/mdx/package-manager-command"
import { getDocs } from "@/data/docs"
import { mergeMetadata } from "@/utils/seo"

type DocsPageProps = {
  params: { project: string; slug: string[] }
}

export async function generateMetadata({ params: { project, slug = [] } }: DocsPageProps) {
  const docs = await getDocs(project)
  if (!docs) return {}

  const page = docs.pages[slug.join("/")]
  if (!page) return {}

  return mergeMetadata(page.meta)
}

// eslint-disable-next-line @typescript-eslint/require-await
async function handlePackageManagerChange(packageManager: PackageManager) {
  "use server"
  cookies().set("packageManager", packageManager)
}

export default async function DocsPage({ params: { project, slug = [] } }: DocsPageProps) {
  const docs = await getDocs(project)
  if (!docs) notFound()

  const page = docs.pages[slug.join("/")]
  if (!page) notFound()

  return (
    <PackageManagerCommandProvider
      initialValue={(cookies().get("packageManager")?.value || "pnpm") as PackageManager}
      onValueChange={handlePackageManagerChange}
    >
      <article className="flex flex-col gap-6">
        {page.meta.imgSrc && page.meta.imgAlt ? (
          <Hero
            title={page.meta.title}
            subtitle={page.meta.description}
            imgSrc={new URL(page.meta.imgSrc, page.url).toString()}
            imgAlt={page.meta.imgAlt}
          />
        ) : (
          <Fragment>
            <header className="flex flex-col gap-1">
              <h1 className="typography-8 font-bold">{page.meta.title}</h1>
              <p className="typography-4 text-dimmed">{page.meta.description}</p>
            </header>
          </Fragment>
        )}

        <div className="text-dimmed">
          <MDX source={page.content} />
        </div>
      </article>
    </PackageManagerCommandProvider>
  )
}
