import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Text,
    Section,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
    userFirstname?: string;
    courseCode?: string;
}

export const WelcomeEmail = ({
    userFirstname = "Estudiante",
    courseCode = "CODIGO-EJEMPLO",
}: WelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>¡Bienvenido a tu viaje de idiomas!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>¡Bienvenido a la plataforma, {userFirstname}!</Heading>
                    <Text style={text}>
                        Estamos emocionados de tenerte aquí. Para empezar, hemos seleccionado tu primer curso.
                    </Text>
                    <Section style={codeBox}>
                        <Text style={codeTitle}>Tu código de curso:</Text>
                        <Text style={codeText}>{courseCode}</Text>
                    </Section>
                    <Text style={text}>
                        Usa este código para unirte a tu primera clase en la plataforma.
                    </Text>
                    <Link href="https://hernan-21-ateiavita.vercel.app" style={button}>
                        Ir a la Plataforma
                    </Link>
                </Container>
            </Body>
        </Html>
    );
};

export default WelcomeEmail;

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
};

const h1 = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    padding: "17px 0 0",
    textAlign: "center" as const,
};

const text = {
    color: "#555",
    fontSize: "16px",
    lineHeight: "26px",
    textAlign: "center" as const,
};

const button = {
    backgroundColor: "#007bff",
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

const codeBox = {
    backgroundColor: "#f4f4f4",
    borderRadius: "5px",
    border: "1px solid #ddd",
    padding: "10px",
    margin: "20px auto",
    textAlign: "center" as const,
    width: "80%",
};

const codeTitle = {
    margin: "0",
    fontWeight: "bold",
    color: "#333",
};

const codeText = {
    margin: "5px 0 0",
    fontSize: "20px",
    letterSpacing: "2px",
    color: "#007bff",
    fontWeight: "bold",
};
