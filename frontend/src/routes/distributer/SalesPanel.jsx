import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Separator  from "./ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
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
  Activity,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Route,
  RefreshCw,
  History,
  ToggleLeft,
  ToggleRight,
  Zap,
  Map,
  FolderOpen,
  Upload,
  FileText,
  ImageIcon,
  FilePlus,
  X,
  Download,
  Trash2
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

function SalesPanel() {
  const { staff, requestLocationUpdate, getLocationHistory, clearLocationHistory, toggleLocationTracking } = useStaff();
  const { uploadFile, getStaffFiles, getWeeklyFileCount, deleteFile } = useFileManagement();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showFilesDialog, setShowFilesDialog] = useState(false);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [showPathMap, setShowPathMap] = useState(false);
  const [selectedDay, setSelectedDay] = useState("monday");
  const [fileDescription, setFileDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState(null);

  const filteredStaff = staff.filter(member =>
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin": return "bg-red-100 text-red-800 border-red-200";
      case "Sales-man": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Biller": return "bg-green-100 text-green-800 border-green-200";
      case "Packager": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      case "On Leave": return "bg-yellow-100 text-yellow-800";
      case "Terminated": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAvatarInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getLocationFromAddress = (address) => {
    // Extract city/state from address for location display
    const parts = address.split(',');
    return parts.length >= 2 ? parts.slice(-2).join(',').trim() : address;
  };

  const handleViewInfo = (member) => {
    setSelectedStaff(member);
    setShowInfoDialog(true);
  };

  const handleLocationTracker = (member) => {
    setSelectedStaff(member);
    setShowLocationDialog(true);
  };

  const handleDailyFiles = (member) => {
    setSelectedStaff(member);
    setShowFilesDialog(true);
  };

  const handleRequestLocation = async () => {
    if (!selectedStaff) return;
    
    setIsUpdatingLocation(true);
    try {
      const success = await requestLocationUpdate(selectedStaff.id);
      if (success) {
        toast.success("Location updated successfully");
      } else {
        if (selectedStaff.locationTracking.monthlyRequestsUsed >= selectedStaff.locationTracking.monthlyRequestsLimit) {
          toast.error("Monthly location request limit reached");
        } else if (!selectedStaff.locationTracking.isTrackingEnabled) {
          toast.error("Location tracking is disabled for this staff member");
        } else {
          toast.error("Failed to update location");
        }
      }
    } catch (error) {
      toast.error("Error updating location");
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const handleToggleTracking = (staffId) => {
    toggleLocationTracking(staffId);
    toast.success("Location tracking settings updated");
  };

  const handleClearHistory = (staffId) => {
    clearLocationHistory(staffId);
    toast.success("Location history cleared");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getRequestsRemaining = (staff) => {
    return staff.locationTracking.monthlyRequestsLimit - staff.locationTracking.monthlyRequestsUsed;
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedStaff) return;

    setIsUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        // Validate file type
        const isValidType = file.type.includes('pdf') || file.type.includes('image');
        if (!isValidType) {
          toast.error(`${file.name} is not a valid file type. Only PDF and image files are allowed.`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum file size is 10MB.`);
          continue;
        }

        const success = await uploadFile(selectedStaff.id, selectedDay, file, fileDescription);
        if (success) {
          toast.success(`${file.name} uploaded successfully`);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      setFileDescription("");
      // Reset file input
      if (event.target) {
        event.target.value = "";
      }
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
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileDelete = async (staffId, day, fileId, fileName) => {
    setDeletingFileId(fileId);
    
    try {
      const success = deleteFile(staffId, day, fileId);
      if (success) {
        toast.success(`${fileName} deleted successfully`);
      } else {
        toast.error(`Failed to delete ${fileName}`);
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeletingFileId(null);
    }
  };

  const handleSendMessage = (member) => {
    toast.info(`Message sent to ${member.firstName} ${member.lastName}`);
  };

  const handleViewProfile = (member) => {
    setSelectedStaff(member);
    setShowInfoDialog(true);
  };

  const handleEditDetails = (member) => {
    toast.info(`Edit mode for ${member.firstName} ${member.lastName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2>Staff Panel</h2>
          <p className="text-muted-foreground">Manage and monitor all staff members with quick access to their information</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {staff.length} Total Staff
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {staff.filter(s => s.status === "Active").length} Active
          </Badge>
        </div>
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

      {/* Staff Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admin</p>
                <p className="text-xl font-semibold">{staff.filter(s => s.role === "Admin").length}</p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sales-man</p>
                <p className="text-xl font-semibold">{staff.filter(s => s.role === "Sales-man").length}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Biller</p>
                <p className="text-xl font-semibold">{staff.filter(s => s.role === "Biller").length}</p>
              </div>
              <Building className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Packager</p>
                <p className="text-xl font-semibold">{staff.filter(s => s.role === "Packager").length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getAvatarInitials(member.firstName, member.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{member.firstName} {member.lastName}</CardTitle>
                    <CardDescription>{member.employeeId}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
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
                </DropdownMenu>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getRoleColor(member.role)} variant="outline">
                  {member.role}
                </Badge>
                <Badge className={getStatusColor(member.status)} variant="secondary">
                  {member.status === "Active" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {member.status === "Inactive" && <AlertCircle className="h-3 w-3 mr-1" />}
                  {member.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{getLocationFromAddress(member.address)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last login: {member.lastLogin}</span>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => handleLocationTracker(member)}
                >
                  <MapPin className="h-3 w-3" />
                  Location
                </Button>
                {member.role === "Sales-man" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleDailyFiles(member)}
                  >
                    <FolderOpen className="h-3 w-3" />
                    Files
                    {getWeeklyFileCount(member.id) > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                        {getWeeklyFileCount(member.id)}
                      </Badge>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredStaff.length === 0 && (
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
                      <p className="text-sm text-muted-foreground">{selectedStaff.email}</p>
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
                      <p className="text-sm text-muted-foreground">{selectedStaff.emergencyContact || "Not provided"}</p>
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
                      <label className="text-sm font-medium">Hire Date</label>
                      <p className="text-sm text-muted-foreground">{selectedStaff.hireDate}</p>
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
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Location Tracker - {selectedStaff?.firstName} {selectedStaff?.lastName}
            </DialogTitle>
            <DialogDescription>
              Live location tracking and path history for {selectedStaff?.employeeId}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStaff && (
            <ScrollArea className="max-h-[70vh]">
              <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="current">Current Location</TabsTrigger>
                  <TabsTrigger value="path">Path History</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="usage">Usage Stats</TabsTrigger>
                </TabsList>
                
                <TabsContent value="current" className="space-y-4">
                  {/* Live Location Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Live Location</h3>
                      <Button 
                        onClick={handleRequestLocation}
                        disabled={isUpdatingLocation || !selectedStaff.locationTracking.isTrackingEnabled || getRequestsRemaining(selectedStaff) <= 0}
                        className="flex items-center gap-2"
                      >
                        {isUpdatingLocation ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                        {isUpdatingLocation ? "Updating..." : "Get Live Location"}
                      </Button>
                    </div>
                    
                    {selectedStaff.locationTracking.currentLocation && (
                      <div className="p-4 border rounded-lg bg-muted/50">
                        {/* Mock Map View */}
                        <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg mb-4 flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                          <div className="relative z-10 text-center">
                            <MapPin className="h-12 w-12 text-red-500 mx-auto mb-2" />
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                              <p className="font-medium text-sm">{selectedStaff.firstName} {selectedStaff.lastName}</p>
                              <p className="text-xs text-muted-foreground">
                                Lat: {selectedStaff.locationTracking.currentLocation.latitude.toFixed(6)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Lng: {selectedStaff.locationTracking.currentLocation.longitude.toFixed(6)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Accuracy: ±{selectedStaff.locationTracking.currentLocation.accuracy}m
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Address</label>
                            <p className="text-sm text-muted-foreground">{selectedStaff.locationTracking.currentLocation.address}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Last Updated</label>
                            <p className="text-sm text-muted-foreground">{formatDate(selectedStaff.locationTracking.currentLocation.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!selectedStaff.locationTracking.currentLocation && (
                      <div className="p-8 border rounded-lg text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No current location available</p>
                        <p className="text-sm text-muted-foreground">Request a location update to see live position</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="path" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Movement Path</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => setShowPathMap(!showPathMap)}
                        className="flex items-center gap-2"
                      >
                        <Map className="h-4 w-4" />
                        {showPathMap ? "Hide Map" : "Show Map"}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleClearHistory(selectedStaff.id)}
                        className="flex items-center gap-2 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear History
                      </Button>
                    </div>
                  </div>
                  
                  {showPathMap && (
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                        <div className="relative z-10 text-center">
                          <Route className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                            <p className="font-medium">Path Map View</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedStaff.locationTracking.locationHistory.length} location points tracked
                            </p>
                            {/* Mock path visualization */}
                            <div className="mt-4 flex justify-center">
                              <svg width="200" height="100" className="overflow-visible">
                                <path 
                                  d="M20,80 Q60,20 100,50 T180,30" 
                                  stroke="#3b82f6" 
                                  strokeWidth="3" 
                                  fill="none"
                                  strokeDasharray="5,5"
                                  className="animate-pulse"
                                />
                                <circle cx="20" cy="80" r="4" fill="#10b981" />
                                <circle cx="100" cy="50" r="4" fill="#f59e0b" />
                                <circle cx="180" cy="30" r="4" fill="#ef4444" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedStaff.locationTracking.locationHistory.length > 0 ? (
                      selectedStaff.locationTracking.locationHistory.map((location, index) => (
                        <div key={location.id} className="p-3 border rounded-lg bg-white/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-500' : index < 3 ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                              <div>
                                <p className="text-sm font-medium">{location.address}</p>
                                <p className="text-xs text-muted-foreground">
                                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{formatDate(location.timestamp)}</p>
                              <p className="text-xs text-muted-foreground">±{location.accuracy}m</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <History className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No location history available</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-4">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Location Tracking</h4>
                        <p className="text-sm text-muted-foreground">
                          Enable or disable location tracking for this staff member
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedStaff.locationTracking.isTrackingEnabled ? (
                          <ToggleRight className="h-5 w-5 text-green-500" />
                        ) : (
                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                        )}
                        <Switch 
                          checked={selectedStaff.locationTracking.isTrackingEnabled}
                          onCheckedChange={() => handleToggleTracking(selectedStaff.id)}
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Tracking Preferences</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="font-medium">Update Frequency</label>
                          <p className="text-muted-foreground">Manual request only</p>
                        </div>
                        <div>
                          <label className="font-medium">Data Retention</label>
                          <p className="text-muted-foreground">Last 20 locations</p>
                        </div>
                        <div>
                          <label className="font-medium">Accuracy Level</label>
                          <p className="text-muted-foreground">High (GPS)</p>
                        </div>
                        <div>
                          <label className="font-medium">Privacy Mode</label>
                          <p className="text-muted-foreground">Work hours only</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="usage" className="space-y-4">
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-4">Monthly Usage</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Requests Used</span>
                          <span>{selectedStaff.locationTracking.monthlyRequestsUsed} / {selectedStaff.locationTracking.monthlyRequestsLimit}</span>
                        </div>
                        <Progress 
                          value={(selectedStaff.locationTracking.monthlyRequestsUsed / selectedStaff.locationTracking.monthlyRequestsLimit) * 100}
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{getRequestsRemaining(selectedStaff)} requests remaining</span>
                          <span>Resets monthly</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">{selectedStaff.locationTracking.monthlyRequestsUsed}</p>
                        <p className="text-sm text-muted-foreground">Requests This Month</p>
                      </div>
                      <div className="p-4 border rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">{selectedStaff.locationTracking.locationHistory.length}</p>
                        <p className="text-sm text-muted-foreground">Locations Stored</p>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Last Activity</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Last Request:</span>
                          <span>{formatDate(selectedStaff.locationTracking.lastRequestDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tracking Status:</span>
                          <span className={selectedStaff.locationTracking.isTrackingEnabled ? "text-green-600" : "text-red-600"}>
                            {selectedStaff.locationTracking.isTrackingEnabled ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Daily Files Dialog */}
      <Dialog open={showFilesDialog} onOpenChange={setShowFilesDialog}>
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
                  <div className="space-y-6">
                    {/* Day Selection */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Select Day</Label>
                      <div className="grid grid-cols-7 gap-2">
                        {Object.entries(dayNames).map(([day, dayName]) => (
                          <Button
                            key={day}
                            variant={selectedDay === day ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedDay(day)}
                            className="text-xs"
                          >
                            {dayName.slice(0, 3)}
                          </Button>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Selected: <span className="font-medium">{dayNames[selectedDay]}</span>
                      </p>
                    </div>

                    {/* File Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">File Description (Optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter a description for the files..."
                        value={fileDescription}
                        onChange={(e) => setFileDescription(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Upload Files</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                        <div className="text-center">
                          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h4 className="text-lg font-medium mb-2">Upload Files</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Support for PDF and image files up to 10MB each
                          </p>
                          
                          <input
                            type="file"
                            id="file-upload"
                            multiple
                            accept=".pdf,.png,.jpg,.jpeg,.gif,.bmp,.webp"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                          
                          <Button
                            onClick={() => document.getElementById('file-upload')?.click()}
                            disabled={isUploading}
                            className="mb-2"
                          >
                            {isUploading ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <FilePlus className="h-4 w-4 mr-2" />
                                Select Files
                              </>
                            )}
                          </Button>
                          
                          <p className="text-xs text-muted-foreground">
                            You can select multiple files at once
                          </p>
                        </div>
                      </div>

                      {/* File Type Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 p-3 border rounded-lg">
                          <FileText className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="font-medium text-sm">PDF Documents</p>
                            <p className="text-xs text-muted-foreground">Reports, presentations, contracts</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 border rounded-lg">
                          <ImageIcon className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-sm">Images</p>
                            <p className="text-xs text-muted-foreground">Photos, screenshots, diagrams</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="manage" className="space-y-4">
                  <div className="space-y-4">
                    {selectedStaff && (() => {
                      const staffFiles = getStaffFiles(selectedStaff.id);
                      
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

                      return (
                        <div className="space-y-4">
                          {/* Weekly Overview */}
                          <div className="grid grid-cols-7 gap-2">
                            {Object.entries(dayNames).map(([day, dayName]) => {
                              const dayFiles = staffFiles.currentWeek[day];
                              return (
                                <div key={day} className="text-center p-3 border rounded-lg">
                                  <p className="text-xs font-medium">{dayName.slice(0, 3)}</p>
                                  <p className="text-sm text-muted-foreground">{dayFiles.length} files</p>
                                </div>
                              );
                            })}
                          </div>

                          {/* Files by Day */}
                          <Tabs defaultValue="monday" className="w-full">
                            <TabsList className="grid w-full grid-cols-7">
                              {Object.keys(dayNames).map((day) => (
                                <TabsTrigger key={day} value={day} className="text-xs">
                                  {dayNames[day].slice(0, 3)}
                                </TabsTrigger>
                              ))}
                            </TabsList>
                            
                            {Object.entries(dayNames).map(([day, dayName]) => {
                              const dayFiles = staffFiles.currentWeek[day];
                              
                              return (
                                <TabsContent key={day} value={day} className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{dayName} Files</h4>
                                    <Badge variant="secondary">{dayFiles.length} files</Badge>
                                  </div>
                                  
                                  {dayFiles.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">
                                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                      <p>No files for {dayName}</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      {dayFiles.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                                          <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {file.type === 'pdf' ? (
                                              <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                                            ) : (
                                              <ImageIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                              <p className="font-medium text-sm truncate">{file.name}</p>
                                              <p className="text-xs text-muted-foreground">
                                                {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                                              </p>
                                              {file.description && (
                                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                                  "{file.description}"
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex gap-2 flex-shrink-0">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                // Simulate download
                                                const link = document.createElement('a');
                                                link.href = file.url;
                                                link.download = file.name;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                                toast.success(`Downloaded ${file.name}`);
                                              }}
                                            >
                                              <Download className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => handleFileDelete(selectedStaff.id, day, file.id, file.name)}
                                              disabled={deletingFileId === file.id}
                                            >
                                              {deletingFileId === file.id ? (
                                                <RefreshCw className="h-3 w-3 animate-spin" />
                                              ) : (
                                                <Trash2 className="h-3 w-3" />
                                              )}
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </TabsContent>
                              );
                            })}
                          </Tabs>
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
    </div>
  );
}

export default SalesPanel