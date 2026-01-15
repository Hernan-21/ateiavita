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
        <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex items-center justify-center w-8 h-8">
                            <span className="text-2xl">💡</span>
                        </div>
                        <span className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                            ANNA
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/student/courses" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
                            <MonitorPlay className="h-4 w-4" />
                            Courses
                        </Link>
                        <FeedbackNotification />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="hidden md:flex items-center gap-2 p-2 transition-colors">
                            <UserMenu user={user} />
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="default" size="sm">
                                Iniciar Sesión
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
