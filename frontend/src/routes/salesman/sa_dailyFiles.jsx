import React, { useState, useEffect } from 'react';
import { Eye, Download, FileText, Image, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { useGetFilesById } from '../../hooks/file/useGetFileById';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

// ENV CONFIG
const digital_ocean_url = import.meta.env.VITE_DIGITAL_OCEAN_URL;

// Days of the week
const daysOfWeek = [
  { key: 'monday', name: 'Monday' },
  { key: 'tuesday', name: 'Tuesday' },
  { key: 'wednesday', name: 'Wednesday' },
  { key: 'thursday', name: 'Thursday' },
  { key: 'friday', name: 'Friday' },
  { key: 'saturday', name: 'Saturday' },
  { key: 'sunday', name: 'Sunday' }
];

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Main component
export default function DailyFiles() {
  const [activeDay, setActiveDay] = useState('monday');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filesByDay, setFilesByDay] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });

  // Get logged-in user info
  const userInfo = useSelector((state) => state.app.userInfo);
  const userId = userInfo?.tenant_user_id;

  console.log('👤 Current User ID:', userId);

  // Fetch files for the logged-in user
  const { 
    data: filesData, 
    isPending: isLoading, 
    isError,
    error 
  } = useGetFilesById(userId);

  // Transform backend files to day-wise format
  useEffect(() => {
    if (filesData?.files) {
      console.log('📁 Received files:', filesData.files.length);
      
      const organizedFiles = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      };

      filesData.files.forEach(file => {
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
            uploadedBy: file.uploaded_by_user?.name || 
                        file.uploaded_by_user?.firstName || 
                        'Admin',
            size: formatFileSize(file.file_size || 0),
            description: file.file_description || ''
          };

          organizedFiles[day].push(transformedFile);
        }
      });

      setFilesByDay(organizedFiles);
      console.log('📊 Files organized by day:', organizedFiles);
    }
  }, [filesData]);

  // Get files for current day
  const currentDayFiles = filesByDay[activeDay] || [];

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
  const closePreview = () => {
    setShowPreview(false);
    setSelectedFile(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Files</h3>
            <p className="text-gray-500">Fetching your daily files...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="bg-white rounded-lg border border-red-200 p-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Files</h3>
            <p className="text-gray-500 mb-4">
              {error?.message || 'Unable to load files. Please try again later.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-gray-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Daily Files</h1>
              <p className="text-sm text-gray-500">
                View and download files uploaded by admin for each day of the week
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Files</p>
            <p className="text-2xl font-bold text-blue-600">
              {Object.values(filesByDay).reduce((sum, files) => sum + files.length, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Day Selection Tabs */}
      <div className="bg-white border-x border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto">
          {daysOfWeek.map((day) => {
            const fileCount = filesByDay[day.key]?.length || 0;
            return (
              <button
                key={day.key}
                onClick={() => setActiveDay(day.key)}
                className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeDay === day.key
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>{day.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
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

      {/* Files Section */}
      <div className="bg-white rounded-b-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {daysOfWeek.find(d => d.key === activeDay)?.name}
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            {currentDayFiles.length} {currentDayFiles.length === 1 ? 'file' : 'files'} uploaded by admin
          </p>
        </div>

        <div className="p-6">
          {currentDayFiles.length > 0 ? (
            <div className="space-y-4">
              {currentDayFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {file.type === 'pdf' ? (
                          <div className="flex items-center gap-2">
                            <FileText className="w-6 h-6 text-red-600" />
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
                              PDF
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Image className="w-6 h-6 text-blue-600" />
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                              IMAGE
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                        <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500 mt-1">
                          <span>Uploaded by {file.uploadedBy}</span>
                          <span>•</span>
                          <span>{file.uploadedAt}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Size: {file.size}
                        </div>
                        {file.description && (
                          <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                            <span className="font-medium">Note:</span> {file.description}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <button
                        onClick={() => handlePreview(file)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        title="View file"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-[#1E3986] hover:bg-[#162d73] rounded-md transition-colors"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
              <p className="text-gray-500">
                Admin hasn't uploaded any files for {daysOfWeek.find(d => d.key === activeDay)?.name} yet.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {selectedFile.type === 'pdf' ? (
                  <FileText className="w-5 h-5 text-red-600 flex-shrink-0" />
                ) : (
                  <Image className="w-5 h-5 text-blue-600 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900 truncate">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    Uploaded by {selectedFile.uploadedBy} on {selectedFile.uploadedAt}
                  </p>
                </div>
              </div>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2"
              >
                <span className="text-gray-500 text-xl">×</span>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-auto bg-gray-50">
              {selectedFile.type === 'pdf' ? (
                // PDF Preview
                <iframe
                  src={selectedFile.url}
                  className="w-full h-full min-h-[500px]"
                  title={selectedFile.name}
                />
              ) : (
                // Image Preview
                <div className="p-4 flex items-center justify-center min-h-[500px]">
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.name}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="text-center">
                          <div class="text-gray-400 mb-4">
                            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p class="text-gray-600 mb-4">Failed to load image preview</p>
                          <button onclick="window.open('${selectedFile.url}', '_blank')" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
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
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="text-sm text-gray-500">
                {selectedFile.size} • {selectedFile.type.toUpperCase()}
              </div>
              <button
                onClick={() => handleDownload(selectedFile)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E3986] text-white rounded-md hover:bg-[#162d73] transition-colors"
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