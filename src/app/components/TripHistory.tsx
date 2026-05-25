import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  Leaf,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";

const mockTrips = [
  {
    id: 1,
    bikeId: "VLM001",
    date: "2026-03-11",
    time: "08:30",
    duration: "25 min",
    distance: "4.2 km",
    start: "Centro de Aveiro",
    end: "Universidade de Aveiro",
  },
  {
    id: 2,
    bikeId: "VLM003",
    date: "2026-03-10",
    time: "18:45",
    duration: "18 min",
    distance: "3.1 km",
    start: "Fórum Aveiro",
    end: "Ria de Aveiro",
  },
  {
    id: 3,
    bikeId: "VLM005",
    date: "2026-03-09",
    time: "12:15",
    duration: "32 min",
    distance: "5.8 km",
    start: "Cais da Fonte Nova",
    end: "Glicínias Plaza",
  },
  {
    id: 4,
    bikeId: "VLM002",
    date: "2026-03-08",
    time: "09:20",
    duration: "22 min",
    distance: "3.9 km",
    start: "Estação de Aveiro",
    end: "Hospital de Aveiro",
  },
  {
    id: 5,
    bikeId: "VLM007",
    date: "2026-03-07",
    time: "17:30",
    duration: "28 min",
    distance: "4.7 km",
    start: "Praça do Mercado",
    end: "Canal Central",
  },
];

export function TripHistory() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState(mockTrips);
  const [monthlyStats, setMonthlyStats] = useState({
    totalTrips: 47,
    totalDistance: 183.2,
    totalTime: "12h 35min",
    co2Saved: 42.5,
    avgSpeed: 14.5,
  });

  useEffect(() => {
    // Load trips from localStorage
    const savedTrips = JSON.parse(localStorage.getItem("tripHistory") || "[]");
    if (savedTrips.length > 0) {
      setTrips([...savedTrips, ...mockTrips]);
    }

    // Load stats from localStorage
    const savedStats = JSON.parse(localStorage.getItem("monthlyStats") || "null");
    if (savedStats) {
      const totalMinutes = Math.floor(savedStats.totalTime / 60);
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;

      setMonthlyStats({
        totalTrips: savedStats.totalTrips + 47,
        totalDistance: savedStats.totalDistance + 183.2,
        totalTime: `${hours}h ${mins}min`,
        co2Saved: savedStats.co2Saved + 42.5,
        avgSpeed: savedStats.totalDistance > 0 ? (savedStats.totalDistance / (savedStats.totalTime / 3600)) : 14.5,
      });
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
          <h1 className="text-xl font-semibold">Histórico de Viagens</h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recentes</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>

          {/* Recent Trips */}
          <TabsContent value="recent" className="mt-4 space-y-3">
            {trips.map((trip) => {
              // Format duration properly - handle both "MM:SS" and "XX min" formats
              const formatDuration = (dur: string) => {
                if (dur.includes(':')) {
                  const [mins, secs] = dur.split(':');
                  return `${mins} min ${secs} seg`;
                }
                return dur;
              };

              // Ensure distance has " km" suffix
              const formatDistance = (dist: string) => {
                return dist.includes('km') ? dist : `${dist} km`;
              };

              return (
              <Card key={trip.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono text-xs">
                        {trip.bikeId}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(trip.date).toLocaleDateString("pt-PT", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{trip.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{formatDistance(trip.distance)}</p>
                    <p className="text-xs text-gray-500">{formatDuration(trip.duration)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{trip.start}</p>
                      <p className="text-xs text-gray-500">Início</p>
                    </div>
                  </div>

                  <div className="ml-1 border-l-2 border-dashed border-gray-300 h-4" />

                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{trip.end}</p>
                      <p className="text-xs text-gray-500">Destino</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
            })}

            <Button variant="outline" className="w-full">
              Carregar mais viagens
            </Button>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="stats" className="mt-4 space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5" />
                  <p className="text-sm font-medium">Viagens</p>
                </div>
                <p className="text-3xl font-bold">{monthlyStats.totalTrips}</p>
                <p className="text-xs text-emerald-100">este mês</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5" />
                  <p className="text-sm font-medium">Distância</p>
                </div>
                <p className="text-3xl font-bold">{monthlyStats.totalDistance.toFixed(1)}</p>
                <p className="text-xs text-blue-100">km percorridos</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5" />
                  <p className="text-sm font-medium">Tempo</p>
                </div>
                <p className="text-3xl font-bold">{monthlyStats.totalTime.split(" ")[0]}</p>
                <p className="text-xs text-purple-100">horas em viagem</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="h-5 w-5" />
                  <p className="text-sm font-medium">CO₂</p>
                </div>
                <p className="text-3xl font-bold">{monthlyStats.co2Saved.toFixed(1)}</p>
                <p className="text-xs text-green-100">kg poupados</p>
              </Card>
            </div>

            {/* Detailed Stats */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Estatísticas Detalhadas</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Velocidade média</span>
                    <span className="font-semibold">{monthlyStats.avgSpeed.toFixed(1)} km/h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${(monthlyStats.avgSpeed / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Distância média por viagem</span>
                    <span className="font-semibold">
                      {(monthlyStats.totalDistance / monthlyStats.totalTrips).toFixed(1)} km
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "78%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Tempo médio por viagem</span>
                    <span className="font-semibold">16 min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: "64%" }} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Environmental Impact */}
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-1">
                    Impacto Ambiental
                  </h3>
                  <p className="text-sm text-green-700 mb-3">
                    Ao usar a Veloom, já evitou a emissão de <strong>{monthlyStats.co2Saved.toFixed(1)} kg de CO₂</strong> este mês!
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <p className="text-xs text-green-600">
                      +15% vs. mês anterior
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Conquistas</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🚴</span>
                  </div>
                  <p className="text-xs font-medium">Primeiro Passeio</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <p className="text-xs font-medium">Eco Warrior</p>
                </div>
                <div className="text-center opacity-50">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <p className="text-xs font-medium">100 Viagens</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
