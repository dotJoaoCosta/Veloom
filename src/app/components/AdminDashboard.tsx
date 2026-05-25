import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  TrendingUp,
  Users,
  Bike,
  DollarSign,
  Calendar,
  LogOut,
  Activity,
  MapPin,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

// Mock data generators
const generateTransactionData = (period: Period) => {
  const days = period === "daily" ? 7 : period === "weekly" ? 12 : 12;
  const data = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    data.push({
      date: period === "monthly"
        ? date.toLocaleDateString("pt-PT", { month: "short" })
        : date.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" }),
      viagens: Math.floor(Math.random() * 200) + 300,
      receita: Math.floor(Math.random() * 5000) + 8000,
    });
  }

  return data;
};

// Monthly subscription: €39/month - single plan
const MONTHLY_SUBSCRIPTION = 39;

const subscriberGrowthData = [
  { mes: "Jan", subscritores: 412, novos: 45, cancelamentos: 12 },
  { mes: "Fev", subscritores: 478, novos: 73, cancelamentos: 7 },
  { mes: "Mar", subscritores: 531, novos: 62, cancelamentos: 9 },
  { mes: "Abr", subscritores: 589, novos: 68, cancelamentos: 10 },
  { mes: "Mai", subscritores: 624, novos: 72, cancelamentos: 11 },
  { mes: "Jun", subscritores: 650, novos: 58, cancelamentos: 32 },
];

const userSegmentData = [
  { name: "Individual", value: 432, percent: 66 },
  { name: "Estudante (-20%)", value: 156, percent: 24 },
  { name: "Familiar", value: 62, percent: 10 },
];

const zoneData = [
  { zone: "Centro de Aveiro", viagens: 1245, receita: 15680 },
  { zone: "Fórum Aveiro", viagens: 987, receita: 12450 },
  { zone: "Universidade de Aveiro", viagens: 756, receita: 9520 },
  { zone: "Ria de Aveiro", viagens: 654, receita: 8240 },
  { zone: "Cais da Fonte Nova", viagens: 432, receita: 5440 },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("weekly");
  const [transactionData, setTransactionData] = useState(generateTransactionData("weekly"));

  useEffect(() => {
    const isAdmin = localStorage.getItem("adminAuth");
    if (!isAdmin) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    setTransactionData(generateTransactionData(period));
  }, [period]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/login");
  };

  const totalRides = transactionData.reduce((acc, curr) => acc + curr.viagens, 0);
  const totalRevenue = transactionData.reduce((acc, curr) => acc + curr.receita, 0);
  const avgRideValue = (totalRevenue / totalRides).toFixed(2);
  const activeUsers = 650;
  const activeBikes = 142;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Painel de Administração</h1>
                <p className="text-sm text-gray-600">Veloom Platform Analytics</p>
              </div>
            </div>
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
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                +12.5%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total de Viagens</h3>
            <p className="text-3xl font-bold">{totalRides.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">
              {period === "daily" ? "Últimos 7 dias" : period === "weekly" ? "Últimas 12 semanas" : "Últimos 12 meses"}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                +8.3%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Receita Total</h3>
            <p className="text-3xl font-bold">€{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Valor médio: €{avgRideValue}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                +15.2%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Utilizadores Ativos</h3>
            <p className="text-3xl font-bold">{activeUsers}</p>
            <p className="text-xs text-gray-500 mt-2">Subscritores: {activeUsers}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Bike className="h-6 w-6 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                +5.1%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">E-bikes Ativas</h3>
            <p className="text-3xl font-bold">{activeBikes}</p>
            <p className="text-xs text-gray-500 mt-2">Taxa de utilização: 87%</p>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Transaction Volume */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Volume de Transações</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="viagens"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Viagens"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Revenue Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Receita Gerada</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="receita" fill="#3b82f6" name="Receita (€)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscriber Growth */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Evolução de Subscritores</h3>
            <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-900">Subscrição Mensal Única</span>
                <span className="text-xl font-bold text-emerald-700">€{MONTHLY_SUBSCRIPTION}/mês</span>
              </div>
              <p className="text-xs text-emerald-700 mt-1">Acesso ilimitado a todas as e-bikes</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={subscriberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  key="subscritores-line"
                  type="monotone"
                  dataKey="subscritores"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Total Subscritores"
                />
                <Line
                  key="novos-line"
                  type="monotone"
                  dataKey="novos"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Novos"
                />
                <Line
                  key="cancelamentos-line"
                  type="monotone"
                  dataKey="cancelamentos"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Cancelamentos"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center p-2 bg-green-50 rounded">
                <p className="text-xs text-gray-600">Novos (Jun)</p>
                <p className="text-lg font-bold text-green-700">+58</p>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <p className="text-xs text-gray-600">Cancelamentos</p>
                <p className="text-lg font-bold text-red-700">-58</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <p className="text-xs text-gray-600">Taxa Retenção</p>
                <p className="text-lg font-bold text-blue-700">91.2%</p>
              </div>
            </div>
          </Card>

          {/* Zone Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Desempenho por Zona Geográfica
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={zoneData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="zone" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="viagens" fill="#10b981" name="Viagens" />
                <Bar dataKey="receita" fill="#3b82f6" name="Receita (€)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* User Segmentation */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Segmentação de Utilizadores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userSegmentData.map((segment, index) => (
              <div key={segment.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{segment.name}</h4>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                </div>
                <p className="text-3xl font-bold mb-1">{segment.value}</p>
                <p className="text-sm text-gray-600 mb-3">{segment.percent}% do total</p>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${segment.percent}%`,
                      backgroundColor: COLORS[index],
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  MRR: €{(segment.value * (segment.name.includes("Estudante") ? MONTHLY_SUBSCRIPTION * 0.8 : MONTHLY_SUBSCRIPTION)).toLocaleString("pt-PT", { maximumFractionDigits: 0 })}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Nota:</strong> Estudantes beneficiam de 20% de desconto (€31.20/mês). Subscritores corporativos mantêm o mesmo valor mas com faturação empresarial.
            </p>
          </div>
        </Card>

        {/* Summary Table */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Resumo Executivo</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Métrica</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Valor Atual</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Período Anterior</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Variação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Receita Mensal Recorrente (MRR)</td>
                  <td className="text-right py-3 px-4 font-medium">€{(activeUsers * MONTHLY_SUBSCRIPTION).toLocaleString()}</td>
                  <td className="text-right py-3 px-4">€{(589 * MONTHLY_SUBSCRIPTION).toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-green-600">+10.4%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Total Subscritores Ativos</td>
                  <td className="text-right py-3 px-4 font-medium">{activeUsers}</td>
                  <td className="text-right py-3 px-4">589</td>
                  <td className="text-right py-3 px-4 text-green-600">+10.4%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Custo de Aquisição por Cliente (CAC)</td>
                  <td className="text-right py-3 px-4 font-medium">€42</td>
                  <td className="text-right py-3 px-4">€48</td>
                  <td className="text-right py-3 px-4 text-green-600">-12.5%</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">Valor do Tempo de Vida (LTV)</td>
                  <td className="text-right py-3 px-4 font-medium">€456</td>
                  <td className="text-right py-3 px-4">€432</td>
                  <td className="text-right py-3 px-4 text-green-600">+5.6%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">Taxa de Retenção</td>
                  <td className="text-right py-3 px-4 font-medium">91.2%</td>
                  <td className="text-right py-3 px-4">89.8%</td>
                  <td className="text-right py-3 px-4 text-green-600">+1.4pp</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
