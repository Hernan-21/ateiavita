import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Menu, MessageSquare, MonitorPlay } from "lucide-react"
import { auth } from "@/auth"
import { SignIn } from "@/components/auth/auth-buttons"
import { UserMenu } from "@/components/layout/UserMenu"
import { FeedbackNotification } from "@/components/student/feedback-notification"

export async function Navbar() {
    const session = await auth()
    const user = session?.user

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/50 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-500 transition-transform group-hover:scale-110">
                            <span className="text-xl">💡</span>
                        </div>
                        <span className="font-serif text-2xl font-bold tracking-tight text-slate-900">
                            ANNA
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/student/courses" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                            <MonitorPlay className="h-4 w-4" />
                            Courses
                        </Link>
                        <FeedbackNotification />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <UserMenu user={user} />
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm">
                                Iniciar Sesión
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
