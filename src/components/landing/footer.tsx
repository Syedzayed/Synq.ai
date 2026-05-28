"use client";

import Link from "next/link";

const footerLinks = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy", "Terms", "Security"],
};

export function Footer() {
  return (
    <footer
      className="relative py-16 px-6"
      style={{ borderTop: "1px solid #ede8e0" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group" aria-label="Synq home">
              <span
                className="h-7 w-7 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, #e07a5f, #f4a261)" }}
              >
                <span className="text-white font-bold text-[11px]">S</span>
              </span>
              <span
                className="font-bold text-[16px]"
                style={{ color: "#1e1a17", letterSpacing: "-0.02em" }}
              >
                Synq
              </span>
            </Link>
            <p
              className="text-[13px] leading-relaxed max-w-[210px]"
              style={{ color: "#b8b2aa" }}
            >
              Find people who move like you. AI-powered networking for ambitious
              people.
            </p>
            <p className="mt-4 text-[11px]" style={{ color: "#c8c2ba" }}>
              Powered by Mistral AI
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p
                className="text-[10.5px] font-bold uppercase tracking-[0.18em] mb-4"
                style={{ color: "#c8c2ba" }}
              >
                {group}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] font-medium transition-colors duration-200 hover:text-[#3a3530]"
                      style={{ color: "#9e9890" }}
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
        <div
          className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid #ede8e0" }}
        >
          <p className="text-[12px]" style={{ color: "#c8c2ba" }}>
            &copy; {new Date().getFullYear()} Synq, Inc. All rights reserved.
          </p>
          <p className="text-[12px]" style={{ color: "#d4cec8" }}>
            Built with intention &middot; Designed to connect
          </p>
        </div>
      </div>
    </footer>
  );
}
