import React from 'react';
import { colorConfig, getThemeColor } from '../utils/colors';

export default function FacultyRanker({ theme = 'light' }) {
  const isDark = theme === 'dark';
  const bgTheme = getThemeColor(theme, colorConfig.background);
  const textTheme = getThemeColor(theme, colorConfig.text);

  return (
    <div className={`min-h-screen pt-20 pb-24 transition-colors ${bgTheme.page} ${textTheme.primary}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`p-8 rounded-2xl text-center ${
          isDark 
            ? 'bg-gray-800/50 backdrop-blur-sm' 
            : 'bg-white shadow-xl'
        }`}>
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className={`text-4xl font-bold text-[${colorConfig.primary.main}]`}>
                Faculty Ranker
              </h1>
              <p className={`text-xl ${textTheme.secondary}`}>
                Rate and review your professors
              </p>
            </div>

            <div className="py-16">
              <div className="space-y-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
                  <div className={`text-4xl ${textTheme.muted}`}>
                    🔧
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold">Coming Soon</h2>
                  <p className={`text-lg ${textTheme.secondary} max-w-2xl mx-auto`}>
                    We're working hard to bring you a comprehensive faculty rating system. 
                    Soon you'll be able to rate professors, read reviews, and make informed decisions about your courses.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="text-2xl mb-2">⭐</div>
                    <h3 className="font-medium mb-1">Rate Professors</h3>
                    <p className={`text-sm ${textTheme.muted}`}>
                      Share your experience and help fellow students
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="text-2xl mb-2">📝</div>
                    <h3 className="font-medium mb-1">Read Reviews</h3>
                    <p className={`text-sm ${textTheme.muted}`}>
                      Get insights from other students' experiences
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="font-medium mb-1">Make Informed Choices</h3>
                    <p className={`text-sm ${textTheme.muted}`}>
                      Choose courses based on comprehensive ratings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-300 dark:border-gray-700">
              <p className={`${textTheme.muted}`}>
                Want to be notified when Faculty Ranker launches? 
                <br />
                <span className="font-medium">Stay tuned for updates!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}