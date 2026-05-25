import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Calendar, Clock, Bike, MapPin, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

// Mock bikes data - Aveiro
const mockBikes = [
  { id: "VLM001", lat: 40.6443, lng: -8.6455, battery: 85, status: "available" },
  { id: "VLM002", lat: 40.6389, lng: -8.6489, battery: 62, status: "available" },
  { id: "VLM003", lat: 40.6416, lng: -8.6522, battery: 95, status: "available" },
  { id: "VLM004", lat: 40.6373, lng: -8.6543, battery: 48, status: "available" },
  { id: "VLM005", lat: 40.6486, lng: -8.6428, battery: 78, status: "available" },
  { id: "VLM006", lat: 40.6421, lng: -8.6415, battery: 91, status: "available" },
  { id: "VLM007", lat: 40.6399, lng: -8.6460, battery: 55, status: "available" },
  { id: "VLM008", lat: 40.6454, lng: -8.6491, battery: 73, status: "available" },
];

export function Reservations() {
  const navigate = useNavigate();
  const [selectedBike, setSelectedBike] = useState<string>("");
  const [reservationDuration, setReservationDuration] = useState("01:00");

  // Active reservation state (loaded from localStorage)
  const [activeReservation, setActiveReservation] = useState(() => {
    const bike = localStorage.getItem("scheduledBike");
    const start = localStorage.getItem("scheduledStartTime");
    const end = localStorage.getItem("scheduledEndTime");
    if (bike && start && end) return { bike, start, end };
    return null;
  });

  const handleCancelReservation = () => {
    localStorage.removeItem("scheduledBike");
    localStorage.removeItem("scheduledStartTime");
    localStorage.removeItem("scheduledEndTime");
    localStorage.removeItem("scheduledEndTimestamp");
    setActiveReservation(null);
  };

  const handleConfirmReservation = () => {
    if (!selectedBike || !reservationDuration) return;

    const now = new Date();
    const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const [hours, minutes] = reservationDuration.split(":").map(Number);
    const durationMin = hours * 60 + minutes;

    const endDate = new Date(now.getTime() + durationMin * 60000);
    const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;

    localStorage.setItem("scheduledBike", selectedBike);
    localStorage.setItem("scheduledStartTime", startTime);
    localStorage.setItem("scheduledEndTime", endTime);

    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={() => navigate("/home")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Reservar E-bike</h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">

        {/* Active Reservation Banner */}
        {activeReservation && (
          <Card className="p-4 mb-6 bg-amber-50 border-amber-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Bike className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-amber-900">Reserva Ativa</p>
                  <p className="text-sm text-amber-800">
                    Bike <strong>{activeReservation.bike}</strong> — das {activeReservation.start} às {activeReservation.end}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                onClick={handleCancelReservation}
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* Info Card */}
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900">Reserve com antecedência</p>
              <p className="text-sm text-blue-800">
                Garanta uma e-bike para usar mais tarde. A reserva inicia imediatamente.
              </p>
            </div>
          </div>
        </Card>

        {/* Select Bike */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Escolher E-bike</h2>
          <div className="space-y-3">
            {mockBikes.map((bike) => (
              <Card
                key={bike.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedBike === bike.id
                    ? "border-2 border-amber-500 bg-amber-50"
                    : "hover:border-gray-300"
                }`}
                onClick={() => setSelectedBike(bike.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bike className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="font-semibold">{bike.id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <p className="text-xs text-gray-600">Disponível</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${bike.battery}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{Math.round(bike.battery)}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Duração da Reserva</h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tempo de Reserva</label>
            <Input
              type="time"
              value={reservationDuration}
              onChange={(e) => setReservationDuration(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Formato: HH:MM (ex: 01:30 = 1 hora e 30 minutos)
            </p>
          </div>
        </div>

        {/* Summary */}
        {selectedBike && reservationDuration && (() => {
          const now = new Date();
          const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

          const [hours, minutes] = reservationDuration.split(":").map(Number);
          const durationMin = hours * 60 + minutes;

          if (durationMin === 0) {
            return (
              <Card className="p-4 mb-6 bg-red-50 border-red-200">
                <p className="text-sm text-red-800">
                  A duração deve ser maior que 0 minutos
                </p>
              </Card>
            );
          }

          const endDate = new Date(now.getTime() + durationMin * 60000);
          const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;

          const bufferEndDate = new Date(endDate.getTime() + 10 * 60000);
          const bufferEndTime = `${bufferEndDate.getHours().toString().padStart(2, "0")}:${bufferEndDate.getMinutes().toString().padStart(2, "0")}`;

          return (
            <Card className="p-4 mb-6 bg-amber-50 border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-3">Resumo da Reserva</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Bike className="h-4 w-4 text-amber-600" />
                  <p className="text-amber-800">
                    <strong>Bike:</strong> {selectedBike}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <p className="text-amber-800">
                    <strong>Início:</strong> {startTime} (agora)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <p className="text-amber-800">
                    <strong>Fim:</strong> {endTime}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  <p className="text-amber-800">
                    <strong>Duração:</strong> {hours}h {minutes}min
                  </p>
                </div>
              </div>
              <p className="text-xs text-amber-700 mt-3">
                Bike disponível para outros após: {bufferEndTime} (fim + 10 min)
              </p>
            </Card>
          );
        })()}

        {/* Actions */}
        <div className="space-y-3">
          <Button
            className="w-full bg-amber-500 hover:bg-amber-600"
            size="lg"
            onClick={handleConfirmReservation}
            disabled={!selectedBike || !reservationDuration || (() => {
              const [hours, minutes] = reservationDuration.split(":").map(Number);
              return (hours * 60 + minutes) === 0;
            })()}
          >
            Confirmar Reserva
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/home")}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
