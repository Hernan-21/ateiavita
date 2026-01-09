"use client";

import { useStudio } from "./studio-context";
import { FileUpload } from "@/components/ui/file-upload";

export function PropertyPanel() {
    const { state, updateUnit } = useStudio();

    // Only show Unit Properties logic. Task properties are now inline.

    return (
        <div className="p-6 space-y-8">
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">Unit Resources</h3>

                {/* Class Guide PDF */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <FileUpload
                        label="Student Guide (PDF)"
                        accept="application/pdf"
                        currentUrl={state.currentUnit.pdfUrl}
                        onUploadComplete={(url) => updateUnit({ pdfUrl: url })}
                    />
                    <p className="text-xs text-blue-600 mt-2 leading-relaxed">
                        Upload a PDF guide (e.g. Workbook, Grammar Sheet).
                        Students will see a download button in their course view.
                    </p>
                </div>
            </div>
        </div>
    )
}
