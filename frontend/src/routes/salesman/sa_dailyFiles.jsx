import React, { useState } from 'react';
import { Eye, Download, FileText, Image, Calendar, X } from 'lucide-react';

// Sample data - in a real app, this would come from an API
const sampleFiles = [
  {
    day: "Monday",
    files: [
      {
        id: "1",
        name: "Weekly Sales Report.pdf",
        type: "pdf",
        uploadedAt: "Jan 08, 2024 09:30 AM",
        uploadedBy: "Admin",
        size: "2.4 MB"
      },
      {
        id: "2",
        name: "Product Catalog.pdf",
        type: "pdf",
        uploadedAt: "Jan 08, 2024 10:15 AM",
        uploadedBy: "Admin",
        size: "5.2 MB"
      },
      {
        id: "3",
        name: "Team Photo.jpg",
        type: "image",
        uploadedAt: "Jan 08, 2024 02:30 PM",
        uploadedBy: "Admin",
        size: "1.8 MB"
      }
    ]
  },
  {
    day: "Tuesday",
    files: [
      {
        id: "4",
        name: "Training Manual.pdf",
        type: "pdf",
        uploadedAt: "Jan 09, 2024 11:00 AM",
        uploadedBy: "Admin",
        size: "3.1 MB"
      },
      {
        id: "5",
        name: "Office Layout.png",
        type: "image",
        uploadedAt: "Jan 09, 2024 03:45 PM",
        uploadedBy: "Admin",
        size: "954 KB"
      }
    ]
  },
  {
    day: "Wednesday",
    files: [
      {
        id: "6",
        name: "Client Presentation.pdf",
        type: "pdf",
        uploadedAt: "Jan 10, 2024 08:45 AM",
        uploadedBy: "Admin",
        size: "4.7 MB"
      }
    ]
  },
  {
    day: "Thursday",
    files: [
      {
        id: "7",
        name: "Marketing Materials.pdf",
        type: "pdf",
        uploadedAt: "Jan 11, 2024 01:20 PM",
        uploadedBy: "Admin",
        size: "6.3 MB"
      },
      {
        id: "8",
        name: "Product Showcase.jpg",
        type: "image",
        uploadedAt: "Jan 11, 2024 04:15 PM",
        uploadedBy: "Admin",
        size: "2.1 MB"
      }
    ]
  },
  {
    day: "Friday",
    files: [
      {
        id: "9",
        name: "Weekly Summary.pdf",
        type: "pdf",
        uploadedAt: "Jan 12, 2024 05:30 PM",
        uploadedBy: "Admin",
        size: "1.9 MB"
      }
    ]
  },
  {
    day: "Saturday",
    files: []
  },
  {
    day: "Sunday",
    files: []
  }
];

// Main component
export default function DailyFiles() {
  const [activeDay, setActiveDay] = useState("Monday");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Get the files for the currently selected day
  const currentDayData = sampleFiles.find(d => d.day === activeDay);
  const currentDayFiles = currentDayData?.files || [];

  // Handle file download
  const handleDownload = (file) => {
    alert(`Downloading ${file.name}...`);
    console.log('Download:', file);
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

  return (
    <div className="flex-1 bg-gray-50 p-6">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-gray-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Daily Files</h1>
            <p className="text-sm text-gray-500">View and download files uploaded by admin for each day of the week</p>
          </div>
        </div>
      </div>
    </div>
      {/* Day Selection Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
        <div className="flex">
          {sampleFiles.map((dayData) => (
            <button
              key={dayData.day}
              onClick={() => setActiveDay(dayData.day)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeDay === dayData.day
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {dayData.day}
            </button>
          ))}
        </div>
      </div>

      {/* Files Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">{activeDay}</h2>
          </div>
          <p className="text-sm text-gray-500">
            {currentDayFiles.length} files uploaded by admin
          </p>
        </div>

        <div className="p-6">
          {currentDayFiles.length > 0 ? (
            <div className="space-y-4">
              {currentDayFiles.map((file) => (
                <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {file.type === 'pdf' ? (
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-medium">PDF</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Image className="w-5 h-5 text-gray-600" />
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">IMAGE</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>Uploaded by {file.uploadedBy} • {file.uploadedAt}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Size: {file.size}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreview(file)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-[#1E3986] hover:bg-[#162d73] rounded-md transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
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
              <p className="text-gray-500">Admin hasn't uploaded any files for {activeDay} yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                {selectedFile.type === 'pdf' ? (
                  <FileText className="w-5 h-5 text-gray-600" />
                ) : (
                  <Image className="w-5 h-5 text-gray-600" />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-500">
                    Uploaded by {selectedFile.uploadedBy} on {selectedFile.uploadedAt}
                  </p>
                </div>
              </div>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-gray-500 text-xl">×</span>
              </button>
            </div>
            
            <div className="p-8 text-center bg-gray-50 h-96 flex items-center justify-center">
              <div className="space-y-4">
                {selectedFile.type === 'pdf' ? (
                  <FileText className="w-16 h-16 mx-auto text-gray-400" />
                ) : (
                  <Image className="w-16 h-16 mx-auto text-gray-400" />
                )}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {selectedFile.type === 'pdf' ? 'PDF Preview' : 'Image Preview'}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    File preview is not available in this demo.<br />
                    In a real application, you would see the actual file content here.
                  </p>
                  <button
                    onClick={() => handleDownload(selectedFile)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download to View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}