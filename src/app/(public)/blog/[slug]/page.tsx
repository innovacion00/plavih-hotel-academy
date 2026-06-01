import Link from 'next/link'
import { blogPosts } from '@/lib/data/blog'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  return (
    <div>
      <div className="bg-gradient-to-r from-[#005C7A] to-[#007FA8] text-white py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-1 text-blue-200 text-sm mb-6 hover:text-white transition-colors">
            ← Volver al blog
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">{post.category}</span>
            <span className="text-blue-200 text-xs">{post.readTime} de lectura</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{post.title}</h1>
          <div className="flex items-center gap-2 text-blue-200 text-sm">
            <span>{post.author}</span>
            <span>·</span>
            <span>{new Date(post.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-lg text-[#5F6368] leading-relaxed mb-8 font-medium">{post.excerpt}</p>
        <div className="prose prose-lg prose-slate max-w-none">
          {post.content.trim().split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-[#222222] leading-relaxed mb-5">
              {paragraph.trim()}
            </p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <Link
            href="/cursos"
            className="inline-block bg-[#00A9E0] hover:bg-[#007FA8] text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Explorar cursos relacionados
          </Link>
        </div>
      </article>
    </div>
  )
}
