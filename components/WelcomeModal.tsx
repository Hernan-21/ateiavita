"use client";

import { useState, useEffect } from "react";
import { Mail, X } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export function WelcomeModal({ isNewUser }: { isNewUser: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const { width, height } = useWindowSize();

    useEffect(() => {
        // Check if user is new AND hasn't seen the modal explicitly stored in local storage
        if (isNewUser) {
            const hasSeen = localStorage.getItem("welcome_modal_seen");
            if (!hasSeen) {
                setIsOpen(true);
            }
        }
    }, [isNewUser]);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("welcome_modal_seen", "true");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Confetti only when open */}
            <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300 border border-gray-100">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={32} />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Bienvenido a ANNA! 🎉</h2>

                <p className="text-gray-600 mb-6 leading-relaxed">
                    Estamos felices de tenerte aquí. Hemos enviado un correo de bienvenida a tu buzón con información importante y tu primer código de curso.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-6 text-sm text-blue-700">
                    📧 Si no lo ves, revisa tu carpeta de <strong>Spam</strong> o <strong>Promociones</strong>.
                </div>

                <button
                    onClick={handleClose}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200"
                >
                    ¡Entendido, gracias!
                </button>
            </div>
        </div>
    );
}
