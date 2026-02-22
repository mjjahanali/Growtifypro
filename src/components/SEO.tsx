import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export default function SEO({ title, description, keywords }: SEOProps) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | GrowtifyPro`;
    }
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || 'Premium digital services and account marketplace.');
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = description || 'Premium digital services and account marketplace.';
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords || 'SMM, Verified Accounts, Business Accounts, Digital Services');
    } else {
      const meta = document.createElement('meta');
      meta.name = "keywords";
      meta.content = keywords || 'SMM, Verified Accounts, Business Accounts, Digital Services';
      document.head.appendChild(meta);
    }

    // Fetch and inject verification tags
    fetch('/api/settings')
      .then(res => res.json())
      .then(settings => {
        if (settings.google_verification) {
          let meta = document.querySelector('meta[name="google-site-verification"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'google-site-verification');
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', settings.google_verification);
        }
        if (settings.bing_verification) {
          let meta = document.querySelector('meta[name="msvalidate.01"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'msvalidate.01');
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', settings.bing_verification);
        }
        if (settings.yandex_verification) {
          let meta = document.querySelector('meta[name="yandex-verification"]');
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'yandex-verification');
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', settings.yandex_verification);
        }
      });
  }, [title, description, keywords]);

  return null;
}
