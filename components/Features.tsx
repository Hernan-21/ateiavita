import { Video, Gamepad2, Award } from "lucide-react"

export function Features() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">¿Por qué Privet LatAm?</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Diseñamos una experiencia única que combina tecnología y calidez humana.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/5 border border-border/50 hover:border-primary/20 transition-colors">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm">
                            <Video className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Clases en Vivo</h3>
                        <p className="text-muted-foreground leading-relaxed">Profesores nativos que hablan español y entienden tu cultura. Olvídate de las barreras del idioma.</p>
                    </div>
                    {/* Feature 2 */}
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/5 border border-border/50 hover:border-primary/20 transition-colors">
                        <div className="h-14 w-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent-foreground mb-6 shadow-sm">
                            <Gamepad2 className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Contenido Gamificado</h3>
                        <p className="text-muted-foreground leading-relaxed">Aprende jugando con ejercicios interactivos y retos semanales que te mantendrán motivado.</p>
                    </div>
                    {/* Feature 3 */}
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/5 border border-border/50 hover:border-primary/20 transition-colors">
                        <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 shadow-sm">
                            <Award className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Certificación</h3>
                        <p className="text-muted-foreground leading-relaxed">Recibe certificados oficiales al completar cada nivel, válidos para tu currículum profesional.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
