import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ClassPageClient } from "@/components/classes/class-client"

export default function ClassPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />
            <ClassPageClient />
            <Footer />
        </div>
    )
}
