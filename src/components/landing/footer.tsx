import Link from "next/link";

const footerLinks = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy", "Terms", "Security"],
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-16 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-bold text-xs">S</span>
              </span>
              <span className="text-white font-semibold tracking-tight text-[15px]">
                Synq
              </span>
            </Link>
            <p className="text-sm text-white/30 leading-relaxed max-w-[220px]">
              Find people who move like you. AI-powered networking for ambitious
              people.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-4">
                {group}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/40 hover:text-white/70 transition-colors duration-150"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06] pt-8">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} Synq. All rights reserved.
          </p>
          <p className="text-xs text-white/15">
            Built with AI · Powered by Mistral
          </p>
        </div>
      </div>
    </footer>
  );
}
