import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Mail, User } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { prisma } from "@/lib/prisma"

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user?.email) {
        redirect("/login")
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            enrollments: {
                include: {
                    class: true
                },
                orderBy: {
                    joinedAt: 'desc'
                }
            }
        }
    });

    const user = session.user

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex-1">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Cuenta</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <User className="h-5 w-5" />
                                    <h2 className="text-lg font-semibold text-gray-900">Perfil</h2>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="default" className="bg-indigo-500 hover:bg-indigo-600">
                                        Editar perfil
                                    </Button>
                                    <Button variant="outline" className="text-indigo-500 border-indigo-500 hover:bg-indigo-50">
                                        Cambiar contraseña
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="mt-1">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Nombre</p>
                                        <p className="text-lg font-medium text-gray-900">{user.name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="mt-1">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Correo</p>
                                        <p className="text-lg font-medium text-gray-900">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-indigo-600">
                                <span className="text-xl">📊</span>
                                <h2 className="text-lg font-semibold text-gray-900">Niveles Activos</h2>
                            </div>
                            {/* Optional: Link to join class if needed, or remove if dashboard is the place */}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dbUser?.enrollments.length === 0 ? (
                                <div className="col-span-full text-center py-6 text-gray-500">
                                    No estás inscrito en ninguna clase activa.
                                </div>
                            ) : (
                                dbUser?.enrollments.map((enrollment) => (
                                    <div key={enrollment.classId} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors group cursor-pointer relative overflow-hidden">
                                        <div className="flex items-start justify-between mb-2 relative z-10">
                                            <div className="text-2xl mb-2 bg-indigo-100 w-10 h-10 flex items-center justify-center rounded-lg">
                                                📚
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                                Activo
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1 relative z-10">
                                            {enrollment.class.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2 relative z-10">
                                            {enrollment.class.description || "Sin descripción"}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Notifications Settings (Mock) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 text-gray-700 mb-6">
                                <Mail className="h-5 w-5" />
                                <h2 className="text-lg font-semibold">Notificaciones</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">General</p>
                                        <p className="text-sm text-gray-500">Recibir notificaciones por correo de ANNA</p>
                                    </div>
                                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">Nuevas Tareas</p>
                                        <p className="text-sm text-gray-500">Recibir correos cuando tengas nuevas tareas</p>
                                    </div>
                                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

