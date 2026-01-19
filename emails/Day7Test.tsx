import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
} from "@react-email/components";
import * as React from "react";

export const Day7Test = () => {
    return (
        <Html>
            <Head />
            <Preview>¡Hora de poner a prueba tus conocimientos!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Llevas una semana aprendiendo 🚀</Heading>
                    <Text style={text}>
                        Ha pasado una semana desde que te uniste. Es el momento perfecto para ver cuánto has avanzado.
                    </Text>
                    <Link href="https://hernan-21-ateiavita.vercel.app/student/dashboard" style={button}>
                        Tomar Test de Nivel
                    </Link>
                </Container>
            </Body>
        </Html>
    );
};

export default Day7Test;

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

const button = {
    backgroundColor: "#28a745",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "200px",
    padding: "12px",
    margin: "20px auto",
};
