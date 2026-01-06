import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faLinkedin,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { colorConfig, getThemeColor } from '../utils/colors';

export default function Contact({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const bgTheme = getThemeColor(theme, colorConfig.background);
  const textTheme = getThemeColor(theme, colorConfig.text);

  return (
    <div className={`min-h-screen pt-20 pb-24 transition-colors ${bgTheme.page} ${textTheme.primary}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`p-8 rounded-2xl ${
          isDark 
            ? 'bg-gray-800/50 backdrop-blur-sm' 
            : 'bg-white shadow-xl'
        }`}>
          <h1 className={`text-3xl font-bold mb-8 text-[${colorConfig.primary.main}]`}>
            Contact Us
          </h1>

          <div className="space-y-8">
            <p className={`text-lg ${textTheme.secondary}`}>
              Have questions or suggestions? Feel free to reach out through any of these channels:
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <a
                href="mailto:venu.kasibhatla@gmail.com"
                className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 ${
                  isDark 
                    ? 'bg-gray-700/50 hover:bg-gray-700' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`text-2xl text-[${colorConfig.primary.main}]`}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className={`text-sm ${textTheme.muted}`}>
                    venu.kasibhatla@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://github.com/notvenu"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 ${
                  isDark 
                    ? 'bg-gray-700/50 hover:bg-gray-700' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`text-2xl text-[${colorConfig.primary.main}]`}>
                  <FontAwesomeIcon icon={faGithub} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">GitHub</h3>
                  <p className={`text-sm ${textTheme.muted}`}>
                    @notvenu
                  </p>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/venu-kasibhatla"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 ${
                  isDark 
                    ? 'bg-gray-700/50 hover:bg-gray-700' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`text-2xl text-[${colorConfig.primary.main}]`}>
                  <FontAwesomeIcon icon={faLinkedin} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">LinkedIn</h3>
                  <p className={`text-sm ${textTheme.muted}`}>
                    Venu Kasibhatla
                  </p>
                </div>
              </a>

              <a
                href="https://instagram.com/veeennnuuu"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 ${
                  isDark 
                    ? 'bg-gray-700/50 hover:bg-gray-700' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`text-2xl text-[${colorConfig.primary.main}]`}>
                  <FontAwesomeIcon icon={faInstagram} />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Instagram</h3>
                  <p className={`text-sm ${textTheme.muted}`}>
                    @veeennnuuu
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}