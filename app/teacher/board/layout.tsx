
import { StudioNavbar } from "@/components/studio/studio-navbar";

export default function BoardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white">
            <StudioNavbar />
            {children}
        </div>
    );
}
