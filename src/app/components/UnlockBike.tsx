import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { QrCode, Bluetooth, ArrowLeft, Scan, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";

export function UnlockBike() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [bluetoothDevices, setBluetoothDevices] = useState<string[]>([]);
  const [bikeCode, setBikeCode] = useState("");
  const [unlockedBike, setUnlockedBike] = useState<string | null>(null);
  const [preselectedBike, setPreselectedBike] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const unlocked = localStorage.getItem("unlockedBike");
    const preselected = localStorage.getItem("unlockBikeId");
    setUnlockedBike(unlocked);
    setPreselectedBike(preselected);

    // Clear preselected after loading
    if (preselected) {
      localStorage.removeItem("unlockBikeId");
    }
  }, []);

  const validateBikeAccess = (bikeId: string): boolean => {
    if (unlockedBike && unlockedBike !== bikeId) {
      setError(`Você já desbloqueou a bike ${unlockedBike}. Apenas pode usar esta bike.`);
      return false;
    }
    return true;
  };

  const clearUnlock = (bikeId: string) => {
    if (unlockedBike === bikeId) {
      localStorage.removeItem("unlockedBike");
      localStorage.removeItem("unlockTime");
    }
  };

  const handleQRScan = () => {
    setError("");
    setScanning(true);
    // Simulate QR scan
    setTimeout(() => {
      setScanning(false);
      const scannedBike = preselectedBike || unlockedBike || "VLM001";

      if (validateBikeAccess(scannedBike)) {
        clearUnlock(scannedBike);
        navigate("/ride/" + scannedBike);
      }
    }, 2000);
  };

  const handleBluetoothSearch = () => {
    setError("");
    // Simulate Bluetooth search
    setBluetoothDevices([]);
    setTimeout(() => {
      const devices = unlockedBike
        ? [`Veloom ${unlockedBike} (15m)`]
        : [
            "Veloom VLM001 (15m)",
            "Veloom VLM003 (28m)",
            "Veloom VLM006 (42m)",
          ];
      setBluetoothDevices(devices);
    }, 1500);
  };

  const handleBluetoothConnect = (device: string) => {
    const bikeId = device.split(" ")[1];

    if (validateBikeAccess(bikeId)) {
      clearUnlock(bikeId);
      navigate("/ride/" + bikeId);
    }
  };

  const handleManualUnlock = () => {
    setError("");
    if (bikeCode.length === 6) {
      const bikeId = bikeCode.toUpperCase();

      if (validateBikeAccess(bikeId)) {
        clearUnlock(bikeId);
        navigate("/ride/" + bikeId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Desbloquear E-bike</h1>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* Unlocked Bike Info */}
        {unlockedBike && (
          <Card className="p-4 mb-4 bg-red-50 border-red-500 border-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Bike Desbloqueada</p>
                <p className="text-sm text-red-800">
                  Você desbloqueou a bike <strong>{unlockedBike}</strong>. Apenas esta bike pode ser usada.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-4 bg-red-50 border-red-500 border-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Acesso Negado</p>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </Card>
        )}

        <Tabs defaultValue="qr" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="bluetooth" className="flex items-center gap-2">
              <Bluetooth className="h-4 w-4" />
              Bluetooth
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Manual
            </TabsTrigger>
          </TabsList>

          {/* QR Code Tab */}
          <TabsContent value="qr" className="mt-6">
            <Card className="p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className={`w-64 h-64 border-4 border-emerald-500 rounded-2xl flex items-center justify-center ${scanning ? 'animate-pulse' : ''}`}>
                    {scanning ? (
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm text-gray-600">A processar...</p>
                      </div>
                    ) : (
                      <QrCode className="h-32 w-32 text-gray-300" />
                    )}
                  </div>
                  {!scanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-1 bg-emerald-500/30 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">
                    Aponte para o QR Code da bike
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    O código está localizado no guiador da e-bike
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  onClick={handleQRScan}
                  disabled={scanning}
                >
                  {scanning ? "A escanear..." : "Escanear QR Code"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Bluetooth Tab */}
          <TabsContent value="bluetooth" className="mt-6">
            <Card className="p-6">
              <div className="text-center mb-6">
                <Bluetooth className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold text-lg mb-2">
                  Ligar via Bluetooth
                </h3>
                <p className="text-sm text-gray-600">
                  Certifique-se que o Bluetooth está ativado
                </p>
              </div>

              {bluetoothDevices.length === 0 ? (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleBluetoothSearch}
                >
                  Procurar E-bikes Próximas
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    E-bikes disponíveis:
                  </p>
                  {bluetoothDevices.map((device, idx) => (
                    <Card
                      key={idx}
                      className="p-4 cursor-pointer hover:border-emerald-500 transition-colors"
                      onClick={() => handleBluetoothConnect(device)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bluetooth className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">{device.split(" (")[0]}</p>
                            <p className="text-xs text-gray-500">
                              {device.split("(")[1]?.replace(")", "")}
                            </p>
                          </div>
                        </div>
                        <Button size="sm">Conectar</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Manual Tab */}
          <TabsContent value="manual" className="mt-6">
            <Card className="p-6">
              <div className="text-center mb-6">
                <Scan className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="font-semibold text-lg mb-2">
                  Código Manual
                </h3>
                <p className="text-sm text-gray-600">
                  Insira o código de 6 dígitos da e-bike
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="VLM001"
                    maxLength={6}
                    className="text-center text-xl font-mono tracking-wider uppercase"
                    value={bikeCode}
                    onChange={(e) => setBikeCode(e.target.value.toUpperCase())}
                  />
                </div>

                <Button
                  size="lg"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  onClick={handleManualUnlock}
                  disabled={bikeCode.length !== 6}
                >
                  Desbloquear
                </Button>

                <p className="text-xs text-center text-gray-500">
                  O código está impresso no guiador e no quadro da bike
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Info card */}
        <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Dica:</strong> Para desbloquear rapidamente, utilize o QR Code ou Bluetooth. A bike só funciona com a aplicação ativa.
          </p>
        </Card>
      </div>
    </div>
  );
}
