import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function WelcomePage() {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Simple Header */}
            <header className="border-b border-gray-100 py-4">
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8">
                            <span className="text-2xl">💡</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-800 tracking-tight">ANNA</span>
                    </Link>
                    <div className="text-sm text-gray-600">
                        Are you a teacher? <Link href="/login" className="underline hover:text-gray-900">Log in</Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
                <div className="text-center mb-8">
                    <div className="relative inline-block mb-4">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-4xl">👋</span>
                        </div>
                        {/* Chat bubble tail effect purely css or graphic, skipping for now */}
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome</h1>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <Link href="#" className="flex-1">
                        <button className="w-full py-4 px-6 bg-[#A5B4FC] hover:bg-[#818CF8] text-white rounded-lg shadow-sm font-bold text-lg flex items-center justify-center gap-2 transition-colors">
                            ✨ I'm new
                        </button>
                    </Link>

                    <Link href="/login" className="flex-1">
                        <button className="w-full py-4 px-6 bg-[#FCD34D] hover:bg-[#fbbf24] text-gray-900 rounded-lg shadow-sm font-bold text-lg flex items-center justify-center gap-2 transition-colors">
                            Login <ArrowRight className="h-5 w-5" />
                        </button>
                    </Link>
                </div>
            </main>

            <footer className="py-8 text-center text-gray-500 text-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span>Help in other languages</span>
                    <span className="w-4 h-4 rounded-full bg-gray-200 text-xs flex items-center justify-center">?</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200 flex items-center gap-1">🇨🇦 English</span>
                    <span className="px-2 py-1 bg-white rounded border border-gray-200 flex items-center gap-1">🇫🇷 Français</span>
                    <span className="px-2 py-1 bg-white rounded border border-gray-200 flex items-center gap-1">🇯🇵 日本語</span>
                    <span className="px-2 py-1 bg-white rounded border border-gray-200 flex items-center gap-1">🇪🇸 Español</span>
                    {/* ... more langs */}
                </div>
            </footer>
        </div>
    )
}
