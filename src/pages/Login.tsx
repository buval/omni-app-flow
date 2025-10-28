import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fingerprint } from "lucide-react";
import logo from "@/assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, navigate to welcome
    navigate("/welcome");
  };

  const handleBiometric = () => {
    // Simulate biometric login
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo */}
        <div className="text-center">
          <img src={logo} alt="TravEZ" className="h-16 mx-auto mb-4" />
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => {}}
            >
              Forgot password?
            </button>

            <Button type="submit" className="w-full" size="lg">
              Log In
            </Button>
          </form>

          {/* Biometric Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="glass"
              className="w-full mt-4"
              size="lg"
              onClick={handleBiometric}
            >
              <Fingerprint className="mr-2 h-5 w-5" />
              Use Face or Touch ID to Log In
            </Button>
          </div>

          {/* Create Account */}
          <div className="mt-6 text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => navigate("/welcome")}
            >
              Create a New Account
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © 2023 TravEZ WORLD TRANSIT ADVISORY CORP. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
