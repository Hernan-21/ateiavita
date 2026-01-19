import Link from "next/link"
import { Send } from "lucide-react"

export function Footer() {
    return (
        <footer className="relative mt-auto w-full bg-amber-400 border-t-4 border-amber-500">
            {/* Decorative wave border */}
            <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
                <svg className="absolute w-full h-full" viewBox="0 0 1200 40" preserveAspectRatio="none" style={{
                    transform: 'translateY(-50%)'
                }}>
                    <path d="M0,20 Q300,0 600,20 T1200,20 L1200,40 L0,40 Z" fill="white" opacity="0.1" />
                </svg>
            </div>

            <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left side - Decorative megaphone */}
                    <div className="hidden md:block">
                        <Send className="h-8 w-8 text-amber-600 opacity-50" />
                    </div>

                    {/* Center - Links and Copyright */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-6 text-sm">
                            <Link href="#" className="font-medium text-amber-900 hover:text-amber-950 transition-colors flex items-center gap-1.5">
                                <Send className="h-3.5 w-3.5" />
                                Terms of Use
                            </Link>
                            <span className="text-amber-700">•</span>
                            <Link href="#" className="font-medium text-amber-900 hover:text-amber-950 transition-colors flex items-center gap-1.5">
                                <span className="inline-block w-3.5 h-3.5 rounded-full bg-amber-600"></span>
                                Privacy Policy
                            </Link>
                        </div>
                        <p className="text-sm font-medium text-amber-900">
                            © 2025 Privet LatAm. All rights reserved.
                        </p>
                    </div>

                    {/* Right side - Decorative megaphone */}
                    <div className="hidden md:block">
                        <Send className="h-8 w-8 text-amber-600 opacity-50 scale-x-[-1]" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
