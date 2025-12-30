import { StudioNavbar } from "@/components/studio/studio-navbar";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <StudioNavbar />

            {/* Main Content Area */}
            <main>
                {children}
            </main>
        </div>
    );
}
