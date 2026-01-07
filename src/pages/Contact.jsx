import React, { useState } from 'react';
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
              {(() => {
                const [isHovered, setIsHovered] = useState(false);
                return (
                  <a
                    href="mailto:venu.kasibhatla@gmail.com"
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 ${
                      isDark
                        ? 'bg-gray-700/50 hover:bg-gray-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div
                      className="text-2xl"
                      style={{
                        color: isHovered ? colorConfig.brand.gmail.hover : colorConfig.brand.gmail.base,
                        transition: 'color 0.2s',
                      }}
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className={`text-sm ${textTheme.muted}`}>
                    venu.kasibhatla@gmail.com
                  </p>
                </div>
              </a>
                );
              })()}

              {(() => {
                const [isHovered, setIsHovered] = useState(false);
                return (
                  <a
                    href="https://github.com/notvenu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 ${
                      isDark
                        ? 'bg-gray-700/50 hover:bg-gray-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div
                      className="text-2xl"
                      style={{
                        color: isHovered ? (isDark ? colorConfig.brand.github.hoverDark : colorConfig.brand.github.hoverLight) : colorConfig.brand.github.base,
                        transition: 'color 0.2s',
                      }}
                    >
                      <FontAwesomeIcon icon={faGithub} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">GitHub</h3>
                      <p className={`text-sm ${textTheme.muted}`}>
                        @notvenu
                      </p>
                    </div>
                  </a>
                );
              })()}

              {(() => {
                const [isHovered, setIsHovered] = useState(false);
                return (
                  <a
                    href="https://linkedin.com/in/venu-kasibhatla"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 ${
                      isDark
                        ? 'bg-gray-700/50 hover:bg-gray-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div
                      className="text-2xl"
                      style={{
                        color: isHovered ? colorConfig.brand.linkedin.hover : colorConfig.brand.linkedin.base,
                        transition: 'color 0.2s',
                      }}
                    >
                      <FontAwesomeIcon icon={faLinkedin} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">LinkedIn</h3>
                      <p className={`text-sm ${textTheme.muted}`}>
                        Venu Bhargava Jishith Kasibhatla
                      </p>
                    </div>
                  </a>
                );
              })()}

              {(() => {
                const [isHovered, setIsHovered] = useState(false);
                return (
                  <a
                    href="https://instagram.com/veeennnuuu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 ${
                      isDark
                        ? 'bg-gray-700/50 hover:bg-gray-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div
                      className="text-2xl"
                      style={{
                        color: isHovered ? colorConfig.brand.instagram.hover : colorConfig.brand.instagram.base,
                        transition: 'color 0.2s',
                      }}
                    >
                      <FontAwesomeIcon icon={faInstagram} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Instagram</h3>
                      <p className={`text-sm ${textTheme.muted}`}>
                        @veeennnuuu
                      </p>
                    </div>
                  </a>
                );
              })()}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Contribute on GitHub</h2>
              <p className={`text-base mb-6 ${textTheme.secondary}`}>
                Found a bug or have a feature idea? Contribute to the project:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <a
                  href="https://github.com/notvenu/slotify/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 ${
                    isDark 
                      ? 'bg-red-900/30 hover:bg-red-900/50 border border-red-700/50' 
                      : 'bg-red-50 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  <div className="text-2xl text-red-600">
                    <FontAwesomeIcon icon={faGithub} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Report an Issue</h3>
                    <p className={`text-sm ${textTheme.muted}`}>
                      Found a bug? Let us know
                    </p>
                  </div>
                </a>

                <a
                  href="https://github.com/notvenu/slotify/compare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-105 ${
                    isDark 
                      ? `bg-[#0F2854]/30 hover:bg-[#0F2854]/50 border border-[#4988C4]/50` 
                      : `bg-[#BDE8F5]/30 hover:bg-[#BDE8F5]/50 border border-[#4988C4]/50`
                  }`}
                >
                  <div className={`text-2xl ${theme === 'dark' ? 'text-[#4988C4]' : 'text-[#1C4D8D]'}`}>
                    <FontAwesomeIcon icon={faGithub} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Submit a Pull Request</h3>
                    <p className={`text-sm ${textTheme.muted}`}>
                      Got improvements? Submit a PR
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}