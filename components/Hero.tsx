import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ArrowRight, Globe, Star } from "lucide-react"

export function Hero() {
    return (
        <div className="relative overflow-hidden bg-background pt-16 pb-32 lg:pt-24 lg:pb-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                        <div className="space-y-4">
                            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                                Nueva plataforma 2024
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-foreground">
                                Aprende Ruso. <br />
                                <span className="text-primary">Conecta con el Mundo.</span>
                            </h1>
                            <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl leading-relaxed">
                                La primera plataforma diseñada específicamente para latinos.
                                Inmersión cultural, gramática fácil y una comunidad vibrante te esperan.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="gap-2 group">
                                Empezar Gratis
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button size="lg" variant="outline">
                                Ver Planes
                            </Button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex -space-x-2">
                                <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-background" />
                                <div className="h-8 w-8 rounded-full bg-slate-300 border-2 border-background" />
                                <div className="h-8 w-8 rounded-full bg-slate-400 border-2 border-background" />
                            </div>
                            <p>+10k estudiantes activos</p>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
                        {/* Abstract Decorative Background */}
                        <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-primary/20 blur-3xl opacity-50 animate-pulse"></div>
                        <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-secondary/20 blur-3xl opacity-50"></div>

                        {/* Main Visual Card */}
                        <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="text-xs font-mono text-muted-foreground">Ruso Básico I</div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-background border shadow-sm">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Globe className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Vocabulario Diario</h3>
                                        <p className="text-sm text-muted-foreground">Aprendiendo a saludar</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="ml-auto text-primary">Iniciar</Button>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-background border shadow-sm">
                                    <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                                        <Star className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">Alfabeto Cirílico</h3>
                                        <p className="text-sm text-muted-foreground">Domina las letras hoy</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="ml-auto text-secondary">Iniciar</Button>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t flex justify-between items-center">
                                <div className="text-sm font-medium">Progreso Semanal</div>
                                <div className="text-primary font-bold">85%</div>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-secondary/10">
                                <div className="h-2 w-[85%] rounded-full bg-gradient-to-r from-primary to-accent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
