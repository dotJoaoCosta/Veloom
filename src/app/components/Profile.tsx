import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

export function Profile() {
  const navigate = useNavigate();
  const [totalTrips, setTotalTrips] = useState(47);
  const [totalDistance, setTotalDistance] = useState(183);

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = JSON.parse(localStorage.getItem("monthlyStats") || "null");
    if (savedStats) {
      setTotalTrips(savedStats.totalTrips + 47);
      setTotalDistance(Math.round(savedStats.totalDistance + 183));
    }
  }, []);

  const menuItems = [
    {
      icon: CreditCard,
      label: "Subscrição",
      description: "Plano Mensal Ativo",
      action: () => navigate("/subscription"),
    },
    {
      icon: Bell,
      label: "Notificações",
      description: "Gerir alertas e avisos",
      action: () => {},
    },
    {
      icon: Shield,
      label: "Privacidade e Segurança",
      description: "Definições da conta",
      action: () => {},
    },
    {
      icon: MapPin,
      label: "Localizações Guardadas",
      description: "3 locais favoritos",
      action: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <div className="p-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate("/home")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-6 pb-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20 border-4 border-white/30">
              <AvatarFallback className="bg-emerald-700 text-white text-2xl">
                MC
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold mb-1">Maria Costa</h1>
              <p className="text-emerald-100">Membro desde Mar 2024</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="p-3 bg-white/10 backdrop-blur border-white/20 text-center">
              <p className="text-2xl font-bold">{totalTrips}</p>
              <p className="text-xs text-emerald-100">Viagens</p>
            </Card>
            <Card className="p-3 bg-white/10 backdrop-blur border-white/20 text-center">
              <p className="text-2xl font-bold">{totalDistance}</p>
              <p className="text-xs text-emerald-100">km totais</p>
            </Card>
            <Card className="p-3 bg-white/10 backdrop-blur border-white/20 text-center">
              <p className="text-2xl font-bold">12h</p>
              <p className="text-xs text-emerald-100">Em viagem</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 -mt-4 relative z-10">
        {/* Personal Info Card */}
        <Card className="p-4 mb-4">
          <h2 className="font-semibold mb-4">Informação Pessoal</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">maria.costa@email.com</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium">+351 912 345 678</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Settings Menu */}
        <Card className="p-2 mb-4">
          {menuItems.map((item, index) => (
            <div key={index}>
              <button
                onClick={item.action}
                className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
              {index < menuItems.length - 1 && <Separator className="my-1" />}
            </div>
          ))}
        </Card>

        {/* Preferences */}
        <Card className="p-4 mb-4">
          <h2 className="font-semibold mb-4">Preferências</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações push</p>
                <p className="text-sm text-gray-500">Receber alertas na app</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertas de bateria</p>
                <p className="text-sm text-gray-500">Avisar quando bateria &lt; 20%</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Partilhar localização</p>
                <p className="text-sm text-gray-500">Para encontrar bikes próximas</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => {
            localStorage.removeItem("userAuth");
            navigate("/login");
          }}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Terminar Sessão
        </Button>

        <p className="text-center text-xs text-gray-500 mt-6">
          Veloom v1.2.0 • Termos de Serviço • Política de Privacidade
        </p>
      </div>
    </div>
  );
}
