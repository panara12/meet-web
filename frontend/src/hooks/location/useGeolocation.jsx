import { useEffect, useState } from "react";
import { AlertCircle, MapPin, RefreshCw, Shield } from "lucide-react";
import { Button } from "../../routes/salesman/addOrder/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../routes/salesman/addOrder/card";

// Enhanced Geolocation Hook with Permission Handling
export function useGeolocation() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [permissionState, setPermissionState] = useState("prompt");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkPermission = async () => {
    try {
      if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: "geolocation" });
        setPermissionState(result.state);
        
        result.addEventListener("change", () => {
          setPermissionState(result.state);
        });
        
        return result.state;
      }
    } catch (error) {
      // console.log("Permission API not supported");
    }
    return "prompt";
  };

  const requestLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setPermissionState("granted");
        setIsLoading(false);
        setError(null);
      },
      (error) => {
        let errorMessage = "Unable to retrieve location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            setPermissionState("denied");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    checkPermission().then((state) => {
      if (state === "granted") {
        requestLocation();
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  return {
    location,
    permissionState,
    error,
    isLoading,
    requestLocation,
  };
}

// Location Permission Guard Component
export function LocationPermissionGuard({ children }) {
  const { location, permissionState, error, isLoading, requestLocation } = useGeolocation();
  const [showBlocker, setShowBlocker] = useState(true);

  const hasLocation = location.latitude !== null && location.longitude !== null;
  const isGranted = permissionState === "granted" && hasLocation;

  useEffect(() => {
    if (isGranted) {
      setShowBlocker(false);
    } else {
      setShowBlocker(true);
    }
  }, [isGranted]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium mb-2">Checking Location Access</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your location permissions...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isGranted && !showBlocker) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Location Access Required</CardTitle>
          <CardDescription className="text-base mt-2">
            This application requires access to your location to function properly
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Why do we need this?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Track your field visits and attendance</li>
                  <li>• Ensure accurate location-based services</li>
                  <li>• Provide better support and analytics</li>
                  <li>• Comply with company policies</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Permission Denied</h4>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {permissionState === "denied" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">How to enable location access:</h4>
              <ol className="text-sm text-yellow-800 space-y-2 ml-4 list-decimal">
                <li>Click the lock icon or info icon in your browser's address bar</li>
                <li>Find "Location" in the permissions list</li>
                <li>Change it from "Blocked" to "Allow"</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          )}

          <div className="space-y-3">
            {permissionState !== "denied" && (
              <Button 
                onClick={requestLocation} 
                className="w-full"
                size="lg"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Enable Location Access
              </Button>
            )}
            
            {permissionState === "denied" && (
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
                size="lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Your location data is encrypted and used only for authorized purposes. 
            We respect your privacy and comply with data protection regulations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}