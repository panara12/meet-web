import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Separator from "./ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Label } from "./ui/label";
import {
  Search,
  Info,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  Building,
  Calendar,
  Shield,
  MoreHorizontal,
  Eye,
  Edit,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Route,
  RefreshCw,
  Zap,
  FolderOpen,
  ExternalLink,
  Loader2,
  Cable,
  ChevronLeft, ChevronRight,
  Upload,
  FilePlus,
  FileText,
  Download,
  Trash2,
  ImageIcon,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { useStaff } from "./StaffContext";
import { useFileManagement } from "./FileManagementContext";
import { GoogleMap, Marker } from '@react-google-maps/api';
import DirectionsMapComponent from "../../component/mappathgenerater.jsx";
import { useGoogleMaps, mapContainerStyles, defaultMapOptions } from '../../utils/googlemaps.jsx';
import { Textarea } from "./ui/textarea.jsx";
import { useSelector } from 'react-redux';


const digital_ocean_url = import.meta.env.VITE_DIGITAL_OCEAN_URL;

const GoogleMapViewWithTracking = ({ latitude, longitude, staffName, address, onMapLoad }) => {
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Use the common Google Maps loader
  const { isLoaded, loadError } = useGoogleMaps();

  console.log("Map coords:", latitude, longitude);

  // Null/undefined checks
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return (
      <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground font-medium">Location coordinates not available</p>
          <p className="text-sm text-muted-foreground mt-1">Request a location update to see the map</p>
        </div>
      </div>
    );
  }

  const center = {
    lat: latitude,
    lng: longitude
  };

  const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

  // Called when map is loaded
  const onLoad = useCallback((map) => {
    console.log("✅ Map loaded successfully!");
    setMap(map);
    setMapLoaded(true);

    // Call the callback to decrement request count
    if (onMapLoad && !mapLoaded) {
      onMapLoad();
    }
  }, [onMapLoad, mapLoaded]);

  // Called when map is unmounted
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle load error
  if (loadError) {
    console.error("Map load error:", loadError);
    toast.error("Failed to load Google Maps");

    return (
      <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <MapPin className="h-12 w-12 text-destructive mx-auto mb-2" />
          <p className="text-destructive font-medium mb-2">Failed to load map</p>
          <p className="text-sm text-muted-foreground mb-3">
            {loadError.message || "Please check your API key and internet connection"}
          </p>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-sm underline inline-flex items-center gap-1"
          >
            Open in Google Maps
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="ml-2 text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  // Render map
  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyles.default}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={defaultMapOptions}
      >
        {/* Red marker at the location */}
        <Marker
          position={center}
          title={staffName || "Staff Location"}
          animation={window.google?.maps?.Animation?.DROP}
        />
      </GoogleMap>

      {/* Info overlay at the bottom */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <p className="font-medium text-sm">{staffName || "Staff Member"}</p>
        <p className="text-xs text-muted-foreground">
          Lat: {latitude?.toFixed(6) || "N/A"}, Lng: {longitude?.toFixed(6) || "N/A"}
        </p>
        {address && (
          <p className="text-xs text-muted-foreground mt-1">{address}</p>
        )}
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-xs underline mt-1 inline-flex items-center gap-1"
        >
          Open in Google Maps
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Success indicator after map loads */}
      {mapLoaded && (
        <div className="absolute top-3 right-3 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium">
          ✓ Map Loaded
        </div>
      )}
    </div>
  );
};

function SalesPanel() {
  const {
    staff,
    requestLocationUpdate,
    getLocationHistory,
    clearLocationHistory,
    toggleLocationTracking,
    getCommonLocationStats,
    fetchStaffLocation,
    decrementLocationRequest,
    decrementPathRequest,
    limits,
    isLoading,
    isError,
    isLocationLoading,
    fetchPathPoints,
    isPathPointsLoading,

    currentPage,
    setCurrentPage,
    pagelimit,
    setLimit,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    roleFilter,
    setRoleFilter,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    totalPages,
    totalRecords,
  } = useStaff();
  console.log("SalesPanel render: isLoading =", isLoading, ", staff count =", staff.length);

  const {
    fetchStaffFiles,     // ✅ NEW: Call this to LOAD files
    getStaffFiles,       // ✅ Call this to GET loaded files
    getWeeklyFileCount,
    uploadFile,
    deleteFile,
    isLoadings           // ✅ NEW: Shows loading state
  } = useFileManagement();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showFilesDialog, setShowFilesDialog] = useState(false);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [selectedDay, setSelectedDay] = useState("monday");
  const [fileDescription, setFileDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState(null);
  const [fetchedLocation, setFetchedLocation] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [pathPoints, setPathPoints] = useState([]);
  const [isLoadingPath, setIsLoadingPath] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preventDialogClose, setPreventDialogClose] = useState(false);
  const userInfo = useSelector((state) => state.app.userInfo);

  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };
  // console.log("staff files are here",getStaffFiles())

  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const getRoleColor = (role) => {
    if (!role) return "bg-gray-100 text-gray-800 border-gray-200";

    switch (role.toLowerCase()) {
      case "admin": return "bg-red-100 text-red-800 border-red-200";
      case "sales-man":
      case "salesman": return "bg-blue-100 text-blue-800 border-blue-200";
      // case "biller":
      // case "billing": return "bg-green-100 text-green-800 border-green-200";
      case "packager":
      case "packaging": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "on leave": return "bg-yellow-100 text-yellow-800";
      case "terminated": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAvatarInitials = (firstName, lastName) => {
    const first = (firstName || "A")[0];
    const last = (lastName || "B")[0];
    return `${first}${last}`.toUpperCase();
  };

  const getLocationFromAddress = (address) => {
    if (!address) return "No address";
    const parts = address.split(',');
    return parts.length >= 2 ? parts.slice(-2).join(',').trim() : address;
  };

  const handleLocationDialogClose = useCallback((open) => {
    setShowLocationDialog(open);

    if (!open) {
      setFetchedLocation(null);
      setIsMapLoaded(false);
      setPathPoints([]);
      setSelectedDate(getTodayDate());
    }
  }, []);

  const handleMapLoad = useCallback(() => {
    console.log("🎯 handleMapLoad called!");
    console.log("Current isMapLoaded state:", isMapLoaded);

    if (!isMapLoaded) {
      console.log("✅ Setting isMapLoaded to true");
      setIsMapLoaded(true);

      console.log("📉 Attempting to decrement location request count...");

      const success = decrementLocationRequest();

      if (success) {
        console.log("✅ Location request count decremented successfully!");
        toast.success("Request count updated");
      } else {
        console.error("❌ Failed to decrement location request count");
        toast.error("Failed to update request count");
      }
    } else {
      console.log("⚠️ Map already loaded, skipping decrement");
    }
  }, [isMapLoaded, decrementLocationRequest]);

  const handleViewInfo = (member) => {
    setSelectedStaff(member);
    setShowInfoDialog(true);
  };

  const handleLocationTracker = (member) => {
    setSelectedStaff(member);
    setShowLocationDialog(true);
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const validFiles = [];

    for (const file of Array.from(files)) {
      // File type validation
      const isValidType = file.type.includes('pdf') || file.type.includes('image');
      if (!isValidType) {
        toast.error(`${file.name} is not a valid file type. Only PDF and image files are allowed.`);
        continue;
      }

      // File size validation (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum file size is 10MB.`);
        continue;
      }

      validFiles.push(file);
    }

    setSelectedFiles(validFiles);
    toast.success(`${validFiles.length} file(s) selected`);
  };

  const handleUploadFiles = async () => {
    if (!selectedStaff) {
      toast.error("No staff member selected");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setIsUploading(true);

    try {
      console.log('🚀 Starting upload for', selectedFiles.length, 'files');

      const success = await uploadFile(
        selectedStaff._id,
        selectedDay,
        selectedFiles,
        fileDescription
      );

      if (success) {
        toast.success(`${selectedFiles.length} file(s) uploaded successfully`);
        setFileDescription('');
        setSelectedFiles([]);
        // Clear file input
        const fileInput = document.getElementById('file-upload');
        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        toast.error('Failed to upload files');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Upload failed: " + (error?.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDailyFiles = (member) => {
    console.log('🎯 Opening files dialog for:', member._id);
    setSelectedStaff(member);
    setShowFilesDialog(true);

    // ✅ FETCH FILES when dialog opens
    if (member?._id) {
      fetchStaffFiles(member._id);
    }
  };

  const handleRequestLocation = useCallback(async () => {
    if (!selectedStaff) {
      toast.error("No staff member selected");
      return;
    }

    const isSalesman = selectedStaff?.role?.toLowerCase() === "salesman" ||
      selectedStaff?.role?.toLowerCase() === "sales-man";

    if (!isSalesman) {
      toast.error("Location tracking is only available for salesmen");
      return;
    }

    console.log("🌍 Fetching location for staff:", selectedStaff._id);

    setIsUpdatingLocation(true);
    setFetchedLocation(null);
    setIsMapLoaded(false);

    try {
      const locationData = await fetchStaffLocation(selectedStaff._id);

      if (locationData) {
        console.log("✅ Location data received:", locationData);
        setFetchedLocation(locationData);
        toast.success("Location fetched successfully");
      } else {
        console.error("❌ No location data received");
        toast.error("Failed to fetch location");
      }
    } catch (error) {
      console.error("❌ Location fetch error:", error);

      if (error.message.includes("limit reached")) {
        toast.error("Monthly location request limit reached");
      } else if (error.message.includes("User ID is required")) {
        toast.error("Invalid user ID");
      } else {
        toast.error(error.message || "Error fetching location");
      }
    } finally {
      setIsUpdatingLocation(false);
    }
  }, [selectedStaff, fetchStaffLocation]);

  const handleFetchPathPoints = useCallback(async () => {
    if (!selectedStaff) {
      toast.error("No staff member selected");
      return;
    }

    const isSalesman = selectedStaff?.role?.toLowerCase() === "salesman" ||
      selectedStaff?.role?.toLowerCase() === "sales-man";

    if (!isSalesman) {
      toast.error("Path tracking is only available for salesmen");
      return;
    }

    const stats = getCommonLocationStats();
    if (stats.pathRemaining <= 0) {
      toast.error("Monthly path request limit reached");
      return;
    }

    console.log("🗺️ Fetching path for date:", selectedDate);

    setIsLoadingPath(true);
    setPathPoints([]);

    try {
      const coordinates = await fetchPathPoints(selectedStaff._id, selectedDate);

      if (coordinates && coordinates.length > 0) {
        console.log("✅ Loaded", coordinates.length, "points");
        setPathPoints(coordinates);

        const success = decrementPathRequest();
        if (success) {
          console.log("✅ Path request count decremented");
          toast.success(`Path loaded with ${coordinates.length} points`);
        } else {
          console.error("❌ Failed to decrement path request count");
          toast.success(`Path loaded with ${coordinates.length} points (count update failed)`);
        }
      } else {
        toast.info("No path data found for this date");
        setPathPoints([]);
      }
    } catch (error) {
      console.error("❌ Path fetch error:", error);
      toast.error(error.message || "Error fetching path");
      setPathPoints([]);
    } finally {
      setIsLoadingPath(false);
    }
  }, [selectedStaff, selectedDate, fetchPathPoints, decrementPathRequest, getCommonLocationStats]);

  const handleClearHistory = (staffId) => {
    if (!staffId) return;
    clearLocationHistory(staffId);
    toast.success("Location history cleared");
  };

  
    // Handle file download
    const handleDownload = (file) => {
      try {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloading ${file.name}`);
      } catch (error) {
        console.error('Download error:', error);
        toast.error('Failed to download file');
      }
    };
  
    // Handle file preview
    const handlePreview = (file) => {
      setSelectedFile(file);
      setShowPreview(true);
    };
  
    // Close preview
    const closePreview = (e) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      setShowPreview(false);
      setSelectedFile(null);
    };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  const getRequestsRemaining = () => {
    const stats = getCommonLocationStats();
    return stats.remaining;
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedStaff) return;

    setIsUploading(true);

    try {
      const formData = new FormData();

      // Validate and append all files
      for (const file of Array.from(files)) {
        // File type validation
        const isValidType = file.type.includes('pdf') || file.type.includes('image');
        if (!isValidType) {
          toast.error(`${file.name} is not a valid file type. Only PDF and image files are allowed.`);
          continue;
        }

        // File size validation (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum file size is 10MB.`);
          continue;
        }

        // Append file to FormData
        formData.append('files[]', file);
      }

      // Add metadata to FormData
      formData.append('file_day', selectedDay);
      formData.append('file_description', fileDescription || '');
      formData.append('uploaded_by', userInfo?.tenant_user_id || '');
      formData.append('uploaded_for', selectedStaff._id);

      // ✅ Call upload with FormData
      const success = await uploadFile(
        selectedStaff._id,  // staffId
        selectedDay,        // day
        formData,           // FormData with files and metadata
        fileDescription     // description (optional, already in FormData)
      );

      if (success) {
        toast.success('Files queued for upload');
        setFileDescription('');
        // Clear file input
        if (event.target) {
          event.target.value = "";
        }
      } else {
        toast.error('Failed to queue files for upload');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileDelete = async (fileId, fileName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${fileName}?`);
    if (!confirmDelete) return;

    setDeletingFileId(fileId);

    try {
      const success = await deleteFile(fileId);
      if (success) {
        toast.success(`${fileName} deleted successfully`);
      } else {
        toast.error(`Failed to delete ${fileName}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Delete failed");
    } finally {
      setDeletingFileId(null);
    }
  };


  const handleSendMessage = (member) => {
    if (!member) return;
    toast.info(`Message sent to ${member.firstName || ''} ${member.lastName || ''}`);
  };

  const handleViewProfile = (member) => {
    setSelectedStaff(member);
    setShowInfoDialog(true);
  };

  const handleEditDetails = (member) => {
    if (!member) return;
    toast.info(`Edit mode for ${member.firstName || ''} ${member.lastName || ''}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading staff data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium text-center mb-2">Error Loading Data</h3>
            <p className="text-muted-foreground text-center">
              Unable to load staff information. Please try refreshing the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="ml-10 lg:hidden">
        <h1 className="text-xl">Staff Panel</h1>
      </div>
      <div className="space-y-6 max-[1023px]:mt-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* <div>
            <h2 className="max-[1024px]:hidden text-xl">Staff Panel</h2>
            <p className="text-muted-foreground">Manage and monitor all staff members with quick access to their information</p>
          </div> */}
          <div className="flex space-x-6 max-[509px]:space-x-0 max-[509px]:space-y-5  max-[509px]:flex-col">
            <div className="flex space-x-5">
              <Badge variant="outline" className="text-sm">
                {limits?.data[0]?.adminlimit + limits?.data[0]?.salesmanlimit + limits?.data[0]?.packagelimit || 0} Total Staff
              </Badge>
              <Badge variant="outline" className="text-sm">
                {(staff || []).filter(s => s?.status?.toLowerCase() === "active").length} Active
              </Badge>
            </div>
            {console.log("limits info",limits)}
            {
              limits?.data[0]?.wantToUseLocation && 
              <div className="flex space-x-5">
                <Badge
                  variant={getRequestsRemaining() <= 5 ? "destructive" : "outline"}
                  className="text-sm"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {getRequestsRemaining()} Requests Left
                </Badge>
                <Badge
                  variant={getRequestsRemaining() <= 5 ? "destructive" : "outline"}
                  className="text-sm"
                >
                  <Cable className="h-3 w-3 mr-1" />
                  {limits?.data[0].routeLocationlimit} Paths Left
                </Badge>
              </div>
            }
            
          </div>
        </div>

        {/* Staff Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Admin</p>
                  <p className="text-xl font-semibold">
                    {limits?.data[0]?.adminlimit || 0}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Salesman</p>
                  <p className="text-xl font-semibold">
                    {limits?.data[0]?.salesmanlimit || 0}
                  </p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Biller</p>
                  <p className="text-xl font-semibold">
                    {limits?.data[0]?.billinglimit || 0}
                  </p>
                </div>
                <Building className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card> */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Packager</p>
                  <p className="text-xl font-semibold">
                    {limits?.data[0]?.packagelimit || 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff by name, role, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Staff Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!isLoading && staff.map((member) => (
            <Card key={member?._id || Math.random()} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getAvatarInitials(member?.firstName, member?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {member?.firstName || 'Unknown'} {member?.lastName || ''}
                      </CardTitle>
                      <CardDescription>{member?.employeeId || 'N/A'}</CardDescription>
                    </div>
                  </div>
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 hidden w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewProfile(member)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditDetails(member)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendMessage(member)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getRoleColor(member?.role)} variant="outline">
                    {member?.role || 'No Role'}
                  </Badge>
                  <Badge className={getStatusColor(member?.status)} variant="secondary">
                    {member?.status?.toLowerCase() === "active" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {member?.status?.toLowerCase() === "inactive" && <AlertCircle className="h-3 w-3 mr-1" />}
                    {member?.status || 'Unknown'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{member?.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{member?.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{member?.department || 'No department'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{getLocationFromAddress(member?.address)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Last login: {member?.lastLogin || 'Never'}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleViewInfo(member)}
                  >
                    <Info className="h-3 w-3" />
                    Info
                  </Button>
                  {(member?.role?.toLowerCase() === "sales-man" || member?.role?.toLowerCase() === "salesman")&&(limits?.data[0]?.wantToUseLocation) && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleLocationTracker(member)}
                      >
                        <MapPin className="h-3 w-3" />
                        Location
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleDailyFiles(member)}
                      >
                        <FolderOpen className="h-3 w-3" />
                        Files
                        {getWeeklyFileCount && getWeeklyFileCount(member?._id) > 0 && (
                          <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                            {getWeeklyFileCount(member?._id)}
                          </Badge>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* pagination */}
        <div>
          {!isLoading && staff.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pagelimit) + 1} to {Math.min(currentPage * pagelimit, totalRecords)} of {totalRecords} staff members
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = currentPage - 2 + idx;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm">Per page:</Label>
                  <Select
                    value={pagelimit.toString()}
                    onValueChange={(val) => {
                      setLimit(parseInt(val));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* No Results */}
        {staff.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No staff members found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your search terms or check if all staff members are loaded correctly.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Staff Info Dialog */}
        <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Staff Information</DialogTitle>
              <DialogDescription>
                Detailed information for {selectedStaff?.firstName} {selectedStaff?.lastName}
              </DialogDescription>
            </DialogHeader>

            {selectedStaff && (
              <ScrollArea className="max-h-[400px]">
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="work">Work Details</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Full Name</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.firstName} {selectedStaff.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Employee ID</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.employeeId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-sm text-muted-foreground text-wrap">{selectedStaff.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium">Address</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.address}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Emergency Contact</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff?.emergencyContact?.name || "Not provided"}</p>
                        <p className="text-sm text-muted-foreground">{selectedStaff?.emergencyContact?.phone || "Not provided"}</p>
                        <p className="text-sm text-muted-foreground">{selectedStaff?.emergencyContact?.relationship || "Not provided"}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="work" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Role</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.role}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Department</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.department}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Status</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.status}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Work Hours</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.workHours}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Salary</label>
                        <p className="text-sm text-muted-foreground">${selectedStaff.salary?.toLocaleString()}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium">Notes</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.notes || "No notes available"}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Aadhaar Number</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.aadhaarNumber || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">PAN Number</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.panNumber || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Driving License</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.drivingLicenseNumber || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Bank Account</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.bankAccountNumber || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Bank Name</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.bankName || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">IFSC Code</label>
                        <p className="text-sm text-muted-foreground">{selectedStaff.ifscCode || "Not provided"}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>

        {/* Location Tracker Dialog */}
        {
          limits?.data[0]?.wantToUseLocation && 
          <Dialog open={showLocationDialog} onOpenChange={handleLocationDialogClose}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Location Tracker - {selectedStaff?.firstName} {selectedStaff?.lastName}
              </DialogTitle>
              <DialogDescription>
                Live location tracking and path history for {selectedStaff?.employeeId || 'N/A'}
              </DialogDescription>
            </DialogHeader>

            {/* Show warning if limit reached */}
            {getRequestsRemaining() === 0 && (
              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-medium">Location Request Limit Reached</p>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  The monthly location request limit has been reached.
                  No more location updates can be requested until next month.
                </p>
              </div>
            )}

            {selectedStaff && (
              <ScrollArea className="max-h-[70vh]">
                <Tabs defaultValue="current" className="w-full">
                  <TabsList className="flex w-full my-8 sm:my-2  flex-col sm:flex-row">
                    <TabsTrigger value="current">Current Location</TabsTrigger>
                    <TabsTrigger value="path">Path History</TabsTrigger>
                    <TabsTrigger value="usage">Usage Stats</TabsTrigger>
                  </TabsList>

                  <TabsContent value="current" forceMount className="space-y-4 data-[state=inactive]:hidden">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Live Location</h3>
                        <Button
                          onClick={handleRequestLocation}
                          disabled={
                            isUpdatingLocation ||
                            getRequestsRemaining() <= 0 ||
                            isLocationLoading
                          }
                          className="flex items-center gap-2"
                        >
                          {(isUpdatingLocation || isLocationLoading) ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Zap className="h-4 w-4" />
                          )}
                          {isUpdatingLocation || isLocationLoading ? "Fetching..." : "Get Live Location"}
                        </Button>
                      </div>

                      {/* Show loading state */}
                      {isLocationLoading && (
                        <div className="p-8 border rounded-lg text-center">
                          <Loader2 className="h-12 w-12 text-primary mx-auto mb-2 animate-spin" />
                          <p className="text-muted-foreground">Fetching location from server...</p>
                        </div>
                      )}

                      {/* Show location if it exists */}
                      {!isLocationLoading && fetchedLocation && (
                        <div className="p-4 border rounded-lg bg-muted/50">
                          {/* Google Maps View with tracking */}
                          <GoogleMapViewWithTracking
                            latitude={fetchedLocation.latitude}
                            longitude={fetchedLocation.longitude}
                            staffName={`${selectedStaff?.firstName || ''} ${selectedStaff?.lastName || ''}`}
                            address={fetchedLocation.address}
                            onMapLoad={handleMapLoad}
                          />

                          {/* {isMapLoaded && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-2 text-green-800">
                                <CheckCircle2 className="h-4 w-4" />
                                <p className="text-sm font-medium">
                                  Location loaded successfully. Request count updated.
                                </p>
                              </div>
                            </div>
                          )} */}

                          {/* <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="text-sm font-medium">Address</label>
                              <p className="text-sm text-muted-foreground">
                                {fetchedLocation.address || "Address not available"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Fetched At</label>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(fetchedLocation.timestamp)}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Coordinates</label>
                              <p className="text-sm text-muted-foreground font-mono">
                                {fetchedLocation.latitude?.toFixed(6) || "N/A"}, 
                                {fetchedLocation.longitude?.toFixed(6) || "N/A"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Accuracy</label>
                              <p className="text-sm text-muted-foreground">
                                GPS Location
                              </p>
                            </div>
                          </div> */}
                        </div>
                      )}

                      {/* No location available */}
                      {!isLocationLoading && !fetchedLocation && (
                        <div className="p-8 border rounded-lg text-center">
                          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground font-medium">No Location Data</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Click "Get Live Location" to fetch the current position from server
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="path" forceMount className="space-y-4 data-[state=inactive]:hidden">
                    <div className="space-y-4">
                      {/* Header with Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-medium">Movement Path</h3>

                        <div className="flex justify-between items-center gap-2">
                          {/* Date Input */}
                          <div className="flex sm:space-x-4 space-x-1">
                            <Label htmlFor="path-date" className="text-sm">
                              Date:
                            </Label>
                            <Input
                              id="path-date"
                              type="text"
                              placeholder="dd/mm/yyyy"
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              className="w-32 text-sm"
                            />
                          </div>
                          {/* Load Path Button */}
                          <Button
                            onClick={handleFetchPathPoints}
                            disabled={
                              isLoadingPath ||
                              isPathPointsLoading ||
                              getCommonLocationStats().pathRemaining <= 0
                            }
                            size="sm"
                          >
                            {(isLoadingPath || isPathPointsLoading) ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Loading...
                              </>
                            ) : (
                              <>
                                <Route className="h-4 w-4 mr-2" />
                                Load Path
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Loading State */}
                      {(isLoadingPath || isPathPointsLoading) && (
                        <div className="p-8 border rounded-lg text-center">
                          <Loader2 className="h-12 w-12 text-primary mx-auto mb-2 animate-spin" />
                          <p className="text-muted-foreground">Loading path data...</p>
                        </div>
                      )}

                      {/* Path Map */}
                      {!isLoadingPath && !isPathPointsLoading && pathPoints.length > 0 && (
                        <div className="p-4 border rounded-lg bg-muted/50">
                          <div className="mb-4">
                            <p className="text-sm font-medium">Path for {selectedDate}</p>
                            <p className="text-xs text-muted-foreground">
                              {pathPoints.length} location points tracked
                            </p>
                          </div>

                          {/* PASS COORDINATES TO YOUR COMPONENT */}
                          <DirectionsMapComponent coordinates={pathPoints} />
                        </div>
                      )}

                      {/* No Data State */}
                      {!isLoadingPath && !isPathPointsLoading && pathPoints.length === 0 && (
                        <div className="p-8 border rounded-lg text-center">
                          <Route className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground font-medium">No Path Data</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Select a date and click "Load Path" to view movement history
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Add Usage Stats Tab with Common Limits */}
                  <TabsContent value="usage" forceMount className="space-y-4 data-[state=inactive]:hidden">
                    <div className="space-y-6">
                      {/* Common Usage Stats */}
                      <div className="p-4 border rounded-lg bg-blue-50">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium text-blue-900">Common Location Requests (All Users)</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Total Requests Used</span>
                            <span className="font-medium">
                              {getCommonLocationStats().used} / {limits?.data[0]?.totalLiveLocationlimit || 0}
                            </span>
                          </div>
                          <Progress
                            value={(getCommonLocationStats().used / limits?.data[0]?.totalLiveLocationlimit) * 100}
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{getCommonLocationStats().remaining} requests remaining</span>
                            <span>Shared across all staff</span>
                          </div>
                        </div>
                        <div className="space-y-3 mt-4">
                          <div className="flex justify-between text-sm">
                            <span>Total Path Requests Used</span>
                            <span className="font-medium">
                              {getCommonLocationStats().pathRemaining} / {limits?.data[0]?.totalLiveLocationlimit || 0}
                            </span>
                          </div>
                          <Progress
                            value={(getCommonLocationStats().pathRemaining / limits?.data[0]?.totalLiveLocationlimit) * 100}
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{getCommonLocationStats().pathRemaining} requests remaining</span>
                            <span>Shared across all staff</span>
                          </div>
                        </div>
                      </div>

                      {/* Warning if limit is close */}
                      {getCommonLocationStats().remaining <= 5 && getCommonLocationStats().remaining > 0 && (
                        <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                          <div className="flex items-center gap-2 text-orange-800">
                            <AlertCircle className="h-5 w-5" />
                            <p className="font-medium">Low Request Balance</p>
                          </div>
                          <p className="text-sm text-orange-700 mt-1">
                            Only {getCommonLocationStats().remaining} location requests remaining this month.
                            The limit resets at the start of each month.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
        }

        {/* Daily Files Dialog */}
        <Dialog open={showFilesDialog} onOpenChange={(open) => {
          setShowFilesDialog(open);

          if (!showPreview) {
            setShowFilesDialog(open);
            // ✅ FETCH FILES when dialog opens
            if (open && selectedStaff?._id) {
              console.log('🎯 Dialog opened, fetching files for:', selectedStaff._id);
              fetchStaffFiles(selectedStaff._id);
            }
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Daily Files - {selectedStaff?.firstName} {selectedStaff?.lastName}
              </DialogTitle>
              <DialogDescription>
                Upload and manage daily files for {selectedStaff?.employeeId}
              </DialogDescription>
            </DialogHeader>

            {selectedStaff && (
              <ScrollArea className="max-h-[70vh]">
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Files</TabsTrigger>
                    <TabsTrigger value="manage">Manage Files</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4">
                    <div className="space-y-4 sm:space-y-6">
                      {/* Day Selection */}
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="text-sm sm:text-base font-medium">Select Day</Label>
                        <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5 sm:gap-2">
                          {Object.entries(dayNames).map(([day, dayName]) => (
                            <Button
                              key={day}
                              variant={selectedDay === day ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedDay(day)}
                              className="text-xs h-8 sm:h-9"
                            >
                              {/* Mobile: First 3 letters, Desktop: Full name */}
                              <span className="hidden sm:inline">{dayName.slice(0, 3)}</span>
                              <span className="sm:hidden">{dayName.slice(0, 2)}</span>
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Selected: <span className="font-medium">{dayNames[selectedDay]}</span>
                        </p>
                      </div>

                      {/* File Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm sm:text-base">
                          File Description (Optional)
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Enter a description for the files..."
                          value={fileDescription}
                          onChange={(e) => setFileDescription(e.target.value)}
                          rows={3}
                          className="text-sm resize-none"
                        />
                      </div>

                      {/* File Upload */}
                      <div className="space-y-3 sm:space-y-4">
                        <Label className="text-sm sm:text-base font-medium">Upload Files</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-6 lg:p-8">
                          <div className="text-center">
                            <Upload className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                            <h4 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">
                              Select Files to Upload
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 px-2">
                              Support for PDF and image files up to 10MB each
                            </p>

                            <input
                              type="file"
                              id="file-upload"
                              multiple
                              accept=".pdf,.png,.jpg,.jpeg,.gif,.bmp,.webp"
                              onChange={handleFileSelect}
                              className="hidden"
                              disabled={isUploading}
                            />

                            <div className="flex flex-col gap-2 items-center">
                              <Button
                                onClick={() => document.getElementById('file-upload')?.click()}
                                disabled={isUploading}
                                variant="outline"
                                className="text-sm"
                              >
                                <FilePlus className="h-4 w-4 mr-2" />
                                Select Files
                              </Button>

                              {selectedFiles.length > 0 && (
                                <div className="mt-3 sm:mt-4 w-full px-2 sm:px-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs sm:text-sm font-medium">
                                      Selected Files ({selectedFiles.length})
                                    </p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedFiles([]);
                                        const fileInput = document.getElementById('file-upload');
                                        if (fileInput) fileInput.value = "";
                                      }}
                                      className="text-xs h-6 px-2"
                                    >
                                      Clear All
                                    </Button>
                                  </div>
                                  
                                  <div className="space-y-1.5 max-h-32 sm:max-h-40 overflow-y-auto overflow-x-hidden pr-1">
                                    {selectedFiles.map((file, index) => (
                                      <div 
                                        key={index} 
                                        className="group flex items-start gap-2 p-2 bg-muted hover:bg-muted/80 rounded-md transition-colors"
                                      >
                                        {/* File type icon */}
                                        <div className="flex-shrink-0 mt-0.5">
                                          {file.type.includes('pdf') ? (
                                            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                                          ) : (
                                            <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
                                          )}
                                        </div>
                                        
                                        {/* File details */}
                                        <div className="flex-1 min-w-0">
                                          {/* File name */}
                                          <div className="flex items-start gap-1.5">
                                            <p 
                                              className="text-xs flex-1 min-w-0 break-words sm:break-normal sm:truncate"
                                              title={file.name}
                                            >
                                              {file.name}
                                            </p>
                                          </div>
                                          
                                          {/* File size and type */}
                                          <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-muted-foreground">
                                              {formatFileSize(file.size)}
                                            </span>
                                            <span className="text-xs text-muted-foreground">•</span>
                                            <span className="text-xs text-muted-foreground uppercase">
                                              {file.type.split('/')[1] || file.type}
                                            </span>
                                          </div>
                                        </div>
                                        
                                        {/* Remove button */}
                                        <button
                                          onClick={() => {
                                            const newFiles = selectedFiles.filter((_, i) => i !== index);
                                            setSelectedFiles(newFiles);
                                            if (newFiles.length === 0) {
                                              const fileInput = document.getElementById('file-upload');
                                              if (fileInput) fileInput.value = "";
                                            }
                                          }}
                                          className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 rounded transition-all"
                                          title="Remove file"
                                        >
                                          <X className="h-3 w-3 text-destructive" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>

                                  <Button
                                    onClick={handleUploadFiles}
                                    disabled={isUploading}
                                    className="w-full mt-3 sm:mt-4 text-sm"
                                  >
                                    {isUploading ? (
                                      <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Uploading...
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload {selectedFiles.length} File(s)
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground mt-2">
                              You can select multiple files at once
                            </p>
                          </div>
                        </div>

                        {/* File Type Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border rounded-lg">
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-xs sm:text-sm">PDF Documents</p>
                              <p className="text-xs text-muted-foreground truncate">
                                Reports, presentations, contracts
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 border rounded-lg">
                            <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-xs sm:text-sm">Images</p>
                              <p className="text-xs text-muted-foreground truncate">
                                Photos, screenshots, diagrams
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                    {/* Manage Files Tab */}
                    <TabsContent value="manage" className="space-y-4">
                      <div className="space-y-4">
                        {selectedStaff && (() => {
                          const staffFiles = getStaffFiles();

                          if (!staffFiles) {
                            return (
                              <div className="text-center py-8">
                                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h4 className="font-medium mb-2">No Files Uploaded</h4>
                                <p className="text-sm text-muted-foreground">
                                  Upload files in the Upload tab to get started
                                </p>
                              </div>
                            );
                          }

                          const currentWeek = staffFiles.currentWeek || {};

                          return (
                            <div className="space-y-4">
                              {/* Weekly Overview - Mobile Responsive */}
                              <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5 sm:gap-2">
                                {Object.entries(dayNames).map(([day, dayName]) => {
                                  const fileCount = currentWeek[day]?.length || 0;
                                  return (
                                    <div key={day} className="text-center">
                                      <Button
                                        variant={selectedDay === day ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedDay(day)}
                                        className="text-xs w-full h-auto py-2 px-1"
                                      >
                                        <div className="flex flex-col items-center gap-1">
                                          {/* Mobile: 2 letters, Tablet+: 3 letters */}
                                          <span className="sm:hidden">{dayName.slice(0, 2)}</span>
                                          <span className="hidden sm:inline">{dayName.slice(0, 3)}</span>
                                          <Badge 
                                            variant="secondary" 
                                            className="h-4 px-1 text-xs min-w-[1.25rem]"
                                          >
                                            {fileCount}
                                          </Badge>
                                        </div>
                                      </Button>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Files for Selected Day */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-sm sm:text-base">
                                    {dayNames[selectedDay]} Files
                                  </h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {currentWeek[selectedDay]?.length || 0} files
                                  </Badge>
                                </div>

                                {!currentWeek[selectedDay] || currentWeek[selectedDay].length === 0 ? (
                                  <div className="text-center py-6 text-muted-foreground">
                                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No files for {dayNames[selectedDay]}</p>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {currentWeek[selectedDay].map((file) => (
                                      <div 
                                        key={file.id} 
                                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 border rounded-lg"
                                      >
                                        {/* File Info */}
                                        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                                          {file.type === 'pdf' ? (
                                            <FileText className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                          ) : (
                                            <ImageIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <p className="font-medium text-xs sm:text-sm break-words">
                                              {file.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                              {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                                            </p>
                                            {file.description && (
                                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                "{file.description}"
                                              </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                              Uploaded by: {file.uploadedBy?.distributer_name}
                                            </p>
                                          </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-1.5 sm:gap-2 flex-shrink-0 justify-end sm:justify-start">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handlePreview(file)}
                                            title="Preview"
                                            className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                                          >
                                            <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDownload(file)}
                                            title="Download"
                                            className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                                          >
                                            <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleFileDelete(file.id, file.name)}
                                            disabled={deletingFileId === file.id}
                                            title="Delete"
                                            className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                                          >
                                            {deletingFileId === file.id ? (
                                              <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
                                            ) : (
                                              <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                </TabsContent>

                </Tabs>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>

        {/* Preview Modal */}
              {showPreview && selectedFile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-[100]" onClick={(e) => {
      // Only close if clicking the backdrop, not the content
      if (e.target === e.currentTarget) {
        closePreview();
      }
    }}>
                  <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
                  onClick={(e) => e.stopPropagation()}>
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {selectedFile.type === 'pdf' ? (
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                        ) : (
                          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">{selectedFile.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            Uploaded by {selectedFile.uploadedBy.name}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e)=>{
                          e.stopPropagation();
                          e.preventDefault();
                          closePreview()}}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                      >
                        <span className="text-gray-500 text-xl sm:text-2xl leading-none">×</span>
                      </button>
                    </div>
                    
                    {/* Modal Content */}
                    <div className="flex-1 overflow-auto bg-gray-300">
                      {selectedFile.type === 'pdf' ? (
                        // PDF Preview
                        <iframe
                          src={digital_ocean_url+selectedFile.url}
                          className="w-full h-full min-h-[400px] sm:min-h-[500px]"
                          title={selectedFile.name}
                        />
                      ) : (
                        // Image Preview
                        <div className="p-2 sm:p-4 flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
                          <img
                            src={digital_ocean_url+selectedFile.url}
                            alt={selectedFile.name}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `
                                <div class="text-center p-4">
                                  <div class="text-gray-400 mb-4">
                                    <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <p class="text-sm sm:text-base text-gray-600 mb-4">Failed to load image preview</p>
                                  <button onclick="window.open('${digital_ocean_url}${selectedFile.url}', '_blank')" class="px-3 py-2 sm:px-4 sm:py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                    Download to View
                                  </button>
                                </div>
                              `;
                            }}
                          />
                        </div>
                      )}
                    </div>
        
                    {/* Modal Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 border-t border-gray-200 bg-white flex-shrink-0">
                      <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                        {selectedFile.size} • {selectedFile.type.toUpperCase()}
                      </div>
                      <button
                        onClick={() => handleDownload(selectedFile)}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm bg-[#1E3986] text-white rounded-md hover:bg-[#162d73] transition-colors w-full sm:w-auto"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              )}
      </div>
    </div>
  );
}

export default SalesPanel;