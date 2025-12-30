"use client";

import { PDFPayload } from "@/types/content";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PDFEngine({ data }: { data: PDFPayload }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 gap-4">
            <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-500">
                <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">PDF Resource</h3>

            {data.fileUrl ? (
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => window.open(data.fileUrl, '_blank')}>
                        Open PDF
                    </Button>
                    {data.allowDownload && (
                        <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4 text-gray-500" />
                        </Button>
                    )}
                </div>
            ) : (
                <p className="text-sm text-gray-400">No file uploaded yet.</p>
            )}
        </div>
    )
}
