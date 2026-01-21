import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faLinkedin,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { colorConfig, getThemeColor } from '../utils/colors';

export default function Footer({ theme = 'light' }) {
  const isDark = theme === 'dark';

  const bgTheme = getThemeColor(theme, colorConfig.background);
  const textTheme = getThemeColor(theme, colorConfig.text);
  const footerBgClass = bgTheme.card || '';
  const footerBorderClass = colorConfig.border[theme] || '';
  const footerTextClass = textTheme.secondary || '';
  const linkColorClass = getThemeColor(theme, colorConfig.link) || '';
  const socialLinkClass = textTheme.muted || '';

  const socialLinks = [
    {
      icon: faGithub,
      href: 'https://github.com/notvenu',
      label: 'GitHub',
      gradient: 'from-gray-700 via-gray-900 to-black',
    },
    {
      icon: faLinkedin,
      href: 'https://linkedin.com/in/venu-kasibhatla',
      label: 'LinkedIn',
      gradient: 'from-[#0A66C2] to-[#094799]',
    },
    {
      icon: faInstagram,
      href: 'https://instagram.com/veeennnuuu',
      label: 'Instagram',
      gradient: 'from-pink-500 via-red-500 to-yellow-500',
    },  
  ];

  return (
    <footer 
      className={`w-full border-t transition-colors duration-300 py-6 ${footerBgClass} ${footerBorderClass} ${footerTextClass}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm order-2 sm:order-1">
            Built with ❤️ by{' '}
            <a
              href="https://github.com/notvenu"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium hover:underline transition-colors ${linkColorClass}`}
            >
              Venu K
            </a>
          </p>

          <div className="flex justify-center gap-6 text-xl order-1 sm:order-2">
            {socialLinks.map(({ icon, href, label }) => {
              let base = colorConfig.brand.github.base;
              let hover = colorConfig.brand.github.hoverLight;
              let hoverDark = colorConfig.brand.github.hoverDark;
              if (label === 'LinkedIn') {
                base = colorConfig.brand.linkedin.base;
                hover = colorConfig.brand.linkedin.hover;
                hoverDark = colorConfig.brand.linkedin.hover;
              } else if (label === 'Instagram') {
                base = colorConfig.brand.instagram.base;
                hover = colorConfig.brand.instagram.hover;
                hoverDark = colorConfig.brand.instagram.hover;
              }
              const [isHovered, setIsHovered] = useState(false);
              return (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  aria-label={label}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span
                    style={{
                      color: isHovered ? (isDark ? hoverDark : hover) : base,
                      transition: 'color 0.2s',
                    }}
                    className="text-2xl"
                  >
                    <FontAwesomeIcon icon={icon} />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
