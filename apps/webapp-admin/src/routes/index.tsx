import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Input, Card } from "@turborepo/ui";
import { saveToken } from "@turborepo/auth";
import { login } from "../lib/api";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email.toLowerCase().includes("admin")) {
        setError(
          'Admin panel requires an admin email (must contain "admin" before @)',
        );
        setIsLoading(false);
        return;
      }

      const response = await login(email);
      saveToken(response.token);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ui-page">
      <div className="login-container">
        <Card
          title="Admin Panel"
          subtitle="Login to manage work orders"
          variant="elevated"
        >
          <form onSubmit={handleSubmit} className="ui-stack ui-stack--gap-md">
            <Input
              label="Email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              required
            />
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Login
            </Button>
          </form>
          <p
            className="ui-text ui-text--secondary ui-text--sm"
            style={{ marginTop: "1rem" }}
          >
            Use an email with "admin" before @ to access admin features
          </p>
        </Card>
      </div>
    </div>
  );
}
