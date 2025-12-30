import { loginAction, logoutAction } from "@/components/auth/auth-actions"
import { Button } from "@/components/ui/Button"
import { LogOut } from "lucide-react"

export function SignIn() {
    return (
        <form action={loginAction}>
            <Button variant="default" size="sm">
                Iniciar Sesión
            </Button>
        </form>
    )
}

export function SignOut() {
    return (
        <form action={logoutAction}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
            </Button>
        </form>
    )
}

export function UserAvatar({ user }: { user: any }) {
    return (
        <div className="flex items-center gap-3">
            {user.image ? (
                <img src={user.image} alt={user.name} className="h-8 w-8 rounded-full ring-2 ring-white shadow-sm" />
            ) : (
                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
            )}
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
            </div>
            <SignOut />
        </div>
    )
}
