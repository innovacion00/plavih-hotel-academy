import Link from 'next/link'
import { blogPosts } from '@/lib/data/blog'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artículos sobre educación hotelera, innovación, tecnología y capacitación en el sector turístico.',
}

export default function BlogPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-[#005C7A] to-[#007FA8] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Blog</h1>
          <p className="text-blue-100 max-w-xl">
            Sumérgete en nuestro blog y deja que la inspiración y el conocimiento fluyan. ¡La aventura educativa continúa aquí!
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-44 bg-gradient-to-br from-[#00A9E0] to-[#005C7A] flex items-center justify-center">
                    <span className="text-white text-4xl opacity-30">📚</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium bg-[#E8F7FD] text-[#00A9E0] px-2 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-[#5F6368]">{post.readTime} de lectura</span>
                    </div>
                    <h2 className="font-bold text-[#222222] text-lg leading-snug mb-3 group-hover:text-[#00A9E0] transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-[#5F6368] text-sm leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-[#5F6368]">
                      <span>{post.author}</span>
                      <span>{new Date(post.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
