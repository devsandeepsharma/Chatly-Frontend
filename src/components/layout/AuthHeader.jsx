import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Logo from "../ui/Logo";
import { ArrowRight, Logs, X } from "lucide-react";

const AuthHeader = () => {

    const navLinks = [
        { path: "#features", label: "Features" },
        { path: "#testimonials", label: "Testimonials" },
    ]

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
        if (window.innerWidth < 640) {
            setIsOpen(prev => !prev);
        }
    }

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
    }, [isOpen]);

    return (
        <header className="sticky top-0 z-40 h-16 bg-white/70 border-b border-gray-200/80">
            <div className="p-4 w-full max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/">
                    <Logo />
                </Link>
                <nav aria-label="primary navigation">
                    <button
                        onClick={toggle}
                        className="sm:hidden relative z-100 h-8 w-10 rounded bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg flex items-center justify-center"
                        aria-label="Toggle menu"
                    >
                        {
                            isOpen ? <X className="h-8 w-6 text-white" /> : <Logs className="h-8 w-6 text-white" />
                        }
                    </button>
                    {isOpen && (
                        <div
                            className="fixed inset-0 z-40"
                            onClick={toggle}
                        ></div>
                    )}
                    <ul
                        className={`
                            fixed top-0 right-0 h-full w-64 pt-15 bg-white z-50 p-6 flex flex-col gap-2 transform transition-transform duration-300 ease-in-out
                                sm:static sm:h-0 sm:w-auto sm:pt-0 sm:z-0 sm:p-0 sm:flex-row sm:items-center sm:gap-6
                                ${isOpen ? "translate-x-0" : "translate-x-full sm:translate-x-0"
                            }`}
                        >
                        {
                            navLinks.map(({ path, label }) => (
                                <li key={path}>
                                    <a
                                        href={path}
                                        className="block py-2 md:py-0 text-sm text-gray-700 hover:text-[#00BFA6] transition-colors"
                                        onClick={toggle}
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))
                        }
                        <Link to="/auth" onClick={toggle} className="mt-2 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] text-white shadow hover:shadow-lg transition">
                            Get Started <ArrowRight className="h-4 w-4" />
                         </Link>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default AuthHeader;