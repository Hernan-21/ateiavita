import Link from "next/link"
import { Send } from "lucide-react"

export function Footer() {
    return (
        <footer className="relative pt-24 overflow-hidden bg-white">
            {/* Dashed Flight Path Decoration */}
            <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none">
                <svg className="w-full h-32 text-gray-400" preserveAspectRatio="none" viewBox="0 0 1440 100">
                    <path
                        d="M-100,80 C200,80 400,20 600,50 S1000,90 1540,10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="8 8"
                        className="opacity-40"
                    />
                </svg>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative pb-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Paper Planes */}
                    <div className="absolute left-10 top-0 transform -rotate-12 text-yellow-500">
                        <Send className="h-10 w-10 fill-yellow-400 stroke-yellow-600" />
                    </div>
                    <div className="absolute right-10 top-10 transform rotate-12 text-yellow-500">
                        <Send className="h-8 w-8 fill-yellow-400 stroke-yellow-600" />
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-gray-600">
                        <Link href="#" className="flex items-center gap-2 hover:text-primary">
                            <span className="h-4 w-4">📄</span> Terms of Use
                        </Link>
                        <Link href="#" className="flex items-center gap-2 hover:text-primary">
                            <span className="h-4 w-4">🛡️</span> Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>

            {/* Yellow Bottom Bar */}
            <div className="bg-[#FFD600] py-6 text-center text-sm font-medium text-gray-800">
                © 2025 Privet LatAm. All rights reserved.
            </div>
        </footer>
    )
}
