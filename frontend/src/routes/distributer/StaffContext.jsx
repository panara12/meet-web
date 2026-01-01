import { createContext, useContext, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setUserAllList } from "../../store/slice/appSlice"
import { useGetAllUser } from "../../hooks/user/useGetAllUser"
import { useDeleteUser } from "../../hooks/user/useDeleteUser"
import { useUpdateUser } from "../../hooks/user/useUpdateUser"
import { useAddUser } from "../../hooks/user/useAddUser"
import { useGetAllLimit } from "../../hooks/limit/useGetAllLimit"
import { useUpdateLimit } from "../../hooks/limit/useUpdateLimit"
import { useGetLocationById } from "../../hooks/location/useGetLocationById"

const StaffContext = createContext(undefined)

// ---- Helper: Get Current Location ----
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords

        // Use coordinates as fallback address
        let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        
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

// ---- Provider ----
export function StaffProvider({ children }) {
  const [staff, setStaff] = useState([])
  const dispatch = useDispatch()
  const userAllList = useSelector((state) => state.app.userAllList)
  const [limits, setLimits] = useState(null)

  // API Hooks
  const { data: getAllUser, isPending: isgetAllUserPending, isError: isgetAllUserError, error: getAllUserError } = useGetAllUser()
  const { data: getLimits, isPending: getLimitsPending, isError: isLimitError, error: limitError } = useGetAllLimit()
  const { mutate: addUser, isPending: isAddUserPending, isError: isAddUserError, error: addUserError } = useAddUser()
  const { mutate: updateUser, isPending: isUpdateUserPending, isError: isUpdateUserError, error: updateUserError } = useUpdateUser()
  const { mutate: deleteUser, isPending: isDeleteUserPending, isError: isDeleteUserError, error: deleteUserError } = useDeleteUser()
  const { mutate: updateLimit, isPending: isUpdateLimitPending, isError: isUpdateLimitError, error: updateLimitError } = useUpdateLimit()
  const { mutate: getLocationById, isPending: isGetLocationByIdPending, isError: isGetLocationByIdError, error: getLocationByIdError } = useGetLocationById()

  // Load users from API
  useEffect(() => {
    if (getAllUser?.data?.user) {
      console.log('Loaded users:', getAllUser.data.user)
      dispatch(setUserAllList(getAllUser.data.user))
      setStaff(getAllUser.data.user)
    }
  }, [getAllUser, dispatch])

  // Load limits from API
  useEffect(() => {
    if (getLimits?.data) {
      console.log('Loaded limits:', getLimits.data)
      setLimits(getLimits.data)
    }
  }, [getLimits])

  // Get common location request stats
  const getCommonLocationStats = () => {
    if (!limits) {
      return {
        used: 0,
        limit: 20,
        remaining: 20
      }
    }

    const used = limits.data[0].liveLocationlimit || 0
    const limit = limits.data[0].liveLocationlimit || 20

    return {
      used,
      limit,
      remaining: limits.data[0].liveLocationlimit
    }
  }

  // CRUD Operations
  const addStaff = (newStaff) => {
    if (!newStaff) {
      console.error("Cannot add staff: Invalid data")
      return
    }
    addUser(newStaff)
  }

  const updateStaff = (id, updatedStaff) => {
    if (!id || !updatedStaff) {
      console.error("Cannot update staff: Invalid parameters")
      return
    }
    updateUser({ id, updates: updatedStaff })
  }

  const deleteStaff = (id) => {
    if (!id) {
      console.error("Cannot delete staff: Invalid ID")
      return
    }
    deleteUser({ id })
  }

  // Query Operations
  const getStaffById = (id) => {
    if (!id || !staff) return null
    return staff.find((s) => s._id === id) || null
  }

  const getStaffByRole = (role) => {
    if (!role || !staff) return []
    return staff.filter((s) => s.role === role)
  }

  const getRoleCount = (role) => {
    if (!role || !staff) return 0
    return staff.filter((s) => s.role === role).length
  }

  // Location Operations - NEW: Fetch location from API
  const fetchStaffLocation = (userId) => {
    return new Promise((resolve, reject) => {
      if (!userId) {
        reject(new Error("User ID is required"))
        return
      }

      // Check common limit before fetching
      const commonStats = getCommonLocationStats()
      if (commonStats.remaining <= 0) {
        reject(new Error("Monthly location request limit reached for all users"))
        return
      }
      console.log("Fetching location for user:", userId)
      getLocationById(
        { userId },
        {
          onSuccess: (response) => {
            console.log("Location fetched successfully:", response)
            
            // Extract coordinates from response
            if (response?.data?.location?.coordinates?.coordinates) {
              const [longitude, latitude] = response.data.location.coordinates.coordinates
              
              const locationData = {
                latitude,
                longitude,
                address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                timestamp: response.data.location.createdAt || new Date().toISOString(),
                accuracy: 0,
              }
              
              resolve(locationData)
            } else {
              reject(new Error("Invalid location data format"))
            }
          },
          onError: (error) => {
            console.error("Failed to fetch location:", error)
            reject(error)
          }
        }
      )
    })
  }

  // Update location request count after successful map load
  const decrementLocationRequest = () => {
    console.log("Decrementing location request count",limits)
    if (!limits) {
      console.error("Limits not available")
      return false
    }
    let reqcount = limits.data[0].liveLocationlimit;

    const newUsedCount = reqcount - 1;
    
    updateLimit({
      id: limits.data[0]._id,
      updates: {
        liveLocationlimit: newUsedCount
      }
    })

    // Update local state immediately for better UX
    setLimits({
      ...limits,
      locationRequestsUsed: newUsedCount
    })
    console.log("updated limits",limits)

    return true
  }

  const requestLocationUpdate = async (staffId) => {
    if (!staffId) {
      console.error("Cannot request location: Invalid staff ID")
      return false
    }

    const member = staff.find((s) => s._id === staffId)
    if (!member) {
      console.error("Staff member not found")
      return false
    }

    // Check if location tracking exists and is enabled
    if (!member.locationTracking || !member.locationTracking.isTrackingEnabled) {
      throw new Error("Location tracking is disabled for this staff member")
    }

    // Check common limit instead of individual limit
    const commonStats = getCommonLocationStats()
    if (commonStats.remaining <= 0) {
      throw new Error("Monthly location request limit reached for all users")
    }

    try {
      // Get current location from browser
      const newLocation = await getCurrentLocation()
      const newHistoryEntry = {
        id: `loc-${Date.now()}`,
        ...newLocation,
      }

      // Safely get current location history
      const currentHistory = member.locationTracking?.locationHistory || []
      
      // Update staff location in database
      updateStaff(staffId, {
        locationTracking: {
          ...(member.locationTracking || {}),
          currentLocation: newLocation,
          locationHistory: [
            newHistoryEntry,
            ...currentHistory,
          ].slice(0, 20), // Keep last 20 locations
          lastRequestDate: new Date().toISOString(),
        },
      })

      // Update common limit - increment the used count
      if (limits && limits._id) {
        const newUsedCount = (limits.locationRequestsUsed || 0) + 1
        
        updateLimit({
          id: limits._id,
          updates: {
            locationRequestsUsed: newUsedCount
          }
        })

        // Update local state immediately for better UX
        setLimits({
          ...limits,
          locationRequestsUsed: newUsedCount
        })
      }

      return true
    } catch (error) {
      console.error("Failed to get location:", error)
      throw error
    }
  }

  const getLocationHistory = (staffId) => {
    if (!staffId || !staff) return []
    
    const member = staff.find((s) => s._id === staffId)
    if (!member || !member.locationTracking) return []
    
    return member.locationTracking.locationHistory || []
  }

  const clearLocationHistory = (staffId) => {
    if (!staffId) {
      console.error("Cannot clear history: Invalid staff ID")
      return
    }

    const member = staff.find((s) => s._id === staffId)
    if (!member) {
      console.error("Staff member not found")
      return
    }

    // Safely clear history with null checks
    const currentTracking = member.locationTracking || {}
    
    updateStaff(staffId, {
      locationTracking: {
        ...currentTracking,
        locationHistory: [],
      },
    })
  }

  const toggleLocationTracking = (staffId) => {
    if (!staffId) {
      console.error("Cannot toggle tracking: Invalid staff ID")
      return
    }

    const member = staff.find((s) => s._id === staffId)
    if (!member) {
      console.error("Staff member not found")
      return
    }

    // Safely toggle with null checks
    const currentTracking = member.locationTracking || {}
    
    updateStaff(staffId, {
      locationTracking: {
        ...currentTracking,
        isTrackingEnabled: !currentTracking.isTrackingEnabled,
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
        getCommonLocationStats,
        fetchStaffLocation,
        decrementLocationRequest,
        limits,
        isLoading: isgetAllUserPending || getLimitsPending,
        isError: isgetAllUserError || isLimitError,
        isLocationLoading: isGetLocationByIdPending,
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