import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ChevronRight } from 'lucide-react';
import { BlogPost } from '../types';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Stay updated with the latest digital marketing trends, account security tips, and business growth strategies.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl h-96 border border-gray-100" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">No blog posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map(post => (
              <motion.article
                key={post.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
              >
                <Link to={`/blog/${post.slug}`} className="block aspect-video overflow-hidden">
                  <img
                    src={post.image_url || `https://picsum.photos/seed/${post.id}/600/400`}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center space-x-4 text-xs text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      Admin
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 hover:text-indigo-600 transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <div className="mt-auto">
                    <Link to={`/blog/${post.slug}`} className="text-indigo-600 font-bold text-sm flex items-center hover:underline">
                      Read More
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
