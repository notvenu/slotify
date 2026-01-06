import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faLinkedin,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { colorConfig, getThemeColor } from '../utils/colors';

export default function Footer({ theme = 'light' }) {
  const isDark = theme === 'dark';

  // Centralized color variables from colorConfig
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
    },
    {
      icon: faLinkedin,
      href: 'https://linkedin.com/in/venu-kasibhatla',
      label: 'LinkedIn',
    },
    {
      icon: faInstagram,
      href: 'https://instagram.com/veeennnuuu',
      label: 'Instagram',
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
            {socialLinks.map(({ icon, href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors hover:text-[${colorConfig.primary.main}] ${socialLinkClass}`}
                aria-label={label}
              >
                <FontAwesomeIcon icon={icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
