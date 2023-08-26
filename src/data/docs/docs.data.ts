import { readFile } from "fs/promises"

import matter from "gray-matter"
import { z } from "zod"

type Project = {
  id: string
  repo: string
}

export type Docs = NonNullable<Awaited<ReturnType<typeof getDocs>>>

const projects: Project[] = [{ id: "devtools", repo: "kevinwolfcr/devtools" }]

const projectConfigSchema = z.object({
  title: z.string(),
  menus: z.array(
    z.object({
      href: z.string(),
      label: z.string(),
      items: z.array(z.object({ href: z.string(), label: z.string(), file: z.string() })),
    }),
  ),
})

const pageMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  imgSrc: z.string().optional(),
  imgAlt: z.string().optional(),
})

export async function getDocs(projectId: string) {
  const project = projects.find((project) => project.id === projectId)
  if (!project) return null

  const getFile = async (url: URL) => {
    try {
      if (process.env.LOCAL_DOCS) return await readFile(url, { encoding: "utf-8" })
      const request = await fetch(url)
      return await request.text()
    } catch (err) {
      throw new Error(`Error fetching ${url.toString()}`)
    }
  }

  const baseUrl = new URL(
    process.env.LOCAL_DOCS
      ? `file://${process.env.LOCAL_DOCS}/${project.repo}/docs/`
      : `https://raw.githubusercontent.com/${project.repo}/main/docs/`,
  )

  const configUrl = new URL("./config.json", baseUrl)
  const config = projectConfigSchema.parse(JSON.parse(await getFile(configUrl)))

  const pages: Record<string, { url: string; meta: z.infer<typeof pageMetaSchema>; content: string }> = {}

  for (const menu of config.menus) {
    for (const item of menu.items) {
      const url = new URL(item.file, configUrl)
      const { data, content } = matter(await getFile(url))

      pages[menu.href.concat(item.href).replace(/^\//, "")] = {
        url: url.toString(),
        meta: pageMetaSchema.parse(data),
        content,
      }
    }
  }

  return {
    ...project,
    ...config,
    pages,
  }
}
