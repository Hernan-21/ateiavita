import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
} from "@react-email/components";
import * as React from "react";

export const Day3Grammar = () => {
    return (
        <Html>
            <Head />
            <Preview>Consejo de gramática para ti</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Consejo de Gramática del Día 3</Heading>
                    <Text style={text}>
                        ¿Sabías que la consistencia es clave? Aquí tienes un pequeño consejo para mejorar tu gramática hoy:
                    </Text>
                    <Text style={tip}>
                        "Recuerda siempre revisar la concordancia entre sujeto y verbo. ¡Los pequeños detalles hacen la diferencia!"
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default Day3Grammar;

const main = {
    backgroundColor: "#ffffff",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
};

const h1 = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
};

const text = {
    color: "#555",
    fontSize: "16px",
    lineHeight: "26px",
    textAlign: "center" as const,
};

const tip = {
    backgroundColor: "#e6f7ff",
    padding: "15px",
    borderRadius: "5px",
    color: "#0050b3",
    fontSize: "18px",
    fontStyle: "italic",
    textAlign: "center" as const,
    margin: "20px",
};
