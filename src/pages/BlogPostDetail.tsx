import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BlogPost } from '../types';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center">Post not found</div>;

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Blog
        </Link>

        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <img
            src={post.image_url || `https://picsum.photos/seed/${post.id}/1200/600`}
            alt={post.title}
            className="w-full aspect-video object-cover"
          />
          
          <div className="p-8 md:p-12">
            <div className="flex items-center space-x-6 text-sm text-gray-400 mb-8">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(post.created_at).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Admin
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">{post.title}</h1>
            
            <div className="prose prose-indigo prose-lg max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
