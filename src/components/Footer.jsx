import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faLinkedin,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Footer({ theme = 'light' }) {
  const baseText = theme === 'dark' ? 'text-gray-300' : 'text-gray-800';
  const iconText = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const linkText = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';

  return (
    <div className={`max-w-2xl mx-auto text-center text-sm px-4 ${baseText} transition-colors`}>
      <p className="mb-3">
        Built with ❤️ by{' '}
        <a
          href="https://github.com/notvenu"
          target="_blank"
          rel="noopener noreferrer"
          className={`font-medium ${linkText} hover:underline transition-colors`}
        >
          Venu K
        </a>
      </p>

      <div className="flex justify-center gap-6 text-xl">
        <a
          href="https://github.com/notvenu"
          target="_blank"
          rel="noopener noreferrer"
          className={`${iconText} hover:text-blue-600 transition-colors`}
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>

        <a
          href="https://linkedin.com/in/venu-kasibhatla"
          target="_blank"
          rel="noopener noreferrer"
          className={`${iconText} hover:text-blue-600 transition-colors`}
        >
          <FontAwesomeIcon icon={faLinkedin} />
        </a>

        <a
          href="https://instagram.com/veeennnuuu"
          target="_blank"
          rel="noopener noreferrer"
          className={`${iconText} hover:text-pink-500 transition-colors`}
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>

        <a
          href="mailto:venu.kasibhatla@gmail.com"
          className={`${iconText} hover:text-red-500 transition-colors`}
        >
          <FontAwesomeIcon icon={faEnvelope} />
        </a>
      </div>
    </div>
  );
}
