import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAddFile } from '../../hooks/file/useAddFile';
import { useDeleteFile } from '../../hooks/file/useDeleteFile';
import { useGetFilesById } from '../../hooks/file/useGetFileById';
import { useSelector } from 'react-redux';

const FileManagementContext = createContext();

export const useFileManagement = () => {
  const context = useContext(FileManagementContext);
  if (!context) {
    throw new Error('useFileManagement must be used within a FileManagementProvider');
  }
  return context;
};

const createEmptyWeek = () => ({
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: []
});

// Toast notification helper
const toast = {
  success: (message) => alert(`Success: ${message}`),
  error: (message) => alert(`Error: ${message}`)
};

export function FileManagementProvider({ children }) {
  const [activeStaffId, setActiveStaffId] = useState(null);
  const [currentStaffFiles, setCurrentStaffFiles] = useState(null);
  const userInfo = useSelector((state) => state.app.userInfo);
  
  console.log('🔵 FileManagementProvider - activeStaffId:', activeStaffId);
  
  // API Hooks
  const { 
    data: filesData, 
    isPending: isGetFilesPending, 
    refetch: refetchFiles,
    isError: isFilesError 
  } = useGetFilesById(activeStaffId, {
    enabled: !!activeStaffId
  });
  
  console.log('🔵 Query state - isPending:', isGetFilesPending, 'filesData:', filesData);
  
  const { mutate: addFileMutation, isPending: isAddFilePending } = useAddFile({
    onSuccess: () => {
      console.log('✅ File upload successful!');
      toast.success('File uploaded successfully');
      if (activeStaffId) {
        console.log('🔄 Refetching files after upload...');
        setTimeout(() => refetchFiles(), 500);
      }
    },
    onError: (error) => {
      console.error('❌ File upload error:', error);
      toast.error('File upload failed: ' + (error?.message || 'Unknown error'));
    }
  });
  
  const { mutate: deleteFileMutation, isPending: isDeleteFilePending } = useDeleteFile({
    onSuccess: () => {
      console.log('✅ File deletion successful!');
      toast.success('File deleted successfully');
      if (activeStaffId) {
        console.log('🔄 Refetching files after deletion...');
        setTimeout(() => refetchFiles(), 500);
      }
    },
    onError: (error) => {
      console.error('❌ File deletion error:', error);
      toast.error('File deletion failed: ' + (error?.message || 'Unknown error'));
    }
  });

  // Transform files whenever data changes
  useEffect(() => {
    console.log('🔵 useEffect triggered - filesData:', filesData, 'activeStaffId:', activeStaffId);
    
    if (!activeStaffId) {
      console.log('❌ No active staff ID, clearing files');
      setCurrentStaffFiles(null);
      return;
    }

    if (isGetFilesPending) {
      console.log('⏳ Files are loading...');
      return;
    }

    if (filesData) {
      console.log('✅ Files data received:', filesData);
      
      if (filesData.data.files && Array.isArray(filesData.data.files)) {
        console.log('📁 Processing', filesData.data.files.length, 'files for staff:', activeStaffId);
        const transformed = transformBackendFilesToStaffFormat(filesData.data.files, activeStaffId);
        setCurrentStaffFiles(transformed);
      } else {
        console.log('📁 No files in response, setting empty week');
        setCurrentStaffFiles({
          staffId: activeStaffId,
          currentWeek: createEmptyWeek(),
          weekHistory: {}
        });
      }
    }
  }, [filesData, activeStaffId, isGetFilesPending]);

  // Transform backend files to staff-centric format
  const transformBackendFilesToStaffFormat = (backendFiles, staffId) => {
    console.log('🔄 Transforming', backendFiles.length, 'files');
    const weekData = createEmptyWeek();

    backendFiles.forEach(file => {
      const day = file.file_day?.toLowerCase();
      
      console.log('📄 Processing file:', file.file_name, 'for day:', day);
      
      if (!day || !weekData[day]) {
        console.warn('❌ Invalid day for file:', file.file_name, day);
        return;
      }

      const transformedFile = {
        id: file._id,
        name: file.file_name,
        type: file.file_name.toLowerCase().includes('.pdf') ? 'pdf' : 'image',
        url: file.file_url,
        uploadDate: file.uploaded_at,
        uploaded_for: file.uploaded_for,
        uploadedBy: file.uploaded_by,
        size: file.file_size || 0,
        description: file.file_description || undefined
      };

      weekData[day].push(transformedFile);
      console.log('✅ Added file to', day, '- Total files for day:', weekData[day].length);
    });

    console.log('📊 Final week data:', weekData);

    return {
      staffId: staffId,
      currentWeek: weekData,
      weekHistory: {}
    };
  };

  // Fetch files for a staff
  const fetchStaffFiles = (staffId) => {
    console.log('🚀 fetchStaffFiles called for:', staffId);
    
    if (!staffId) {
      console.error('❌ No staffId provided');
      return;
    }
    
    console.log('✅ Setting active staff to:', staffId);
    setActiveStaffId(staffId);
  };

  // Get current staff files
  const getStaffFiles = () => {
    console.log('📂 getStaffFiles called - returning:', currentStaffFiles);
    return currentStaffFiles;
  };

  // Upload file to backend
  const uploadFile = async (staffId, day, files, description) => {
    return new Promise((resolve, reject) => {
      try {
        console.log('📤 uploadFile called with:');
        console.log('  - staffId:', staffId);
        console.log('  - day:', day);
        console.log('  - description:', description);
        console.log('  - files:', files);
        
        // Validate inputs
        if (!staffId) {
          console.error('❌ No staffId provided to uploadFile');
          toast.error('Staff ID is required for upload');
          reject(new Error('Staff ID is required'));
          return;
        }
        
        if (!day) {
          console.error('❌ No day provided to uploadFile');
          toast.error('Day is required for upload');
          reject(new Error('Day is required'));
          return;
        }
        
        if (!files || files.length === 0) {
          console.error('❌ No files provided');
          toast.error('No files selected');
          reject(new Error('No files selected'));
          return;
        }
        
        // Create FormData
        const formData = new FormData();
        
        // Append all files
        for (const file of files) {
          formData.append('files', file);
        }
        
        // Append metadata
        formData.append('file_day', day);
        formData.append('file_description', description || '');
        formData.append('uploaded_by', userInfo?.tenant_user_id || '');
        formData.append('uploaded_for', staffId);
        
        console.log('📤 FormData created with:');
        console.log('  - files count:', files.length);
        console.log('  - file_day:', day);
        console.log('  - file_description:', description || '(none)');
        console.log('  - uploaded_by:', userInfo?.tenant_user_id);
        console.log('  - uploaded_for:', staffId);

        console.log('📤 Setting active staff to:', staffId);
        setActiveStaffId(staffId);
        
        console.log('📤 Calling addFileMutation...');
        // Call the mutation
        addFileMutation(formData, {
          onSuccess: () => {
            console.log('✅ Upload mutation resolved successfully');
            resolve(true);
          },
          onError: (error) => {
            console.error('❌ Upload mutation failed:', error);
            reject(error);
          }
        });
        
      } catch (error) {
        console.error('❌ File upload failed with exception:', error);
        toast.error('Upload failed: ' + (error?.message || 'Unknown error'));
        reject(error);
      }
    });
  };

  // Delete file from backend
  const deleteFile = (fileId) => {
    try {
      console.log('🗑️ deleteFile called with:');
      console.log('  - fileId:', fileId);
      
      // Validate inputs
      if (!fileId) {
        console.error('❌ No fileId provided to deleteFile');
        toast.error('File ID is required');
        return false;
      }
      
      console.log('🗑️ Calling deleteFileMutation...');
      deleteFileMutation({ id: fileId });
      
      console.log('✅ Delete mutation triggered successfully');
      return true;
    } catch (error) {
      console.error('❌ File deletion failed with exception:', error);
      toast.error('Delete failed: ' + (error?.message || 'Unknown error'));
      return false;
    }
  };

  // Get files for a specific day
  const getFilesForDay = (day) => {
    if (!currentStaffFiles) return [];
    return currentStaffFiles.currentWeek[day] || [];
  };

  // Get all current week files
  const getCurrentWeekFiles = () => {
    if (!currentStaffFiles) return createEmptyWeek();
    return currentStaffFiles.currentWeek || createEmptyWeek();
  };

  // Get total file count for the week
  const getWeeklyFileCount = (staffId) => {
    if (!currentStaffFiles || currentStaffFiles.staffId !== staffId) return 0;
    return Object.values(currentStaffFiles.currentWeek).reduce(
      (total, dayFiles) => total + dayFiles.length, 
      0
    );
  };

  return (
    <FileManagementContext.Provider value={{
      // State
      isLoading: isGetFilesPending,
      isUploading: isAddFilePending,
      isDeleting: isDeleteFilePending,
      isError: isFilesError,
      activeStaffId,
      
      // Methods
      fetchStaffFiles,
      getStaffFiles,
      uploadFile,
      deleteFile,
      getFilesForDay,
      getCurrentWeekFiles,
      getWeeklyFileCount,
    }}>
      {children}
    </FileManagementContext.Provider>
  );
}