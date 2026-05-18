import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1e3a5f] text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-bold mb-3">
              SATTA<span className="text-amber-400">RESULT</span>
            </h3>
            <p className="text-sm leading-relaxed">
              Your trusted source for live daily results and historical chart
              records. Get instant updates for Gali, Desawar, Ghaziabad,
              Faridabad and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/charts" className="hover:text-white transition-colors">
                  Chart Records
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Satta Result. All rights reserved.</p>
          <p className="mt-1 text-xs text-gray-400">
            This website is for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
