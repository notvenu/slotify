import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import {
  faUpload,
  faListCheck,
  faTableList,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { colorConfig, getThemeColor } from '../utils/colors';
import SEO from '../components/SEO';

export default function LandingPage({ theme }) {
  const isDark = theme === "dark";

  // Centralized color configuration via colorConfig
  const bgTheme = getThemeColor(theme, colorConfig.background);
  const textTheme = getThemeColor(theme, colorConfig.text);

  const pageBg = bgTheme.page || '';
  const pageText = textTheme.primary || '';
  const headingGradient = isDark ? 
    `text-[#4988C4]` : 
    `text-[#1C4D8D]`;
  const subtextColor = textTheme.secondary || '';
  const accentColor = isDark ? `text-[${colorConfig.primary.light}]` : `text-[#1C4D8D]`;
  const ctaBg = colorConfig.button.primary[theme === 'dark' ? 'dark' : 'light'] || '';
  const featuresSectionBg = isDark ? 'bg-slate-900' : 'bg-slate-50';
  const featureHeadingColor = isDark ? `text-[${colorConfig.primary.light}]` : `text-[#0F2854]`;
  const featuresDescColor = textTheme.muted || '';
  const featureCardBg = bgTheme.card || '';
  const featureCardBorder = colorConfig.border[theme] || '';
  const featureCardIconBg = isDark ? 'bg-slate-800' : `bg-[#BDE8F5]/30`;
  const featureCardIconColor = isDark ? `text-[${colorConfig.primary.light}]` : `text-[#0F2854]`;
  const featureCardTitleColor = isDark ? `text-[${colorConfig.primary.light}]` : `text-[#1C4D8D]`;
  const featureCardDescColor = textTheme.muted || '';
  const testimonialSectionBg = bgTheme.page || '';
  const testimonialCardBg = bgTheme.card || '';
  const testimonialCardBorder = colorConfig.border[theme] || '';
  const testimonialNameColor = isDark ? `text-[${colorConfig.primary.light}]` : `text-[#4988C4]`;

  return (
    <>
      <SEO 
        title="Slotify - Smart Timetable Scheduler for VIT-AP Students | Course Clash Detection"
        description="Create optimal timetables with intelligent course scheduling, clash detection, and faculty ranking. Perfect for VIT-AP students to build their ideal academic schedule in minutes."
        keywords="VIT-AP, timetable, course scheduler, student planner, academic schedule, course clash detection, faculty ranking, time table generator, VIT Andhra Pradesh"
      />
      <div
        className={`min-h-screen flex flex-col transition-colors duration-500 ${pageBg} ${pageText}`}
      >
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 space-y-8 pt-24">
        <div className="space-y-6 max-w-4xl">
          <h1 className={`text-5xl md:text-7xl font-extrabold leading-tight ${headingGradient}`}>
            Plan Smarter. Stress Less.
          </h1>

          <p className={`text-lg md:text-xl font-medium ${subtextColor}`}>
            <span className={`font-semibold ${accentColor}`}>
              Slotify
            </span>{" "}
            helps you create organized timetables effortlessly — so you can
            focus on learning, not managing.
          </p>

          <div className="flex justify-center">
            <Link
              to="/course-selector"
              className={`group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 ${ctaBg}`}
            >
              Get Started
              <FontAwesomeIcon
                icon={faArrowRight}
                className="transition-transform group-hover:translate-x-2"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`py-20 px-8 md:px-16 ${featuresSectionBg}`}
      >
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 ${featureHeadingColor}`}>
            Everything You Need to Stay on Track
          </h2>
          <p className={featuresDescColor}>
            From uploading your courses to generating your perfect schedule —
            it’s all just a click away.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: faUpload,
              title: "Easy Upload",
              desc: "Upload your course data or use our simple template to start building.",
            },
            {
              icon: faListCheck,
              title: "Smart Selection",
              desc: "Select and manage your courses intuitively — no clashes, no confusion.",
            },
            {
              icon: faTableList,
              title: "Instant Timetable",
              desc: "Generate a clean, color-coded schedule you can download or print instantly.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className={`p-8 rounded-2xl border transition-all hover:-translate-y-2 hover:shadow-lg ${featureCardBg} ${featureCardBorder}`}
            >
              <div className={`inline-flex p-4 rounded-xl mb-6 ${featureCardIconBg}`}>
                <FontAwesomeIcon
                  icon={f.icon}
                  className={`text-3xl ${featureCardIconColor}`}
                />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${featureCardTitleColor}`}>
                {f.title}
              </h3>
              <p className={featureCardDescColor}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className={`py-20 px-8 md:px-16 ${testimonialSectionBg}`}
      >
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 ${featureHeadingColor}`}>
            What Students Say
          </h2>
          <p className={featuresDescColor}>
            Designed by students, refined by experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            {
              name: "Aarav Mehta",
              text: "Finally, a timetable tool that feels natural — everything just clicks.",
            },
            {
              name: "Priya Sharma",
              text: "I used to spend hours arranging my courses. Slotify did it in minutes.",
            },
            {
              name: "Rohit Kumar",
              text: "Smooth design, intuitive layout — and dark mode that’s actually nice.",
            },
          ].map((t, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl text-left border ${testimonialCardBg} ${testimonialCardBorder}`}
            >
              <p className="italic mb-4">“{t.text}”</p>
              <h4 className={`font-semibold ${testimonialNameColor}`}>
                — {t.name}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer is handled globally by App to ensure consistency */}
      </div>
    </>
  );
}
