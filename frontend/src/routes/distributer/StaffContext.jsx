import { createContext, useContext, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setLimitsInfo, setUserAllList } from "../../store/slice/appSlice"
import { useGetAllUser } from "../../hooks/user/useGetAllUser"
import { useDeleteUser } from "../../hooks/user/useDeleteUser"
import { useUpdateUser } from "../../hooks/user/useUpdateUser"
import { useAddUser } from "../../hooks/user/useAddUser"
import { useGetAllLimit } from "../../hooks/limit/useGetAllLimit"
import { useUpdateLimit } from "../../hooks/limit/useUpdateLimit"
import { useGetLocationById } from "../../hooks/location/useGetLocationById"
import { useGetpathPoints } from "../../hooks/location/useGetPathPoints"

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

  //pagination and filters
   const [currentPage, setCurrentPage] = useState(1)
    const [pagelimit, setLimit] = useState(10)
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState(undefined)
    const [roleFilter, setRoleFilter] = useState(undefined)
    const [sortField, setSortField] = useState("firstName")
    const [sortDirection, setSortDirection] = useState("asc")
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecords, setTotalRecords] = useState(0)

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(searchTerm)
        setCurrentPage(1)
      }, 500)
      return () => clearTimeout(timer)
    }, [searchTerm])

  // API Hooks
  const { data: getAllUser, isPending: isgetAllUserPending, isError: isgetAllUserError, error: getAllUserError } = useGetAllUser({
     page: currentPage,
    limit: pagelimit,
    search: debouncedSearch,
    status: statusFilter,
    role: roleFilter,
    sortField: sortField,
    sortDirection: sortDirection
  })
  const { data: getLimits, isPending: getLimitsPending, isError: isLimitError, error: limitError } = useGetAllLimit()
  const { mutate: addUser, isPending: isAddUserPending, isError: isAddUserError, error: addUserError } = useAddUser()
  const { mutate: updateUser, isPending: isUpdateUserPending, isError: isUpdateUserError, error: updateUserError } = useUpdateUser()
  const { mutate: deleteUser, isPending: isDeleteUserPending, isError: isDeleteUserError, error: deleteUserError } = useDeleteUser()
  const { mutate: updateLimit, isPending: isUpdateLimitPending, isError: isUpdateLimitError, error: updateLimitError } = useUpdateLimit({
    onSuccess:(res)=>{
      console.log('responiser kjdbfka akjsb',res)
      dispatch(setLimitsInfo(res.data));
    }
  })
  const { mutate: getLocationById, isPending: isGetLocationByIdPending, isError: isGetLocationByIdError, error: getLocationByIdError } = useGetLocationById()
  const { mutate: getPathPoints, isPending: isGetPathPointsPending, isError: isGetPathPointsError, error: getPathPointsError } = useGetpathPoints()
  
  // Load users from API
  useEffect(() => {
    if (getAllUser?.user?.data) {
      console.log('Loaded users:', getAllUser.user.data)
      dispatch(setUserAllList(getAllUser.user.data))
      setStaff(getAllUser.user.data)
      
      // Update pagination info
      if (getAllUser.user.pagination) {
        setTotalPages(getAllUser.user.pagination.totalPages)
        setTotalRecords(getAllUser.user.pagination.totalRecords)
      }
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
        remaining: 20,
        pathUsed: 0,          // NEW
        pathLimit: 20,        // NEW
        pathRemaining: 20     // NEW
      }
    }

    const used = limits.data[0].liveLocationlimit || 0
    const limit = limits.data[0].liveLocationlimit || 20
    
    // NEW: Path stats
    const pathUsed = limits.data[0].routeLocationlimit || 0
    const pathLimit = limits.data[0].totalRouteLocationlimit || 20
    const pathRemaining = limits.data[0].routeLocationlimit

    return {
      used,
      limit,
      remaining: limits.data[0].liveLocationlimit,
      pathUsed,           // NEW
      pathLimit,          // NEW
      pathRemaining       // NEW
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

  // ADD THIS FUNCTION AFTER decrementLocationRequest:

const decrementPathRequest = () => {
  console.log("📉 Decrementing path request count", limits)
  
  if (!limits) {
    console.error("Limits not available")
    return false
  }
  
  let reqcount = limits.data[0].routeLocationlimit;
  const newUsedCount = reqcount - 1

  updateLimit({
    id: limits.data[0]._id,
    updates: {
      routeLocationlimit: newUsedCount
    }
  })

  // Update local state immediately for better UX
  setLimits({
    ...limits,
    data: [{
      ...limits.data[0],
      pathRequestsUsed: newUsedCount
    }]
  })
  
  console.log("✅ Path request count updated:", newUsedCount)
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

  const fetchPathPoints = (userId, date) => {
  return new Promise((resolve, reject) => {
    if (!userId || !date) {
      reject(new Error("User ID and date are required"))
      return
    }

    console.log("📍 Fetching path points for:", userId, date)
    
    getPathPoints(
      { userId, date },
      {
        onSuccess: (response) => {
          console.log("✅ Path points fetched:", response)
          
          if (response?.data?.locations && Array.isArray(response.data.locations)) {
            // Transform API format to component format
            const formattedCoordinates = response.data.locations.map(location => {
              const [lng, lat] = location.coordinates.coordinates
              return { lat, lng }
            })
            
            resolve(formattedCoordinates)
          } else {
            reject(new Error("Invalid path points data"))
          }
        },
        onError: (error) => {
          console.error("❌ Failed to fetch path:", error)
          reject(error)
        }
      }
    )
  })
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
        decrementPathRequest,
        limits,
        fetchPathPoints,
        isPathPointsLoading: isGetPathPointsPending,
        isLoading: isgetAllUserPending || getLimitsPending,
        isError: isgetAllUserError || isLimitError,
        isLocationLoading: isGetLocationByIdPending,

        // filers and pagination
        currentPage,
        setCurrentPage,
        pagelimit,
        setLimit,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        roleFilter,
        setRoleFilter,
        sortField,
        setSortField,
        sortDirection,
        setSortDirection,
        totalPages,
        totalRecords,
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