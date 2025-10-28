import { createContext, useContext, useState } from "react"
import { useGetAllUser } from "../../hooks/user/useGetAllUser"
import { useEffect } from "react"
import { useDeleteUser } from "../../hooks/user/useDeleteUser"
import { useUpdateUser } from "../../hooks/user/useUpdateUser"
import { useAddUser } from "../../hooks/user/useAddUser"

const StaffContext = createContext(undefined)

// ---- Helpers ----
const generateMockLocation = () => {
  const baseLatitude = 40.7128
  const baseLongitude = -74.0060
  const randomOffset = () => (Math.random() - 0.5) * 0.1

  return {
    latitude: baseLatitude + randomOffset(),
    longitude: baseLongitude + randomOffset(),
    address: `${Math.floor(Math.random() * 999) + 1} ${
      ["Broadway", "Park Ave", "Madison Ave", "Lexington Ave"][
        Math.floor(Math.random() * 4)
      ]
    }, NY`,
    timestamp: new Date().toISOString(),
    accuracy: Math.floor(Math.random() * 10) + 5,
  }
}

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords

        let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        try {
          const streets = [
            "Main St",
            "Oak Ave",
            "Park Blvd",
            "First St",
            "Second Ave",
            "Broadway",
            "Market St",
          ]
          const randomStreet = streets[Math.floor(Math.random() * streets.length)]
          const randomNumber = Math.floor(Math.random() * 9999) + 1
          address = `${randomNumber} ${randomStreet}, Current Location`
        } catch (error) {
          // fallback
        }

        resolve({
          latitude,
          longitude,
          address,
          timestamp: new Date().toISOString(),
          accuracy: accuracy || 0,
        })
      },
      (error) => {
        let errorMessage = "Unable to retrieve location."
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }
        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  })
}

const generateLocationHistory = (count = 5) => {
  const history = []
  for (let i = 0; i < count; i++) {
    const location = generateMockLocation()
    const date = new Date()
    date.setHours(date.getHours() - i * 2)

    history.push({
      id: `loc-${Date.now()}-${i}`,
      ...location,
      timestamp: date.toISOString(),
    })
  }
  return history
}

// ---- Initial Staff ----
const initialStaff = [
  {
    id: "EMP-001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Admin St, NY 10001",
    role: "Admin",
    department: "Management",
    status: "Active",
    hireDate: "2023-01-15",
    salary: 85000,
    employeeId: "ADM001",
    emergencyContact: "Jane Doe - +1 (555) 123-4568",
    notes:
      "Senior administrator with full system access. Excellent leadership skills.",
    lastLogin: "2024-01-16",
    permissions: ["full_access", "user_management", "system_settings"],
    workHours: "Full-time",
    locationTracking: {
      currentLocation: generateMockLocation(),
      locationHistory: generateLocationHistory(),
      monthlyRequestsUsed: 3,
      monthlyRequestsLimit: 20,
      lastRequestDate: new Date().toISOString(),
      isTrackingEnabled: true,
    },
  },
  {
    id: "EMP-002",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 987-6543",
    address: "456 Sales Ave, CA 94102",
    role: "Sales-man",
    department: "Sales",
    status: "Active",
    hireDate: "2023-03-20",
    salary: 65000,
    employeeId: "SAL002",
    emergencyContact: "Mike Johnson - +1 (555) 987-6544",
    notes:
      "Dedicated sales representative with strong client relationship skills.",
    lastLogin: "2024-01-16",
    permissions: ["sales_access", "client_management", "order_management"],
    workHours: "Full-time",
    locationTracking: {
      currentLocation: generateMockLocation(),
      locationHistory: generateLocationHistory(),
      monthlyRequestsUsed: 7,
      monthlyRequestsLimit: 20,
      lastRequestDate: new Date().toISOString(),
      isTrackingEnabled: true,
    },
  },
  // ... (rest of staff same as your code)
]

// ---- Provider ----
export function StaffProvider({ children }) {
  const [staff, setStaff] = useState(initialStaff)
  const {data:getAllUser,isPending:isgetAllUserPending,isError:isgetAllUserError,Error:getAllUserError} = useGetAllUser()
  useEffect(()=>{
    if(getAllUser?.data){
      console.log(getAllUser.data.user)
      setStaff(getAllUser.data.user)
    }
  },[getAllUser])

    const {mutate:addUser,isPending:isAddUserPending, isError:isAddUserError, error:addUserError} = useAddUser()
    const {mutate:updateUser,isPending:isUpdateUserPending, isError:isUpdateUserError, error:updateUserError} = useUpdateUser()
    const {mutate:deleteUser,isPending:isDeleteUserPending, isError:isDeleteUserError, error:deleteUserError} = useDeleteUser()

  const addStaff = (newStaff) => {
    addUser(newStaff)
    console.log(newStaff)
  }

  const updateStaff = (id, updatedStaff) => {
    updateUser({id,updates:updatedStaff})
  }

  const deleteStaff = (id) => {
    deleteUser({id})
  }

  const getStaffById = (id) => staff.find((s) => s._id === id)

  const getStaffByRole = (role) => staff.filter((s) => s.role === role)

  const getRoleCount = (role) => staff.filter((s) => s.role === role).length

  const requestLocationUpdate = async (staffId) => {
    const member = staff.find((s) => s._id === staffId)
    if (!member) return false

    if (!member.locationTracking.isTrackingEnabled) {
      throw new Error("Location tracking is disabled for this staff member")
    }

    if (
      member.locationTracking.monthlyRequestsUsed >=
      member.locationTracking.monthlyRequestsLimit
    ) {
      throw new Error("Monthly location request limit reached")
    }

    try {
      const newLocation = await getCurrentLocation()
      const newHistoryEntry = {
        id: `loc-${Date.now()}`,
        ...newLocation,
      }

      updateStaff(staffId, {
        locationTracking: {
          ...member.locationTracking,
          currentLocation: newLocation,
          locationHistory: [
            newHistoryEntry,
            ...member.locationTracking.locationHistory,
          ].slice(0, 20),
          monthlyRequestsUsed: member.locationTracking.monthlyRequestsUsed + 1,
          lastRequestDate: new Date().toISOString(),
        },
      })

      return true
    } catch (error) {
      console.warn("Real geolocation failed, using mock location:", error)

      const newLocation = generateMockLocation()
      const newHistoryEntry = {
        id: `loc-${Date.now()}`,
        ...newLocation,
      }

      updateStaff(staffId, {
        locationTracking: {
          ...member.locationTracking,
          currentLocation: newLocation,
          locationHistory: [
            newHistoryEntry,
            ...member.locationTracking.locationHistory,
          ].slice(0, 20),
          monthlyRequestsUsed: member.locationTracking.monthlyRequestsUsed + 1,
          lastRequestDate: new Date().toISOString(),
        },
      })

      return true
    }
  }

  const getLocationHistory = (staffId) => {
    const member = staff.find((s) => s._id === staffId)
    return member?.locationTracking.locationHistory || []
  }

  const clearLocationHistory = (staffId) => {
    const member = staff.find((s) => s._id === staffId)
    if (!member) return

    updateStaff(staffId, {
      locationTracking: {
        ...member.locationTracking,
        locationHistory: [],
      },
    })
  }

  const toggleLocationTracking = (staffId) => {
    const member = staff.find((s) => s._id === staffId)
    if (!member) return

    updateStaff(staffId, {
      locationTracking: {
        ...member.locationTracking,
        isTrackingEnabled: !member.locationTracking.isTrackingEnabled,
      },
    })
  }

  return (
    <StaffContext.Provider
      value={{
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        getStaffById,
        getStaffByRole,
        getRoleCount,
        requestLocationUpdate,
        getLocationHistory,
        clearLocationHistory,
        toggleLocationTracking,
      }}
    >
      {children}
    </StaffContext.Provider>
  )
}

// ---- Hook ----
export function useStaff() {
  const context = useContext(StaffContext)
  if (context === undefined) {
    throw new Error("useStaff must be used within a StaffProvider")
  }
  return context
}
