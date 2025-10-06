import React, { createContext, useContext, useState } from 'react';

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

// Mock file upload simulation
const simulateFileUpload = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUrl = `https://files.example.com/${Date.now()}_${file.name}`;
      resolve(mockUrl);
    }, 1000);
  });
};

// Initial mock data for staff files
const initialStaffFiles = [];

export function FileManagementProvider({ children }) {
  const [staffFiles, setStaffFiles] = useState(initialStaffFiles);

  const uploadFile = async (staffId, day, file, description) => {
    try {
      const fileUrl = await simulateFileUpload(file);

      const newFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        url: fileUrl,
        uploadDate: new Date().toISOString(),
        uploadedBy: "Admin",
        size: file.size,
        description: description || undefined
      };

      setStaffFiles(prev => {
        const updatedFiles = [...prev];
        const staffIndex = updatedFiles.findIndex(sf => sf.staffId === staffId);

        if (staffIndex === -1) {
          // Create new staff file entry
          updatedFiles.push({
            staffId,
            employeeId: `EMP-${staffId.split('-')[1] || staffId}`,
            staffName: "Staff Member",
            currentWeek: {
              ...createEmptyWeek(),
              [day]: [newFile]
            },
            weekHistory: {}
          });
        } else {
          // Update existing staff file entry
          updatedFiles[staffIndex] = {
            ...updatedFiles[staffIndex],
            currentWeek: {
              ...updatedFiles[staffIndex].currentWeek,
              [day]: [...updatedFiles[staffIndex].currentWeek[day], newFile]
            }
          };
        }

        return updatedFiles;
      });

      return true;
    } catch (error) {
      console.error('File upload failed:', error);
      return false;
    }
  };

  const deleteFile = (staffId, day, fileId) => {
    try {
      setStaffFiles(prev => {
        const updatedFiles = [...prev];
        const staffIndex = updatedFiles.findIndex(sf => sf.staffId === staffId);

        if (staffIndex !== -1) {
          updatedFiles[staffIndex] = {
            ...updatedFiles[staffIndex],
            currentWeek: {
              ...updatedFiles[staffIndex].currentWeek,
              [day]: updatedFiles[staffIndex].currentWeek[day].filter(file => file.id !== fileId)
            }
          };
        }

        return updatedFiles;
      });

      return true;
    } catch (error) {
      console.error('File deletion failed:', error);
      return false;
    }
  };

  const getStaffFiles = (staffId) => {
    return staffFiles.find(sf => sf.staffId === staffId);
  };

  const getFilesForDay = (staffId, day) => {
    const staff = staffFiles.find(sf => sf.staffId === staffId);
    return staff?.currentWeek[day] || [];
  };

  const getCurrentWeekFiles = (staffId) => {
    const staff = staffFiles.find(sf => sf.staffId === staffId);
    return staff?.currentWeek;
  };

  const getWeeklyFileCount = (staffId) => {
    const staff = staffFiles.find(sf => sf.staffId === staffId);
    if (!staff) return 0;
    return Object.values(staff.currentWeek).reduce((total, dayFiles) => total + dayFiles.length, 0);
  };

  const getAllStaffWithFiles = () => staffFiles;

  return (
    <FileManagementContext.Provider value={{
      staffFiles,
      uploadFile,
      deleteFile,
      getStaffFiles,
      getFilesForDay,
      getCurrentWeekFiles,
      getWeeklyFileCount,
      getAllStaffWithFiles
    }}>
      {children}
    </FileManagementContext.Provider>
  );
}
