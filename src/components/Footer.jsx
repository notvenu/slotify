export default function Footer() {
    return (
        <>
        <div className="max-w-2xl mx-auto text-center text-sm text-gray-700 dark:text-black/80 px-4">
                <p className="mb-3 transition-colors">
                  Built with ❤️ by{" "}
                  <a
                    href="https://github.com/notvenu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-900 dark:text-gray-900 hover:underline transition-colors"
                  >
                    Venu K
                  </a>
                </p>
                <div className="flex justify-center gap-6">
                  <a
                    href="https://github.com/notvenu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/venu-kasibhatla"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="mailto:venu.kasibhatla@gmail.com"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Email
                  </a>
                </div>
        </div>
        </>
    )
}