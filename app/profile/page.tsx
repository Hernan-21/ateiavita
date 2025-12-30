import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Mail, User, Plus } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const user = session.user

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex-1">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My account</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <User className="h-5 w-5" />
                                    <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="default" className="bg-indigo-500 hover:bg-indigo-600">
                                        Edit profile
                                    </Button>
                                    <Button variant="outline" className="text-indigo-500 border-indigo-500 hover:bg-indigo-50">
                                        Change password
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="mt-1">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Name</p>
                                        <p className="text-lg font-medium text-gray-900">{user.name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="mt-1">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-lg font-medium text-gray-900">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <span className="text-xl">📊</span>
                                    <h2 className="text-lg font-semibold text-gray-900">Active Levels</h2>
                                </div>
                                <Button size="sm" className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Course
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Mock Data for Active Levels */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="text-2xl mb-2">🐟</div>
                                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">L1 Beginner</h3>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="text-2xl mb-2">🐥</div>
                                        <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">In Progress</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">L2 Elementary</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Settings (Mock) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 text-gray-700 mb-6">
                                <Mail className="h-5 w-5" />
                                <h2 className="text-lg font-semibold">Notifications</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">General</p>
                                        <p className="text-sm text-gray-500">Receive email notifications from ANNA</p>
                                    </div>
                                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                                        <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">New Assignments</p>
                                        <p className="text-sm text-gray-500">Receive email notifications for new assignments</p>
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

