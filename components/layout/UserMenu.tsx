"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { LogOut, User, ChevronDown, ChevronUp } from "lucide-react"
import { logoutAction } from "@/components/auth/auth-actions"

interface UserMenuProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
}

export function UserMenu({ user }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                {user.image ? (
                    <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-9 w-9 rounded-full ring-2 ring-white shadow-sm object-cover"
                    />
                ) : (
                    <div className="h-9 w-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">
                        {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {user.name?.split(" ")[0]}
                </span>
                {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="p-1">
                        <Link
                            href="/profile"
                            className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            <User className="mr-3 h-4 w-4 text-gray-500 group-hover:text-primary" />
                            My Profile
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <form action={logoutAction} className="w-full">
                            <button
                                type="submit"
                                className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                            >
                                <LogOut className="mr-3 h-4 w-4 text-gray-500 group-hover:text-red-600" />
                                Log out
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
