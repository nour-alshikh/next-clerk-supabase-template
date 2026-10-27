import { Body, Button, Container, Head, Heading, Html, Preview, Text } from "react-email";

// Preview while editing: `npm run email:dev`. Inline styles only: email clients ignore stylesheets.
export default function WelcomeEmail({
  name = "there",
  appName = "Next Template",
  url = "http://localhost:3000/dashboard",
}: {
  name?: string;
  appName?: string;
  url?: string;
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to {appName}</Preview>
      <Body style={{ backgroundColor: "#f6f7f9", fontFamily: "Rubik, Helvetica, Arial, sans-serif" }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: 8, margin: "40px auto", padding: 32, maxWidth: 480 }}>
          <Heading style={{ fontSize: 22, margin: "0 0 16px" }}>Welcome, {name}!</Heading>
          <Text style={{ fontSize: 15, lineHeight: "24px", color: "#3f3f46" }}>
            Thanks for signing up to {appName}. Your account is ready.
          </Text>
          <Button
            href={url}
            style={{ backgroundColor: "#18181b", borderRadius: 6, color: "#ffffff", fontSize: 14, padding: "10px 18px" }}
          >
            Open dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
