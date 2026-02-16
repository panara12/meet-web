import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../distributer/ui/card';
import { Button } from '../distributer/ui/button';
import { 
  FileText, 
  ImageIcon, 
  Download, 
  AlertCircle, 
  Loader2,
  Lock,
  File
} from 'lucide-react';
import { toast } from 'sonner';

const digital_ocean_url = import.meta.env.VITE_DIGITAL_OCEAN_URL;

const FileSharing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('auto-detect');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  // console.log('Location:', location);

  useEffect(() => {
    if (location.pathname) {
      // Remove '/sharing' prefix if present
      const path = location.pathname.replace('/sharing/', '');
      const decodedPath = decodeURIComponent(path);
      
      if (!decodedPath || decodedPath === '/') {
        setError('No file URL provided');
        setIsLoading(false);
        return;
      }

      setFileUrl(decodedPath);
      setIsLoading(false);
    } else {
      setError('No file URL provided');
      setIsLoading(false);
    }
  }, [location.pathname]);

  const handleDownload = async () => {
    if (!fileUrl) return;
    
    try {
      const fullUrl = digital_ocean_url + fileUrl;
      
      // Fetch the file as a blob
      toast.info('Starting download...');
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
      
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from URL or use default
      const filename = fileUrl.split('/').pop() || 'download';
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleImageLoad = () => {
    // console.log('Image loaded successfully');
    setFileType('image');
    setImageLoadError(false);
  };

  const handleImageError = () => {
    // console.log('Image failed to load, trying PDF');
    setImageLoadError(true);
    setFileType('pdf');
  };

  const handleIframeError = () => {
    // console.log('PDF failed to load');
    if (imageLoadError) {
      setFileType('unknown');
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 pb-6 text-center">
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium mb-2">Loading File...</h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we load your file
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State
  if (error || !fileUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200">
          <CardContent className="pt-6 pb-6 text-center">
            <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-red-900">
              Invalid Link
            </h3>
            <p className="text-sm text-red-700 mb-4">
              {error || 'No file URL found. Please check the link and try again.'}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullFileUrl = digital_ocean_url + fileUrl;

  // Success State - File Display
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto bg-primary px-4 py-4 flex items-center justify-between">
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">

          {/* File Preview */}
          <Card>
            <CardContent className="p-0">
              {fileType === 'auto-detect' && !imageLoadError ? (
                // Try to load as image first
                <div className="bg-gray-100 p-4 sm:p-8 flex items-center justify-center min-h-[400px] rounded-lg">
                  <img
                    src={fullFileUrl}
                    alt="Shared file"
                    className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg shadow-lg"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </div>
              ) : fileType === 'pdf' || (fileType === 'auto-detect' && imageLoadError) ? (
                // PDF Preview
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src={fullFileUrl}
                    className="w-full min-h-[70vh] sm:min-h-[80vh]"
                    title="PDF Preview"
                    onError={handleIframeError}
                  />
                </div>
              ) : fileType === 'image' ? (
                // Image Preview (confirmed loaded)
                <div className="bg-gray-100 p-4 sm:p-8 flex items-center justify-center min-h-[400px] rounded-lg">
                  <img
                    src={fullFileUrl}
                    alt="Shared file"
                    className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="text-center p-8">
                            <div class="text-gray-400 mb-4">
                              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p class="text-gray-600 mb-4">Failed to load image preview</p>
                          </div>
                        `;
                      }
                      toast.error('Failed to load image');
                      setFileType('unknown');
                    }}
                  />
                </div>
              ) : (
                // Unknown file type or load errors
                <div className="bg-gray-100 p-8 text-center rounded-lg min-h-[400px] flex flex-col items-center justify-center">
                  <FileText className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Preview Not Available</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This file type cannot be previewed in the browser
                  </p>
                  <Button
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Button - Mobile Only */}
          <div className="flex">
            <Button
              onClick={handleDownload}
              size="lg"
              className="w-full flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              Download File
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pb-8 text-center text-sm text-muted-foreground px-4">
        <p>This file was shared securely. Do not share this link with unknown users.</p>
      </div>
    </div>
  );
};

export default FileSharing;