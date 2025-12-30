"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // useRouter is unused based on code analysis, removing it to be safe
import {
    BookOpen,
    Folder,
    LayoutGrid,
    FileText,
    Users,
    Settings,
    LogOut,
    Search
} from "lucide-react";

export function StudioNavbar() {
    const pathname = usePathname();
    const isBoard = pathname.startsWith('/teacher/board');
    const isStudio = pathname.startsWith('/teacher/studio');

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">

                {/* Left: Brand & Main Nav */}
                <div className="flex items-center gap-8">
                    {/* Brand */}
                    <Link href="/teacher/board" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            P
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">ANNA</span>
                    </Link>

                    {/* Desktop Support Nav */}
                    <div className="hidden md:flex items-center gap-1">

                        {/* Classes Link */}
                        <div className="relative group">
                            <Link
                                href="/teacher/board"
                                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isBoard ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'
                                    }`}
                            >
                                Classes
                            </Link>
                        </div>

                        {/* Materials Link */}
                        <div className="relative">
                            <Link
                                href="/teacher/studio"
                                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isStudio ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'
                                    }`}
                            >
                                Materials
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right: Actions & Profile */}
                <div className="flex items-center gap-4">

                    {/* Search Bar */}
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                    <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                            H
                        </div>
                        <span className="hidden md:inline">Hernan</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
