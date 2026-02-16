import React, { useState, useEffect } from 'react';
import { Eye, Download, FileText, Image, Calendar, Loader2, AlertCircle, RefreshCw, ChevronDown, MessageSquare, Copy, Check, Share2, X } from 'lucide-react';
import { useGetWeekFiles } from '../../hooks/file/useGetWeekFiles';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../distributer/ui/dialog";
import { Button } from '../distributer/ui/button';
import { Label } from './addOrder/label';
import { Input } from '../distributer/ui/input';

// ENV CONFIG
const digital_ocean_url = import.meta.env.VITE_DIGITAL_OCEAN_URL;

// Days of the week (Sunday to Saturday)
const daysOfWeek = [
  { key: 'sunday', name: 'Sunday', short: 'Sun' },
  { key: 'monday', name: 'Monday', short: 'Mon' },
  { key: 'tuesday', name: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', name: 'Wednesday', short: 'Wed' },
  { key: 'thursday', name: 'Thursday', short: 'Thu' },
  { key: 'friday', name: 'Friday', short: 'Fri' },
  { key: 'saturday', name: 'Saturday', short: 'Sat' }
];

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Truncate filename
const truncateFileName = (fileName, maxLength = 30) => {
  if (!fileName || fileName.length <= maxLength) return fileName;
  
  // Get file extension
  const lastDotIndex = fileName.lastIndexOf('.');
  const extension = lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';
  const nameWithoutExt = lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
  
  // Calculate how many characters we can show
  const availableLength = maxLength - extension.length - 3; // 3 for "..."
  
  if (availableLength <= 0) {
    return fileName.substring(0, maxLength - 3) + '...';
  }
  
  return nameWithoutExt.substring(0, availableLength) + '...' + extension;
};

// Get current day of week
const getCurrentDay = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
};

// Get week date range (Sunday to Saturday)
const getWeekDateRange = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatDateShort = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  return {
    start: formatDate(startOfWeek),
    end: formatDate(endOfWeek),
    startShort: formatDateShort(startOfWeek),
    endShort: formatDateShort(endOfWeek),
    startDate: startOfWeek,
    endDate: endOfWeek
  };
};

// Main component
export default function DailyFiles() {
  const [activeDay, setActiveDay] = useState(getCurrentDay());
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filesByDay, setFilesByDay] = useState({
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: []
  });

  //share file
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedFileForShare, setSelectedFileForShare] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Get logged-in user info
  const userInfo = useSelector((state) => state.app.userInfo);
  const userId = userInfo?.tenant_user_id;

  // console.log('👤 Current User ID:', userId);
  // console.log('📅 Current Day:', activeDay);

  // Fetch files for current week
  const { 
    data: filesData, 
    isPending: isLoading, 
    isError,
    error,
    refetch
  } = useGetWeekFiles();

  // Get week range
  const weekRange = getWeekDateRange();

  // Transform backend files to day-wise format
  useEffect(() => {
    if (filesData?.data?.files) {
      // console.log('📁 Received files for current week:', filesData.data.files.length);
      // console.log('📅 Week Range from API:', filesData.data.weekRange);
      
      const organizedFiles = {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: []
      };

      filesData.data.files.forEach(file => {
        const day = file.file_day?.toLowerCase();
        
        if (day && organizedFiles[day]) {
          const transformedFile = {
            id: file._id,
            name: file.file_name,
            type: file.file_name.toLowerCase().includes('.pdf') ? 'pdf' : 'image',
            url: digital_ocean_url + file.file_url,
            uploadedAt: new Date(file.uploaded_at).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }),
            uploadedBy: file.uploaded_by?.distributer_name || 
                        file.uploaded_by?.firstName || 
                        'Admin',
            size: formatFileSize(file.file_size || 0),
            description: file.file_description || ''
          };

          organizedFiles[day].push(transformedFile);
        }
      });

      setFilesByDay(organizedFiles);
      // console.log('📊 Files organized by day:', organizedFiles);
    }
  }, [filesData]);

  // Get files for current day
  const currentDayFiles = filesByDay[activeDay] || [];

  // Handle file download
  const handleDownload = async (file) => {
    try {
      toast.info('Starting download...');
      
      const response = await fetch(file.url);
      if (!response.ok) throw new Error('Failed to fetch file');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started!');
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

  // Handle refresh
  const handleRefresh = () => {
    toast.info('Refreshing files...');
    refetch();
  };

  // Handle day change from dropdown
  const handleDayChange = (e) => {
    setActiveDay(e.target.value);
  };

  const generateShareLink = (file) => {
    if (!file) return '';
    
    const fileId = file.url.split("digitaloceanspaces.com/")[1];
    // console.log("file", fileId);
    
    const shareToken = `${fileId}`;
    const baseUrl = window.location.origin;
    
    return `${baseUrl}/sharing/${shareToken}`;
  };

  // Handle share button click
  const handleShareFile = (file) => {
    setSelectedFileForShare(file);
    setShowShareDialog(true);
    setCopiedLink(false);
  };

  // Handle copy link
  const handleCopyLink = async (file) => {
    try {
      const link = generateShareLink(file);
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      toast.success('Link copied to clipboard!');
      
      setTimeout(() => {
        setCopiedLink(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };

  // Handle WhatsApp share
  const handleShareViaWhatsApp = (file) => {
    const link = generateShareLink(file);
    const message = `Check out this file: ${file.name}\n\n${link}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  // Get current day info
  const currentDayInfo = daysOfWeek.find(d => d.key === activeDay);
  const isToday = activeDay === getCurrentDay();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 p-3 sm:p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12">
          <div className="text-center">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Loading Files</h3>
            <p className="text-sm text-gray-500">Fetching your files for this week...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex-1 bg-gray-50 p-3 sm:p-6">
        <div className="bg-white rounded-lg border border-red-200 p-8 sm:p-12">
          <div className="text-center">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Error Loading Files</h3>
            <p className="text-sm text-gray-500 mb-4">
              {error?.message || 'Unable to load files. Please try again later.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-3 sm:p-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Daily Files</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                <span className="hidden sm:inline">Current Week: {weekRange.start} - {weekRange.end}</span>
                <span className="sm:hidden">{weekRange.startShort} - {weekRange.endShort}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-500">Total Files This Week</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                {Object.values(filesByDay).reduce((sum, files) => sum + files.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Week Info Banner */}
      <div className="bg-blue-50 border-x border-blue-200 px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-blue-800">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">Showing files uploaded between {weekRange.start} and {weekRange.end}</span>
              <span className="sm:hidden">This week's files</span>
            </span>
          </div>
          <div className="text-blue-600 text-xs sm:text-sm">
            Week resets every Sunday
          </div>
        </div>
      </div>

      {/* Day Selection - Dropdown for Mobile, Tabs for Desktop */}
      <div className="bg-white border-x border-gray-200">
        {/* Mobile Dropdown (< 640px) */}
        <div className="sm:hidden px-4 py-3 border-b border-gray-200">
          <label htmlFor="day-select" className="block text-xs font-medium text-gray-700 mb-2">
            Select Day
          </label>
          <div className="relative">
            <select
              id="day-select"
              value={activeDay}
              onChange={handleDayChange}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {daysOfWeek.map((day) => {
                const fileCount = filesByDay[day.key]?.length || 0;
                const isDayToday = day.key === getCurrentDay();
                return (
                  <option key={day.key} value={day.key}>
                    {day.name} {isDayToday ? '(Today)' : ''} - {fileCount} {fileCount === 1 ? 'file' : 'files'}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Desktop Tabs (≥ 640px) */}
        <div className="hidden sm:block overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {daysOfWeek.map((day) => {
              const fileCount = filesByDay[day.key]?.length || 0;
              const isDayToday = day.key === getCurrentDay();
              
              return (
                <button
                  key={day.key}
                  onClick={() => setActiveDay(day.key)}
                  className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium border-b-2 transition-colors relative ${
                    activeDay === day.key
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  } ${isDayToday && 'bg-green-100'}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      <span>{day.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                      fileCount > 0 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {fileCount} {fileCount === 1 ? 'file' : 'files'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Files Section */}
      <div className="bg-white mt-10 rounded-b-lg border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 capitalize truncate">
              {currentDayInfo?.name}
              {isToday && (
                <span className="ml-2 text-xs sm:text-sm font-normal text-green-600">(Today)</span>
              )}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            {currentDayFiles.length} {currentDayFiles.length === 1 ? 'file' : 'files'} uploaded by admin
          </p>
        </div>

        <div className="p-3 sm:p-6">
          {currentDayFiles.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {currentDayFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="flex flex-col gap-3">
                    {/* File Info */}
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 pt-0.5 sm:pt-0">
                        {file.type === 'pdf' ? (
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                            <span className="text-[10px] sm:text-xs bg-red-100 text-red-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium">
                              PDF
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Image className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium">
                              IMAGE
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 
                          className="font-medium text-sm sm:text-base text-gray-900"
                          title={file.name} // Show full name on hover
                        >
                          {/* Mobile: 25 chars, Desktop: 40 chars */}
                          <span className="sm:hidden">{truncateFileName(file.name, 25)}</span>
                          <span className="hidden sm:inline">{truncateFileName(file.name, 50)}</span>
                        </h3>
                        <div className="flex flex-col gap-0.5 text-[10px] sm:text-xs text-gray-500 mt-1">
                          <span className="truncate">Uploaded by {file.uploadedBy}</span>
                          <span className="truncate">{file.uploadedAt}</span>
                        </div>
                        {file.description && (
                          <div className="text-[10px] sm:text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded border border-gray-200 break-words">
                            <span className="font-medium">Note:</span> {file.description}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handlePreview(file)}
                        className="flex-1 min-w-[80px] flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        title="View file"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleShareFile(file)}
                        title="Share"
                        className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="flex-1 min-w-[100px] flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white bg-[#1E3986] hover:bg-[#162d73] rounded-md transition-colors"
                        title="Download file"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
            </div>
          )}
        </div>
      </div>

      {/* Share Dialog - Mobile Responsive */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Share File
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm" title={selectedFileForShare?.name}>
              Share "{truncateFileName(selectedFileForShare?.name, 30)}" with others
            </DialogDescription>
          </DialogHeader>
          
          {selectedFileForShare && (
            <div className="space-y-3 sm:space-y-4">
              {/* Share Link */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Shareable Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={generateShareLink(selectedFileForShare)}
                    readOnly
                    className="text-xs flex-1 min-w-0"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyLink(selectedFileForShare)}
                    className="flex-shrink-0 h-9 w-9 p-0"
                  >
                    {copiedLink ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Anyone with this link can view the file
                </p>
              </div>

              {/* Share Options */}
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Share Via</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleShareViaWhatsApp(selectedFileForShare)}
                    className="flex items-center justify-center gap-2 text-xs sm:text-sm h-9 sm:h-10"
                  >
                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCopyLink(selectedFileForShare)}
                    className="flex items-center justify-center gap-2 text-xs sm:text-sm h-9 sm:h-10"
                  >
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    Copy Link
                  </Button>
                </div>
              </div>

              {/* File Info */}
              <div className="p-3 bg-muted rounded-lg space-y-1">
                <p 
                  className="text-xs sm:text-sm font-medium" 
                  title={selectedFileForShare.name}
                >
                  {truncateFileName(selectedFileForShare.name, 40)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedFileForShare.type.toUpperCase()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Modal - Mobile Responsive */}
      {showPreview && selectedFile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-500"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closePreview();
            }
          }}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {selectedFile.type === 'pdf' ? (
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                ) : (
                  <Image className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 
                    className="font-medium text-sm sm:text-base text-gray-900"
                    title={selectedFile.name}
                  >
                    {/* Mobile: 20 chars, Desktop: 50 chars */}
                    <span className="sm:hidden">{truncateFileName(selectedFile.name, 20)}</span>
                    <span className="hidden sm:inline">{truncateFileName(selectedFile.name, 50)}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    Uploaded by {selectedFile.uploadedBy}
                  </p>
                </div>
              </div>
              <button
                onClick={closePreview}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-auto bg-gray-50">
              {selectedFile.type === 'pdf' ? (
                // PDF Preview
                <iframe
                  src={selectedFile.url}
                  className="w-full h-full min-h-[400px] sm:min-h-[500px]"
                  title={selectedFile.name}
                />
              ) : (
                // Image Preview
                <div className="p-2 sm:p-4 flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.name}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="text-center p-4">
                            <div class="text-gray-400 mb-4">
                              <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p class="text-sm sm:text-base text-gray-600 mb-4">Failed to load image preview</p>
                            <button onclick="window.open('${selectedFile.url}', '_blank')" class="px-3 py-2 sm:px-4 sm:py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                              Download to View
                            </button>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 sm:p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                {selectedFile.type.toUpperCase()}
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
  );
}