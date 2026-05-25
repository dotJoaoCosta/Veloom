import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  CreditCard,
  Check,
  Calendar,
  Bike,
  GraduationCap,
  Building2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

const subscriptionTypes = [
  {
    id: "individual",
    name: "Individual",
    price: "39.00",
    icon: Bike,
    popular: true,
    description: "Acesso completo à rede Veloom",
    features: [
      "Viagens ilimitadas",
      "Acesso a todas as e-bikes",
      "Desbloqueio QR Code e Bluetooth",
      "Mapa em tempo real",
      "Suporte 24/7",
      "Sem permanência mínima",
    ],
    color: "emerald",
  },
  {
    id: "student",
    name: "Estudante",
    price: "31.20",
    originalPrice: "39.00",
    discount: "20%",
    icon: GraduationCap,
    description: "20% desconto para estudantes",
    features: [
      "Todas as vantagens Individual",
      "Desconto de 20%",
      "Verificação com cartão de estudante",
      "Renovação automática enquanto estudante",
    ],
    color: "blue",
  },
  {
    id: "family",
    name: "Familiar",
    price: "39.00",
    icon: Building2,
    description: "Partilha com até 4 pessoas",
    features: [
      "Todas as vantagens Individual",
      "Até 4 membros da família",
      "Gestão centralizada pelo titular",
      "Partilha de histórico familiar",
    ],
    color: "purple",
  },
];

export function Subscription() {
  const navigate = useNavigate();
  const [currentSubscription, setCurrentSubscription] = useState("individual");
  const [totalTrips, setTotalTrips] = useState(47);

  const currentSubData = subscriptionTypes.find((s) => s.id === currentSubscription);

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = JSON.parse(localStorage.getItem("monthlyStats") || "null");
    if (savedStats) {
      setTotalTrips(savedStats.totalTrips + 47);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={() => navigate("/home")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Subscrição</h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Current Subscription */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bike className="h-5 w-5" />
                <Badge className="bg-white/20 text-white border-white/30">
                  Ativa
                </Badge>
              </div>
              <h2 className="text-2xl font-bold mb-1">Subscrição {currentSubData?.name}</h2>
              <p className="text-emerald-100 text-sm">
                Próxima renovação: 24 de Maio, 2026
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">€{currentSubData?.price}</p>
              <p className="text-sm text-emerald-100">/mês</p>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Viagens este mês</span>
              <span className="font-semibold">{totalTrips} viagens</span>
            </div>
            <Progress value={75} className="bg-white/20" />
            <p className="text-xs text-emerald-100 mt-2">Viagens ilimitadas ✨</p>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold">Visa •••• 4242</p>
                <p className="text-sm text-gray-500">Expira 08/2027</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Alterar
            </Button>
          </div>
        </Card>

        {/* Next Payment */}
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-blue-900">Próximo pagamento</p>
              <p className="text-sm text-blue-700">
                €{currentSubData?.price} será debitado a 24 de Maio, 2026
              </p>
            </div>
          </div>
        </Card>

        {/* All Subscription Types */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Tipos de Subscrição Disponíveis</h2>
          <p className="text-sm text-gray-600 mb-4">
            Todas as subscrições incluem acesso ilimitado à rede Veloom
          </p>
          <div className="space-y-3">
            {subscriptionTypes.map((sub) => {
              const Icon = sub.icon;
              const isActive = sub.id === currentSubscription;

              return (
                <Card
                  key={sub.id}
                  className={`p-5 relative ${
                    isActive
                      ? "border-2 border-emerald-500 shadow-md"
                      : "hover:shadow-md transition-shadow"
                  }`}
                >
                  {sub.popular && !isActive && (
                    <Badge className="absolute -top-2 right-4 bg-orange-500">
                      Mais Popular
                    </Badge>
                  )}
                  {sub.discount && (
                    <Badge className="absolute -top-2 left-4 bg-blue-500">
                      {sub.discount} OFF
                    </Badge>
                  )}
                  {isActive && (
                    <Badge className="absolute -top-2 right-4 bg-emerald-500">
                      Subscrição Atual
                    </Badge>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{sub.name}</h3>
                        <p className="text-xs text-gray-500">{sub.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {sub.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">€{sub.originalPrice}</p>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">€{sub.price}</span>
                        <span className="text-sm text-gray-500">/mês</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {sub.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {!isActive && (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => setCurrentSubscription(sub.id)}
                    >
                      Alterar para {sub.name}
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-3">Benefícios da Subscrição</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
              <p>
                <strong>Sem custos escondidos:</strong> Preço fixo mensal, sem surpresas
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
              <p>
                <strong>Cancelamento flexível:</strong> Cancele a qualquer momento
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
              <p>
                <strong>Manutenção incluída:</strong> Bikes sempre em perfeito estado
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-500 mt-0.5" />
              <p>
                <strong>Seguro incluído:</strong> Proteção completa durante as viagens
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full">
            Histórico de Pagamentos
          </Button>
          <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
            Cancelar Subscrição
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Ao subscrever, concorda com os Termos de Serviço e Política de Pagamentos
        </p>
      </div>
    </div>
  );
}
