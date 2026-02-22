import { motion } from 'motion/react';
import { LEGAL_CONTENT } from '../constants/legalContent';
import { CONTACT_WHATSAPP, CONTACT_TELEGRAM, CONTACT_EMAIL } from '../constants';

type PageType = 'privacy' | 'terms' | 'returns' | 'refund';

export default function StaticPage({ type }: { type: PageType }) {
  const content = LEGAL_CONTENT[type];

  if (!content) return null;

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-sm border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-gray-100 pb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{content.title}</h1>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                Last Updated: {content.lastUpdated}
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <span className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                Official Document
              </span>
            </div>
          </div>

          <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed">
            <p className="text-lg text-gray-500 mb-12 leading-relaxed italic">
              GrowtifyPro.com is committed to transparency and excellence. Please read our {content.title.toLowerCase()} carefully to understand our practices and your rights.
            </p>

            {content.sections.map((section, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-indigo-600 text-white text-sm rounded-lg flex items-center justify-center mr-4 shrink-0">
                    {index + 1}
                  </span>
                  {section.heading}
                </h2>
                <p className="pl-12 text-gray-600">
                  {section.content}
                </p>
              </div>
            ))}

            <div className="mt-16 p-8 bg-gray-900 rounded-[2rem] text-white">
              <h3 className="text-xl font-bold mb-4">Questions or Concerns?</h3>
              <p className="text-gray-400 mb-6">
                Our legal and support teams are here to help you understand our policies.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="font-bold">{CONTACT_WHATSAPP}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Telegram</p>
                  <p className="font-bold">@{CONTACT_TELEGRAM}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email</p>
                  <p className="font-bold">{CONTACT_EMAIL}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
