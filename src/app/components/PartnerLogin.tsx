import { useState } from "react";
import { useNavigate } from "react-router";
import { Store, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

export function PartnerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple mock authentication for different partners
    const validPartners = [
      { email: "partner@forumaveiro.pt", password: "partner123", id: "colombo" },
      { email: "partner@glicinias.pt", password: "partner123", id: "vascogama" },
      { email: "partner@techsolutions.pt", password: "partner123", id: "empresa" },
    ];

    const partner = validPartners.find(
      (p) => p.email === email && p.password === password
    );

    if (partner) {
      localStorage.setItem("partnerAuth", "true");
      localStorage.setItem("partnerId", partner.id);
      localStorage.setItem("partnerEmail", partner.email);
      navigate("/partner/dashboard");
    } else {
      setError("Credenciais inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-500 p-4 rounded-full mb-4">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Portal de Parceiros</h1>
          <p className="text-gray-600 text-sm mt-2">Veloom Business</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="partner@empresa.pt"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            Entrar
          </Button>

        </form>
      </Card>
    </div>
  );
}
