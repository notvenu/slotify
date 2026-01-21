import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title = "Slotify - Smart Timetable Scheduler for VIT-AP Students",
  description = "Create optimal timetables with intelligent course scheduling, clash detection, and faculty ranking. Perfect for VIT-AP students to build their ideal academic schedule.",
  keywords = "VIT-AP, timetable, course scheduler, student planner, academic schedule",
  canonical = null 
}) => {
  const location = useLocation();
  const baseUrl = 'https://slotify-vitap.vercel.app';
  const currentUrl = `${baseUrl}${location.pathname}`;

  useEffect(() => {
    document.title = title;

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    
    updateCanonicalUrl(canonical || currentUrl);
    
  }, [title, description, keywords, canonical, currentUrl]);

  const updateMetaTag = (name, content, attribute = 'name') => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const updateCanonicalUrl = (url) => {
    let element = document.querySelector('link[rel="canonical"]');
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', 'canonical');
      document.head.appendChild(element);
    }
    element.setAttribute('href', url);
  };

  return null;
};

export default SEO;