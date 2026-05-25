import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Eye,
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown,
  LogOut,
  Download,
  Calendar,
  Store,
  Users,
  Bike,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Period = "daily" | "weekly" | "monthly";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// Partner profiles
const partnerProfiles: Record<string, { name: string; type: string; location: string }> = {
  colombo: { name: "Fórum Aveiro", type: "Estação Principal", location: "Centro de Aveiro" },
  vascogama: { name: "Glicínias Plaza", type: "Estação Principal", location: "Universidade de Aveiro" },
  empresa: { name: "Tech Solutions Lda", type: "Subscrição Familiar", location: "Ria de Aveiro" },
};

// Mock data generators
const generateImpressionData = (period: Period) => {
  const days = period === "daily" ? 7 : period === "weekly" ? 12 : 12;
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    data.push({
      date: period === "monthly"
        ? date.toLocaleDateString("pt-PT", { month: "short" })
        : date.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" }),
      visualizacoes: Math.floor(Math.random() * 500) + 800,
      utilizacoes: Math.floor(Math.random() * 150) + 200,
    });
  }

  return data;
};

const hourlyData = [
  { hora: "00h-06h", utilizacoes: 12 },
  { hora: "06h-09h", utilizacoes: 245 },
  { hora: "09h-12h", utilizacoes: 189 },
  { hora: "12h-15h", utilizacoes: 156 },
  { hora: "15h-18h", utilizacoes: 312 },
  { hora: "18h-21h", utilizacoes: 287 },
  { hora: "21h-00h", utilizacoes: 98 },
];

const serviceRatingData = [
  { name: "5 estrelas", value: 156, percent: 65 },
  { name: "4 estrelas", value: 52, percent: 22 },
  { name: "3 estrelas", value: 24, percent: 10 },
  { name: "2 estrelas", value: 5, percent: 2 },
  { name: "1 estrela", value: 3, percent: 1 },
];

const topZonesData = [
  { zona: "Entrada Principal", utilizacoes: 456, receita: 5472 },
  { zona: "Zona Norte", utilizacoes: 312, receita: 3744 },
  { zona: "Zona Sul", utilizacoes: 287, receita: 3444 },
  { zona: "Estacionamento", utilizacoes: 189, receita: 2268 },
  { zona: "Zona Oeste", utilizacoes: 123, receita: 1476 },
];

export function PartnerDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("weekly");
  const [impressionData, setImpressionData] = useState(generateImpressionData("weekly"));
  const [partnerId, setPartnerId] = useState("");

  useEffect(() => {
    const isPartner = localStorage.getItem("partnerAuth");
    const id = localStorage.getItem("partnerId");

    if (!isPartner || !id) {
      navigate("/partner");
    } else {
      setPartnerId(id);
    }
  }, [navigate]);

  useEffect(() => {
    setImpressionData(generateImpressionData(period));
  }, [period]);

  const handleLogout = () => {
    localStorage.removeItem("partnerAuth");
    localStorage.removeItem("partnerId");
    localStorage.removeItem("partnerEmail");
    navigate("/Login");
  };

  const handleExportPDF = () => {
    alert("Exportação PDF em desenvolvimento. Em breve estará disponível para download.");
  };

  const handleExportExcel = () => {
    alert("Exportação Excel em desenvolvimento. Em breve estará disponível para download.");
  };

  const partner = partnerProfiles[partnerId] || partnerProfiles.colombo;

  const totalImpressions = impressionData.reduce((acc, curr) => acc + curr.visualizacoes, 0);
  const totalUsage = impressionData.reduce((acc, curr) => acc + curr.utilizacoes, 0);
  const conversionRate = ((totalUsage / totalImpressions) * 100).toFixed(1);
  const revenue = totalUsage * 12;
  const commission = revenue * 0.15;
  const avgRating = 4.5;
  const totalRatings = serviceRatingData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{partner.name}</h1>
                <p className="text-sm text-gray-600">{partner.type} · {partner.location}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExportExcel}
                className="gap-2"
                size="sm"
              >
                <Download className="h-4 w-4" />
                Excel
              </Button>
              <Button
                variant="outline"
                onClick={handleExportPDF}
                className="gap-2"
                size="sm"
              >
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Filter */}
        <div className="mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium">Período:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={period === "daily" ? "default" : "outline"}
              onClick={() => setPeriod("daily")}
            >
              Diário
            </Button>
            <Button
              size="sm"
              variant={period === "weekly" ? "default" : "outline"}
              onClick={() => setPeriod("weekly")}
            >
              Semanal
            </Button>
            <Button
              size="sm"
              variant={period === "monthly" ? "default" : "outline"}
              onClick={() => setPeriod("monthly")}
            >
              Mensal
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                +8.2%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Visualizações</h3>
            <p className="text-3xl font-bold">{totalImpressions.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Taxa de conversão: {conversionRate}%</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                +12.5%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Receita Gerada</h3>
            <p className="text-3xl font-bold">€{revenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Comissão paga: €{commission.toFixed(2)}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                +0.3
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Classificação Média</h3>
            <p className="text-3xl font-bold">{avgRating} ★</p>
            <p className="text-xs text-gray-500 mt-2">{totalRatings} avaliações</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Bike className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                +15.1%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Utilizações</h3>
            <p className="text-3xl font-bold">{totalUsage.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Viagens iniciadas/finalizadas</p>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Impressions & Usage */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Visualizações vs Utilizações</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={impressionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  key="visualizacoes-line"
                  type="monotone"
                  dataKey="visualizacoes"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Visualizações"
                />
                <Line
                  key="utilizacoes-line"
                  type="monotone"
                  dataKey="utilizacoes"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Utilizações"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Hourly Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Distribuição por Horário
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="utilizacoes" fill="#3b82f6" name="Utilizações" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Rating Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribuição de Avaliações</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceRatingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.split(" ")[0]}★ ${percent}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceRatingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {serviceRatingData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value} ({item.percent}%)</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Zones */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Zonas com Melhor Desempenho
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topZonesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="zona" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="utilizacoes" fill="#10b981" name="Utilizações" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Comparison with Platform Average */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Comparação com Média da Plataforma
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Métrica</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Sua Localização</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Média da Rede</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Diferença</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Taxa de Conversão</td>
                  <td className="text-right py-3 px-4 font-medium">{conversionRate}%</td>
                  <td className="text-right py-3 px-4">22.8%</td>
                  <td className="text-right py-3 px-4 text-green-600 flex items-center justify-end gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +{(parseFloat(conversionRate) - 22.8).toFixed(1)}pp
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Classificação Média</td>
                  <td className="text-right py-3 px-4 font-medium">{avgRating} ★</td>
                  <td className="text-right py-3 px-4">4.2 ★</td>
                  <td className="text-right py-3 px-4 text-green-600 flex items-center justify-end gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +0.3
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Receita por Utilização</td>
                  <td className="text-right py-3 px-4 font-medium">€12.00</td>
                  <td className="text-right py-3 px-4">€10.50</td>
                  <td className="text-right py-3 px-4 text-green-600 flex items-center justify-end gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +14.3%
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">Tempo Médio de Estacionamento</td>
                  <td className="text-right py-3 px-4 font-medium">12.5 min</td>
                  <td className="text-right py-3 px-4">15.2 min</td>
                  <td className="text-right py-3 px-4 text-red-600 flex items-center justify-end gap-1">
                    <TrendingDown className="h-4 w-4" />
                    -17.8%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Performance Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Resumo de Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Pontos Fortes</h4>
              </div>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Taxa de conversão acima da média (+2.2pp)</li>
                <li>• Excelente classificação (4.5★)</li>
                <li>• Alta receita por utilização</li>
                <li>• Pico de utilização bem distribuído</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-amber-600" />
                <h4 className="font-semibold text-amber-900">Oportunidades</h4>
              </div>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Aumentar visibilidade no período noturno</li>
                <li>• Promover zona oeste (menor utilização)</li>
                <li>• Campanha para utilizadores corporativos</li>
                <li>• Melhorar sinalização das zonas</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Recomendações</h4>
              </div>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Manter qualidade do serviço</li>
                <li>• Considerar expansão de zonas</li>
                <li>• Parceria para eventos noturnos</li>
                <li>• Programa de fidelização local</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
