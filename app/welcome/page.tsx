"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useState } from "react"

const languages = [
    { code: "en", label: "English", flag: "🇨🇦" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "it", label: "Italiano", flag: "🇮🇹" },
    { code: "pt", label: "Português", flag: "🇧🇷" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
]

const translations: Record<string, {
    welcome: string
    imNew: string
    login: string
    areYouTeacher: string
    teacherLogin: string
    help: string
}> = {
    en: {
        welcome: "Welcome",
        imNew: "✨ I'm new",
        login: "Login",
        areYouTeacher: "Are you a teacher?",
        teacherLogin: "Log in",
        help: "Help in other languages"
    },
    fr: {
        welcome: "Bienvenue",
        imNew: "✨ Je suis nouveau",
        login: "Connexion",
        areYouTeacher: "Êtes-vous enseignant ?",
        teacherLogin: "S'identifier",
        help: "Aide dans d'autres langues"
    },
    es: {
        welcome: "Bienvenido",
        imNew: "✨ Soy nuevo",
        login: "Entrar",
        areYouTeacher: "¿Eres profesor?",
        teacherLogin: "Iniciar sesión",
        help: "Ayuda en otros idiomas"
    },
    ja: {
        welcome: "ようこそ",
        imNew: "✨ はじめての方",
        login: "ログイン",
        areYouTeacher: "先生ですか？",
        teacherLogin: "ログイン",
        help: "他の言語でのヘルプ"
    },
    de: {
        welcome: "Willkommen",
        imNew: "✨ Ich bin neu",
        login: "Anmelden",
        areYouTeacher: "Sind Sie Lehrer?",
        teacherLogin: "Anmelden",
        help: "Hilfe in anderen Sprachen"
    },
    it: {
        welcome: "Benvenuto",
        imNew: "✨ Sono nuovo",
        login: "Accedi",
        areYouTeacher: "Sei un insegnante?",
        teacherLogin: "Accedi",
        help: "Aiuto in altre lingue"
    },
    pt: {
        welcome: "Bem-vindo",
        imNew: "✨ Sou novo",
        login: "Entrar",
        areYouTeacher: "Você é professor?",
        teacherLogin: "Entrar",
        help: "Ajuda em outros idiomas"
    },
    ko: {
        welcome: "환영합니다",
        imNew: "✨ 처음입니다",
        login: "로그인",
        areYouTeacher: "선생님이신가요?",
        teacherLogin: "로그인",
        help: "다른 언어로 도움말"
    },
    zh: {
        welcome: "欢迎",
        imNew: "✨ 我是新用户",
        login: "登录",
        areYouTeacher: "你是老师吗？",
        teacherLogin: "登录",
        help: "其他语言帮助"
    },
    ru: {
        welcome: "Добро пожаловать",
        imNew: "✨ Я новичок",
        login: "Войти",
        areYouTeacher: "Вы учитель?",
        teacherLogin: "Войти",
        help: "Помощь на других языках"
    }
}

export default function WelcomePage() {
    const [currentLang, setCurrentLang] = useState("en")
    const t = translations[currentLang]

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Simple Header */}
            <header className="border-b border-gray-100 py-4">
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8">
                            <span className="text-2xl">💡</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-800 tracking-tight">ANNA</span>
                    </Link>
                    <div className="text-sm text-gray-600">
                        {t.areYouTeacher} <Link href="/login" className="underline hover:text-gray-900">{t.teacherLogin}</Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
                <div className="text-center mb-8">
                    <div className="relative inline-block mb-4">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-4xl">👋</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.welcome}</h1>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <Link href="/register" className="flex-1">
                        <button className="w-full py-4 px-6 bg-[#A5B4FC] hover:bg-[#818CF8] text-white rounded-lg shadow-sm font-bold text-lg flex items-center justify-center gap-2 transition-colors">
                            {t.imNew}
                        </button>
                    </Link>

                    <Link href="/login" className="flex-1">
                        <button className="w-full py-4 px-6 bg-[#FCD34D] hover:bg-[#fbbf24] text-gray-900 rounded-lg shadow-sm font-bold text-lg flex items-center justify-center gap-2 transition-colors">
                            {t.login} <ArrowRight className="h-5 w-5" />
                        </button>
                    </Link>
                </div>
            </main>

            <footer className="py-8 text-center text-gray-500 text-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span>{t.help}</span>
                    <span className="w-4 h-4 rounded-full bg-gray-200 text-xs flex items-center justify-center">?</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2 text-xs max-w-2xl mx-auto px-4">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setCurrentLang(lang.code)}
                            className={`px-2 py-1 rounded border flex items-center gap-1 transition-colors ${currentLang === lang.code
                                ? "bg-blue-50 border-blue-200 text-blue-700 font-medium"
                                : "bg-white border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                        </button>
                    ))}
                </div>
            </footer>
        </div>
    )
}
