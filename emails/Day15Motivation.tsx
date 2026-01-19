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

export const Day15Motivation = () => {
    return (
        <Html>
            <Head />
            <Preview>¡Sigue así, lo estás logrando!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>15 Días de Aprendizaje 🎉</Heading>
                    <Text style={text}>
                        ¡Felicidades! Has mantenido tu compromiso durante dos semanas. El aprendizaje de idiomas es una maratón, no un sprint.
                    </Text>
                    <Text style={quote}>
                        "El éxito es la suma de pequeños esfuerzos repetidos día tras día."
                    </Text>
                    <Text style={text}>
                        Sigue practicando y verás los resultados. Estamos aquí para apoyarte.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default Day15Motivation;

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

const quote = {
    fontSize: "20px",
    color: "#666",
    fontStyle: "italic",
    textAlign: "center" as const,
    margin: "30px 0",
};
