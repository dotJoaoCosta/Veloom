import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Map, Marker, Overlay } from "pigeon-maps";
import {
  ArrowLeft,
  Battery,
  Clock,
  MapPin,
  Lock,
  Navigation2,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";


export function ActiveRide() {
  const { bikeId } = useParams();
  const navigate = useNavigate();
  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [battery, setBattery] = useState(85);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [routePath, setRoutePath] = useState<[number, number][]>([
    [40.6443, -8.6455],
  ]);

  useEffect(() => {
    // Mark ride as active
    localStorage.setItem("activeRide", "true");

    return () => {
      // Cleanup on unmount (but not on end ride)
    };
  }, []);

  useEffect(() => {
    // Update timer
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    // Simulate distance and battery updates
    const updates = setInterval(() => {
      setDistance((prev) => prev + Math.random() * 0.05);
      setBattery((prev) => Math.max(10, prev - Math.random() * 0.5));
      
      // Add to route path
      setRoutePath((prev) => {
        const lastPoint = prev[prev.length - 1];
        const newPoint: [number, number] = [
          lastPoint[0] + (Math.random() - 0.5) * 0.001,
          lastPoint[1] + (Math.random() - 0.5) * 0.001,
        ];
        return [...prev, newPoint];
      });
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(updates);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndRide = () => {
    // Save trip to history
    const trip = {
      id: Date.now(),
      bikeId: bikeId || "VLM001",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      duration: formatTime(duration),
      distance: distance.toFixed(1) + " km",
      start: "Centro de Aveiro",
      end: "Destino",
    };

    // Get existing trips
    const existingTrips = JSON.parse(localStorage.getItem("tripHistory") || "[]");

    // Add new trip to the beginning
    const updatedTrips = [trip, ...existingTrips];

    // Save back to localStorage
    localStorage.setItem("tripHistory", JSON.stringify(updatedTrips));

    // Update monthly stats
    const stats = JSON.parse(localStorage.getItem("monthlyStats") || JSON.stringify({
      totalTrips: 0,
      totalDistance: 0,
      totalTime: 0,
      co2Saved: 0,
    }));

    stats.totalTrips += 1;
    stats.totalDistance += distance;
    stats.totalTime += duration;
    stats.co2Saved += distance * 0.23; // Average CO2 saved per km

    localStorage.setItem("monthlyStats", JSON.stringify(stats));

    // Clear active ride state
    localStorage.removeItem("activeRide");
    localStorage.removeItem("unlockedBike");
    localStorage.removeItem("unlockTime");
    localStorage.removeItem("unlockBikeId");

    navigate("/home");
  };

  return (
    <div className="relative h-screen w-full flex flex-col bg-gray-900">
      {/* Map */}
      <div className="flex-1 relative">
        <Map
          center={routePath[routePath.length - 1]}
          zoom={15}
          height="100%"
        >
          <Overlay anchor={routePath[routePath.length - 1]} offset={[20, 20]}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#10b981" stroke="white" strokeWidth="1.5">
              <circle cx="5.5" cy="17.5" r="3.5"/>
              <circle cx="18.5" cy="17.5" r="3.5"/>
              <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
            </svg>
          </Overlay>
        </Map>

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Navigation2 className="h-5 w-5 text-white" />
              </div>
              <div className="text-white">
                <p className="text-sm font-medium">Viagem ativa</p>
                <p className="text-xs opacity-90">{bikeId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom control panel */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000]">
        <Card className="rounded-t-3xl rounded-b-none p-6 bg-white">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-gray-500" />
              </div>
              <p className="text-2xl font-bold">{formatTime(duration)}</p>
              <p className="text-xs text-gray-500">Tempo</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-gray-500" />
              </div>
              <p className="text-2xl font-bold">{distance.toFixed(2)}</p>
              <p className="text-xs text-gray-500">km</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Battery className="h-4 w-4 text-gray-500" />
              </div>
              <p className="text-2xl font-bold">{Math.round(battery)}%</p>
              <p className="text-xs text-gray-500">Bateria</p>
            </div>
          </div>

          {/* Battery warning */}
          {battery < 30 && (
            <Card className="p-3 mb-4 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Bateria baixa
                  </p>
                  <p className="text-xs text-amber-700">
                    Considere terminar a viagem em breve
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900">
              <strong>Lembrete:</strong> A bike só funciona com a app ativa. Após terminar, pode estacionar em qualquer local seguro próximo.
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              size="lg"
              variant="outline"
              className="border-2"
              onClick={() => navigate("/home")}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar ao Mapa
            </Button>
            <Button
              size="lg"
              className="bg-red-500 hover:bg-red-600"
              onClick={() => setShowEndDialog(true)}
            >
              <Lock className="h-5 w-5 mr-2" />
              Terminar Viagem
            </Button>
          </div>
        </Card>
      </div>

      {/* End ride dialog */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminar viagem?</AlertDialogTitle>
            <AlertDialogDescription>
              A bike {bikeId} será bloqueada e ficará disponível para outros utilizadores nesta localização.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duração:</span>
              <span className="font-medium">{formatTime(duration)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Distância:</span>
              <span className="font-medium">{distance.toFixed(2)} km</span>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEndRide}
              className="bg-red-500 hover:bg-red-600"
            >
              Confirmar e Bloquear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}