import { useNavigate } from "react-router";
import { Bike, Shield, Store } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function PortalSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Veloom Platform</h1>
          <p className="text-gray-600">Escolha o portal de acesso</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User App */}
          <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate("/login")}>
            <div className="bg-emerald-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Bike className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">App de Utilizador</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Acesso para utilizadores finais da plataforma Veloom
            </p>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
              Aceder
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              maria.costa@email.com / maria123
            </p>
          </Card>

          {/* Admin Portal */}
          <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate("/login")}>
            <div className="bg-blue-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">Painel de Admin</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Dashboard executivo com KPIs da plataforma
            </p>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              Aceder
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              admin@veloom.pt / admin123
            </p>
          </Card>

          {/* Partner Portal */}
          <Card className="p-8 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate("/login")}>
            <div className="bg-purple-500 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Store className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">Portal de Parceiros</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Métricas e performance para parceiros comerciais
            </p>
            <Button className="w-full bg-purple-500 hover:bg-purple-600">
              Aceder
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">
              partner@forumaveiro.pt / partner123
            </p>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Demo Version · Veloom Platform 2026
          </p>
        </div>
      </div>
    </div>
  );
}
