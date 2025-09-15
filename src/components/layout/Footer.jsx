import { Link } from "react-router-dom";

import Logo from "../ui/Logo";

const Footer = () => {
    return (
        <footer className="mt-10 border-t border-gray-200/80">
            <div className="p-4 py-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                <Link to="/">
                    <Logo />
                </Link>
                <div className="opacity-80">
                    © {new Date().getFullYear()} Chatly. All rights reserved.
                </div>
                <nav className="flex items-center gap-6" aria-label="footer navigation">
                    <Link href="/" className="hover:text-[#00BFA6]">Terms</Link>
                    <Link href="/" className="hover:text-[#00BFA6]">Privacy</Link>
                    <Link href="/" className="hover:text-[#00BFA6]">Contact</Link>
                </nav>
            </div>
        </footer>
    )
}

export default Footer;