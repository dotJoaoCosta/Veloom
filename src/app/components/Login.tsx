import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Shield, Store, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("user");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (activeTab === "user") {
      // User login
      if (email === "maria.costa@email.com" && password === "maria123") {
        localStorage.setItem("userAuth", "true");
        navigate("/home");
      } else {
        setError("Credenciais inválidas");
      }
    } else if (activeTab === "admin") {
      // Admin login
      if (email === "admin@veloom.pt" && password === "admin123") {
        localStorage.setItem("adminAuth", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Credenciais inválidas");
      }
    } else if (activeTab === "partner") {
      // Partner login
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500 p-4 rounded-full mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Veloom</h1>
          <p className="text-gray-600 text-sm mt-2">Acesso à Plataforma</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Utilizador
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </TabsTrigger>
            <TabsTrigger value="partner" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Parceiro
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleLogin} className="space-y-4">
            <TabsContent value="user" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  placeholder="o seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <Input
                  type="password"
                  placeholder="a sua palavra-passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  placeholder="o seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <Input
                  type="password"
                  placeholder="a sua palavra-passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

            </TabsContent>

            <TabsContent value="partner" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input
                  type="email"
                  placeholder="o seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <Input
                  type="password"
                  placeholder="a sua palavra-passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

            </TabsContent>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600">
              Entrar
            </Button>
          </form>
        </Tabs>

      </Card>
    </div>
  );
}
