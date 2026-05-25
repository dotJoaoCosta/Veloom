import { useState, useEffect } from "react";
import { Map, Marker, Overlay } from "pigeon-maps";
import { useNavigate } from "react-router";
import { Bike, MapPin, Navigation, User, History, CreditCard, Clock, X, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";

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

// Helper to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Component to draw a dotted line between two points using multiple markers
function PathLine({
  from,
  to,
  color
}: {
  from: [number, number];
  to: [number, number];
  color: string;
}) {
  const points: [number, number][] = [];
  const numPoints = 15;

  for (let i = 1; i < numPoints; i++) {
    const ratio = i / numPoints;
    const lat = from[0] + (to[0] - from[0]) * ratio;
    const lng = from[1] + (to[1] - from[1]) * ratio;
    points.push([lat, lng]);
  }

  return (
    <>
      {points.map((point, idx) => (
        <Marker
          key={`path-${idx}`}
          width={8}
          anchor={point}
          color={color}
        />
      ))}
    </>
  );
}


export function MapView() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number]>([40.6443, -8.6455]);
  const [bikes, setBikes] = useState(mockBikes);
  const [bikesByDistance, setBikesByDistance] = useState(mockBikes);
  const [selectedBike, setSelectedBike] = useState<typeof mockBikes[0] | null>(null);

  // Unlocked bike (immediate use - 30 min)
  const [unlockedBike, setUnlockedBike] = useState<string | null>(() =>
    localStorage.getItem("unlockedBike")
  );
  const [unlockTime, setUnlockTime] = useState<number>(() => {
    const saved = localStorage.getItem("unlockTime");
    return saved ? parseInt(saved) : 0;
  });
  const [unlockTimeLeft, setUnlockTimeLeft] = useState<number>(0);

  // Scheduled reservation (future time)
  const [reservedBike, setReservedBike] = useState<string | null>(() =>
    localStorage.getItem("scheduledBike")
  );
  const [scheduledStartTime, setScheduledStartTime] = useState<string>(() =>
    localStorage.getItem("scheduledStartTime") || ""
  );
  const [scheduledEndTime, setScheduledEndTime] = useState<string>(() =>
    localStorage.getItem("scheduledEndTime") || ""
  );
  const [scheduledEndTimestamp, setScheduledEndTimestamp] = useState<number>(() => {
    const saved = localStorage.getItem("scheduledEndTimestamp");
    return saved ? parseInt(saved) : 0;
  });

  const [activeRide, setActiveRide] = useState<boolean>(() => {
    return localStorage.getItem("activeRide") === "true";
  });

  // UI state
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [reservationDuration, setReservationDuration] = useState("01:00"); // HH:MM format

  useEffect(() => {
    // Use Aveiro as default location for demo
    // Uncomment below to use real geolocation
    setUserLocation([40.6443, -8.6455]);

    /*
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // Use default location (Aveiro) if geolocation fails
          setUserLocation([40.6443, -8.6455]);
        }
      );
    }
    */

    // Simulate real-time bike updates
    const interval = setInterval(() => {
      setBikes((prev) =>
        prev.map((bike) => ({
          ...bike,
          battery: Math.max(10, bike.battery - Math.random() * 2),
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Sort bikes by distance when user location or bikes change
  useEffect(() => {
    const sorted = [...bikes].sort((a, b) => {
      const distA = calculateDistance(userLocation[0], userLocation[1], a.lat, a.lng);
      const distB = calculateDistance(userLocation[0], userLocation[1], b.lat, b.lng);
      return distA - distB;
    });
    setBikesByDistance(sorted);
  }, [userLocation, bikes]);

  // Unlock timer (30 minutes = 1800 seconds)
  useEffect(() => {
    if (unlockedBike && unlockTime) {
      const checkUnlock = () => {
        const now = Date.now();
        const elapsed = Math.floor((now - unlockTime) / 1000);
        const remaining = 1800 - elapsed; // 30 minutes

        if (remaining <= 0) {
          // Unlock expired
          handleCancelUnlock();
        } else {
          setUnlockTimeLeft(remaining);
        }
      };

      checkUnlock();
      const timer = setInterval(checkUnlock, 1000);

      return () => clearInterval(timer);
    }
  }, [unlockedBike, unlockTime]);

  // Check scheduled reservation status
  useEffect(() => {
    if (reservedBike && scheduledEndTimestamp) {
      const checkSchedule = () => {
        const now = Date.now();
        // Add 10 min buffer after end time
        const bufferTime = scheduledEndTimestamp + (10 * 60 * 1000);

        if (now > bufferTime) {
          // Reservation expired (end time + 10 min buffer)
          handleCancelScheduledReservation();
        }
      };

      checkSchedule();
      const timer = setInterval(checkSchedule, 60000); // Check every minute

      return () => clearInterval(timer);
    }
  }, [reservedBike, scheduledEndTimestamp]);

  const handleUnlockBike = (bike: typeof mockBikes[0]) => {
    const now = Date.now();
    setUnlockedBike(bike.id);
    setUnlockTime(now);
    localStorage.setItem("unlockedBike", bike.id);
    localStorage.setItem("unlockTime", now.toString());
    setSelectedBike(null);
  };

  const handleCancelUnlock = () => {
    setUnlockedBike(null);
    setUnlockTime(0);
    setUnlockTimeLeft(0);
    localStorage.removeItem("unlockedBike");
    localStorage.removeItem("unlockTime");
  };

  const handleOpenReservationDialog = (bike: typeof mockBikes[0]) => {
    setSelectedBike(bike);
    setShowReservationDialog(true);
    setReservationDuration("01:00"); // Default 1 hour
  };

  const handleConfirmReservation = () => {
    if (!selectedBike || !reservationDuration) return;

    const now = new Date();
    const nowTimestamp = now.getTime();
    const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    // Convert HH:MM duration to minutes
    const [hours, minutes] = reservationDuration.split(":").map(Number);
    const durationMin = hours * 60 + minutes;

    const endTimestamp = nowTimestamp + (durationMin * 60000);
    const endDate = new Date(endTimestamp);
    const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;

    setReservedBike(selectedBike.id);
    setScheduledStartTime(startTime);
    setScheduledEndTime(endTime);
    setScheduledEndTimestamp(endTimestamp);
    localStorage.setItem("scheduledBike", selectedBike.id);
    localStorage.setItem("scheduledStartTime", startTime);
    localStorage.setItem("scheduledEndTime", endTime);
    localStorage.setItem("scheduledEndTimestamp", endTimestamp.toString());

    setShowReservationDialog(false);
    setSelectedBike(null);
    setReservationDuration("01:00");
  };

  const handleCancelScheduledReservation = () => {
    setReservedBike(null);
    setScheduledStartTime("");
    setScheduledEndTime("");
    setScheduledEndTimestamp(0);
    localStorage.removeItem("scheduledBike");
    localStorage.removeItem("scheduledStartTime");
    localStorage.removeItem("scheduledEndTime");
    localStorage.removeItem("scheduledEndTimestamp");
  };

  const formatTimeLeft = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCenterMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      });
    }
  };

  // Calculate map center - focus on unlocked/reserved bike or user location
  const getMapCenter = (): [number, number] => {
    if (unlockedBike) {
      const bike = bikes.find((b) => b.id === unlockedBike);
      if (bike) {
        // Center between user and bike
        return [
          (userLocation[0] + bike.lat) / 2,
          (userLocation[1] + bike.lng) / 2
        ];
      }
    }
    if (reservedBike) {
      const bike = bikes.find((b) => b.id === reservedBike);
      if (bike) {
        return [
          (userLocation[0] + bike.lat) / 2,
          (userLocation[1] + bike.lng) / 2
        ];
      }
    }
    return userLocation;
  };

  return (
    <div className="relative h-screen w-full flex flex-col">
      {/* Map */}
      <div className="flex-1 relative">
        <Map
          center={getMapCenter()}
          zoom={14}
          height={window.innerHeight}
        >
          {/* User location marker */}
          <Marker
            width={40}
            anchor={userLocation}
            color="#3b82f6"
          />

          {/* Path to unlocked bike */}
          {unlockedBike && (() => {
            const bike = bikes.find((b) => b.id === unlockedBike);
            if (!bike) return null;
            return <PathLine from={userLocation} to={[bike.lat, bike.lng]} color="#ef4444" />;
          })()}

          {/* Path to reserved bike */}
          {reservedBike && (() => {
            const bike = bikes.find((b) => b.id === reservedBike);
            if (!bike) return null;
            return <PathLine from={userLocation} to={[bike.lat, bike.lng]} color="#f59e0b" />;
          })()}

          {/* Bike markers */}
          {bikes.map((bike) => {
            const isUnlocked = bike.id === unlockedBike;
            const isScheduledReserved = bike.id === reservedBike;
            const isUnavailable = isUnlocked || isScheduledReserved;

            let color = "#10b981"; // green - available
            let width = 40;

            if (isUnlocked) {
              color = "#ef4444"; // red - unlocked/in use
              width = 50;
            } else if (isScheduledReserved) {
              color = "#f59e0b"; // amber - scheduled reservation
              width = 45;
            }

            return (
              <Marker
                key={bike.id}
                width={width}
                anchor={[bike.lat, bike.lng]}
                color={color}
                onClick={() => !isUnavailable && setSelectedBike(bike)}
              />
            );
          })}

          {/* Unlocked bike pulse overlay */}
          {unlockedBike && (() => {
            const bike = bikes.find((b) => b.id === unlockedBike);
            if (!bike) return null;

            return (
              <Overlay anchor={[bike.lat, bike.lng]} offset={[25, 25]}>
                <div className="relative">
                  <div className="absolute w-12 h-12 bg-red-500 rounded-full opacity-50 animate-ping" />
                </div>
              </Overlay>
            );
          })()}

          {/* Scheduled reserved bike pulse overlay */}
          {reservedBike && (() => {
            const bike = bikes.find((b) => b.id === reservedBike);
            if (!bike) return null;

            return (
              <Overlay anchor={[bike.lat, bike.lng]} offset={[23, 23]}>
                <div className="relative">
                  <div className="absolute w-10 h-10 bg-amber-500 rounded-full opacity-50 animate-ping" />
                </div>
              </Overlay>
            );
          })()}
        </Map>

        {/* Floating controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
          <Button
            size="icon"
            onClick={handleCenterMap}
            className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
          >
            <Navigation className="h-5 w-5" />
          </Button>
        </div>

        {/* Top navigation */}
        <div className="absolute top-4 left-4 right-16 z-[1000]">
          <Card className="p-3 flex items-center justify-between bg-white/95 backdrop-blur">
            <div className="flex items-center gap-2">
              <Bike className="h-6 w-6 text-emerald-500" />
              <span className="font-semibold text-lg">Veloom</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate("/history")}
              >
                <History className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate("/subscription")}
              >
                <CreditCard className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate("/profile")}
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom sheet - Only show if no active ride */}
      {!activeRide && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000]">
          <Card className="rounded-t-3xl rounded-b-none p-6 bg-white shadow-2xl">
            {/* Unlocked Bike (immediate - 30 min) */}
            {unlockedBike && (() => {
              const bike = bikes.find((b) => b.id === unlockedBike);
              if (!bike) return null;

              const distance = Math.round(
                calculateDistance(userLocation[0], userLocation[1], bike.lat, bike.lng)
              );

              return (
                <Card className="p-4 mb-4 border-red-500 bg-red-50 border-2">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bike className="h-5 w-5 text-red-600" />
                      <div>
                        <Badge className="bg-red-500 mb-1">Desbloqueada</Badge>
                        <p className="font-semibold text-lg">{bike.id}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelUnlock}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <p className="text-sm text-red-900">
                        {distance}m de distância
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-600" />
                      <p className="text-sm text-red-900">
                        Disponível por: {formatTimeLeft(unlockTimeLeft)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-red-500 hover:bg-red-600"
                      onClick={() => {
                        localStorage.setItem("unlockBikeId", bike.id);
                        navigate("/unlock");
                      }}
                    >
                      Ir para Desbloqueio
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleCancelUnlock}
                    >
                      Cancelar
                    </Button>
                  </div>
                </Card>
              );
            })()}


            {/* Only show bike selection UI if no unlocked bike */}
            {!unlockedBike && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">E-bikes disponíveis</h2>
                    <p className="text-sm text-gray-500">
                      {bikesByDistance.filter((b) => b.id !== unlockedBike).length} bikes próximas
                    </p>
                  </div>
                </div>

                {selectedBike && !reservedBike && (
                  <Card className="p-4 mb-4 border-emerald-200 bg-emerald-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{selectedBike.id}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <p className="text-sm text-gray-600">
                            ~{Math.round(
                              calculateDistance(
                                userLocation[0],
                                userLocation[1],
                                selectedBike.lat,
                                selectedBike.lng
                              )
                            )}m de distância
                          </p>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full"
                                style={{ width: `${selectedBike.battery}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {Math.round(selectedBike.battery)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-3">
                        <Button
                          onClick={() => handleOpenReservationDialog(selectedBike)}
                          className="bg-amber-500 hover:bg-amber-600"
                          size="sm"
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Reservar
                        </Button>
                        <Button
                          onClick={() => handleUnlockBike(selectedBike)}
                          className="bg-emerald-500 hover:bg-emerald-600"
                          size="sm"
                        >
                          <Bike className="h-4 w-4 mr-1" />
                          Desbloquear
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {(() => {
                    // Get bikes to display - prioritize reserved bike
                    let bikesToShow = bikesByDistance.filter((b) => b.id !== unlockedBike);

                    // If there's a reserved bike, make sure it's included
                    if (reservedBike) {
                      const reservedBikeData = bikes.find((b) => b.id === reservedBike);
                      if (reservedBikeData) {
                        bikesToShow = [
                          reservedBikeData,
                          ...bikesToShow.filter((b) => b.id !== reservedBike)
                        ];
                      }
                    }

                    return bikesToShow.map((bike) => {
                      const distance = Math.round(
                        calculateDistance(userLocation[0], userLocation[1], bike.lat, bike.lng)
                      );
                      const isReserved = bike.id === reservedBike;

                      return (
                        <Card
                          key={bike.id}
                          className={`p-3 min-w-[160px] cursor-pointer relative ${
                            isReserved
                              ? "border-2 border-amber-500 bg-amber-50 hover:border-amber-600"
                              : "hover:border-emerald-300"
                          }`}
                          onClick={() => !isReserved && setSelectedBike(bike)}
                        >
                          {isReserved && (
                            <>
                              <Badge className="absolute -top-2 -right-2 bg-amber-500 text-xs">
                                Reservada
                              </Badge>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-0 right-0 h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelScheduledReservation();
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <Bike className={`h-4 w-4 ${isReserved ? "text-amber-500" : "text-emerald-500"}`} />
                            <p className="font-semibold text-sm">{bike.id}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                            <MapPin className="h-3 w-3" />
                            <span>~{distance}m</span>
                          </div>
                          {isReserved && scheduledEndTime && (
                            <div className="flex items-center gap-1 text-xs text-amber-700 mb-2">
                              <Clock className="h-3 w-3" />
                              <span>Até {scheduledEndTime}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${isReserved ? "bg-amber-500" : "bg-emerald-500"}`}
                                style={{ width: `${bike.battery}%` }}
                              />
                            </div>
                            <span className="text-xs">{Math.round(bike.battery)}%</span>
                          </div>
                        </Card>
                      );
                    });
                  })()}
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {/* Reservation Dialog */}
      <Dialog open={showReservationDialog} onOpenChange={setShowReservationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reservar</DialogTitle>
            <DialogDescription>
              Reserve {selectedBike?.id} por um período de tempo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Duração da Reserva</label>
              <Input
                type="time"
                value={reservationDuration}
                onChange={(e) => setReservationDuration(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Formato: HH:MM (ex: 01:30 = 1 hora e 30 minutos)
              </p>
            </div>

            {reservationDuration && (() => {
              const now = new Date();
              const startTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

              const [hours, minutes] = reservationDuration.split(":").map(Number);
              const durationMin = hours * 60 + minutes;

              if (durationMin === 0) {
                return (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-800">
                      A duração deve ser maior que 0 minutos
                    </p>
                  </div>
                );
              }

              const endDate = new Date(now.getTime() + durationMin * 60000);
              const endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`;

              const bufferEndDate = new Date(endDate.getTime() + 10 * 60000);
              const bufferEndTime = `${bufferEndDate.getHours().toString().padStart(2, "0")}:${bufferEndDate.getMinutes().toString().padStart(2, "0")}`;

              return (
                <div className="p-3 bg-blue-50 rounded-lg space-y-1">
                  <p className="text-sm font-medium text-blue-900">Resumo da Reserva:</p>
                  <p className="text-sm text-blue-800">
                    <strong>Início:</strong> {startTime} (agora)
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Fim:</strong> {endTime}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Duração:</strong> {hours}h {minutes}min ({durationMin} minutos)
                  </p>
                  <p className="text-xs text-blue-700 mt-2">
                    Bike disponível para outros após: {bufferEndTime} (fim + 10 min)
                  </p>
                </div>
              );
            })()}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReservationDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmReservation}
              disabled={!reservationDuration || (() => {
                const [hours, minutes] = reservationDuration.split(":").map(Number);
                return (hours * 60 + minutes) === 0;
              })()}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Confirmar Reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}