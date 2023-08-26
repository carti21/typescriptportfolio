import type { PackageManager } from "@/components/mdx/package-manager-command"
import type { MDXRemoteProps } from "next-mdx-remote/rsc"

import { IconExternalLink } from "@tabler/icons-react"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypePrettyCode from "rehype-pretty-code"
import { getHighlighter } from "shiki"
import theme from "shiki/themes/min-dark.json"

import { cn } from "@/utils/ui"

import { PackageManagerCommand } from "./package-manager-command"

export type MDXProps = MDXRemoteProps & {
  className?: string
}

export function MDX({ className, components, ...props }: MDXProps) {
  return (
    <div className={cn("text-dimmed [&>*:first-child]:mt-0", className)}>
      <MDXRemote
        {...props}
        options={{
          mdxOptions: {
            rehypePlugins: [
              [
                rehypePrettyCode,
                {
                  keepBackground: false,
                  theme,
                  getHighlighter,
                },
              ],
            ],
          },
        }}
        components={{
          h1: ({ children, ...props }) => (
            <h1 className="typography-8 text-base font-semibold" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="mt-7 border-b border-accent-6 pb-2 typography-7 text-base font-semibold" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="mt-6 typography-6 text-base font-semibold" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="typography-5 text-base font-semibold" {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="typography-4 text-base font-semibold" {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="typography-3 text-base font-semibold" {...props}>
              {children}
            </h6>
          ),
          p: ({ children, ...props }) => (
            <p className="mt-5 typography-3" {...props}>
              {children}
            </p>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-medium text-base" {...props}>
              {children}
            </strong>
          ),
          a: ({ ref, href, children, ...props }) => {
            if (!href) throw new Error("Markdown link didn't receive href")
            const isExternal = href.startsWith("http://") || href.startsWith("https://")
            const Wrapper = isExternal ? "a" : Link

            if (isExternal) {
              Object.assign(props, { target: "_blank", rel: "noopener noreferrer" })
            }

            return (
              <Wrapper
                href={href}
                className="inline-flex items-center gap-1 font-medium text-base hover:text-accent transition-colors"
                {...props}
              >
                {children}
                {isExternal ? <IconExternalLink className="w-[1em] h-[1em]" /> : null}
              </Wrapper>
            )
          },
          ul: ({ children, ...props }) => (
            <ul className="mt-5 pl-[1em] list-disc" {...props}>
              {children}
            </ul>
          ),
          li: ({ children, ...props }) => (
            <li className="mt-1 first:mt-0" {...props}>
              {children}
            </li>
          ),
          pre: ({ children, ...props }) => (
            <pre
              className="mt-5 max-h-[650px] overflow-auto rounded border border-accent-5 bg-accent-3 p-4 [&_code]:typography-2"
              {...props}
            >
              {children}
            </pre>
          ),
          code: (props) => (
            <code className="rounded bg-accent-3 px-[0.3em] py-[0.2em] text-[86%] text-accent" {...props} />
          ),
          PackageManagerCommand: (props: Record<PackageManager, "string">) => (
            <PackageManagerCommand
              content={Object.entries(props).reduce(
                (content, [packageManager, command]) => ({
                  ...content,
                  [packageManager]: <MDX source={["```sh", command, "```"].join("\n")} />,
                }),
                {},
              )}
            />
          ),
          ...components,
        }}
      />
    </div>
  )
}
