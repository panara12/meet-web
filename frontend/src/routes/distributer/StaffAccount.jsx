import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Search, Plus, Eye, Edit, Trash2, Mail, Phone, MapPin, Calendar, Shield, Clock, Users, TrendingUp, UserCheck, Briefcase, Activity, Filter, Upload, FileText, CreditCard, Car, IndianRupeeIcon } from "lucide-react"
import { toast } from "sonner"

import { StaffProvider,useStaff } from "./StaffContext"

//ENV CONFIG
const digital_ocean_url = import.meta.env.VITE_DIGITAL_OCEAN_URL;

const defaultFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  role: "Sales-man",
  department: "Operations",
  status: "Active",
  salary: "",
  emergencyContact: {
    name:"",
    phone:"",
    relationship:""
  },
  notes: "",
  workHours: "Full-time",
  // Government Documents
  aadhaarNumber: "",
  panNumber: "",
  drivingLicenseNumber: "",
  // Document Files
  aadhar: null,
  pan: null,
  driving: null,
  // Bank Account Details
  bankAccountNumber: "",
  bankName: "",
  ifscCode: "",
  bankBranch: "",
  accountHolderName: "",
  username: "",
  password: ""
}

const roles = ["admin", "packaging", "billing", "salesman"]


const departments = ["admin", "salesman", "packaging", "billing", "seller"]
const statuses = ["Active", "Inactive", "On Leave", "Terminated"]
const workHourTypes = ["Full-time", "Part-time", "Contract", "Freelance"]

function StaffAccount() {
  const { staff, addStaff, updateStaff, deleteStaff, getRoleCount,limits } = useStaff()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [sortField, setSortField] = useState('firstName')
  const [sortDirection, setSortDirection] = useState('asc')
  const [formData, setFormData] = useState(defaultFormData)
  const [documentFiles, setDocumentFiles] = useState({})


  // console.log("Staff Data:", limits?.data[0]?.adminlimit);

  // Role limits configuration
  const roleLimits = useMemo(() => ({
    "admin": limits?.data?.[0]?.adminlimit || 0,
    "packaging": limits?.data?.[0]?.packagelimit || 0,
    "billing": limits?.data?.[0]?.billinglimit || 0,
    "salesman": limits?.data?.[0]?.salesmanlimit || 0
  }), [limits]);

  // Add this new hook:
  const isAnyRoleAvailable = useMemo(() => {
    // Check if limits data is loaded
    if (!limits?.data?.[0]) {
      return false; // Disable if limits not loaded yet
    }

    // Check each role to see if any has availability
    const rolesArray = ['admin', 'packaging', 'billing', 'salesman'];
    
    for (const role of rolesArray) {
      const currentCount = getRoleCount(role);
      const limit = roleLimits[role];
      
      // If any role has availability, return true
      if (limit > currentCount) {
        return true;
      }
    }
    
    // If no roles have availability, return false
    return false;
  }, [staff, limits, getRoleCount, roleLimits]);

  const filteredAndSortedStaff = useMemo(() => {
    return staff
      .filter(member => {
        const matchesSearch = 
          member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.department.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesRole = roleFilter === "all" || member.role === roleFilter
        const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter
        const matchesStatus = statusFilter === "all" || member.status === statusFilter
        
        return matchesSearch && matchesRole && matchesDepartment && matchesStatus
      })
      .sort((a, b) => {
        let aVal = a[sortField]
        let bVal = b[sortField]
        
        if (sortField === 'hireDate') {
          aVal = new Date(aVal)
          bVal = new Date(bVal)
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
  }, [staff, searchTerm, roleFilter, departmentFilter, statusFilter, sortField, sortDirection])
  console.log("Filtered and Sorted Staff:", filteredAndSortedStaff)

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }, [sortField, sortDirection])

  const resetForm = useCallback(() => {
    setFormData(defaultFormData)
    setDocumentFiles({})
  }, [])

  const updateFormData = useCallback((
    field, 
    value
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const generateEmployeeId = useCallback(() => {
    const maxId = Math.max(...staff.map(s => parseInt(s._id.replace('EMP-', ''))), 0)
    return `EMP-${String(maxId + 1).padStart(3, '0')}`
  }, [staff])

  const generateEmpId = useCallback((role) => {
    const prefix = role.substring(0, 3).toUpperCase()
    const maxId = Math.max(...staff.map(s => {
      if (s.employeeId.startsWith(prefix)) {
        return parseInt(s.employeeId.replace(prefix, ''))
      }
      return 0
    }), 0)
    return `${prefix}${String(maxId + 1).padStart(3, '0')}`
  }, [staff])

  const handleAddStaff = useCallback(() => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error("Please fill in required fields (First Name, Last Name, and Email)")
      return
    }

    if (staff.some(member => member.email.toLowerCase() === formData.email.toLowerCase())) {
      toast.error("A staff member with this email already exists")
      return
    }

    // Check role limits
    const currentRoleCount = getRoleCount(formData.role)
    const roleLimit = roleLimits[formData.role]
    
    if (currentRoleCount >= roleLimit) {
      toast.error(`Cannot add more ${formData.role} staff. Maximum limit of ${roleLimit} reached.`)
      return
    }

    const newStaff = {
      id: generateEmployeeId(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      role: formData.role,
      department: formData.department,
      status: formData.status,
      salary: formData.salary ? parseInt(formData.salary) : 0,
      employeeId: generateEmpId(formData.role),
      emergencyContact: {
        name: formData.emergencyContact.name.trim() || undefined,
        phone: formData.emergencyContact.phone.trim() || undefined,
        relationship: formData.emergencyContact.relationship.trim() || undefined
      },
      notes: formData.notes.trim() || undefined,
      workHours: formData.workHours,
      hireDate: new Date().toISOString().split('T')[0],
      permissions: [],
      lastLogin: "Never",
      // Location Tracking
      locationTracking: {
        locationHistory: [],
        monthlyRequestsUsed: 0,
        monthlyRequestsLimit: 20,
        lastRequestDate: new Date().toISOString(),
        isTrackingEnabled: true
      },
      // Government Documents
      aadhaarNumber: formData.aadhaarNumber.trim() || undefined,
      panNumber: formData.panNumber.trim() || undefined,
      drivingLicenseNumber: formData.drivingLicenseNumber.trim() || undefined,
      aadhar: formData.aadhar || null,
      pan: formData.pan || null,
      driving: formData.driving || null,
      // Bank Account Details
      bankAccountNumber: formData.bankAccountNumber.trim() || undefined,
      bankName: formData.bankName.trim() || undefined,
      ifscCode: formData.ifscCode.trim() || undefined,
      bankBranch: formData.bankBranch.trim() || undefined,
      accountHolderName: formData.accountHolderName.trim() || undefined,
      username: formData.username.trim() || undefined,
      password: formData.password.trim() || undefined
    }

    addStaff(newStaff)
    setIsAddDialogOpen(false)
    resetForm()
    toast.success("Staff member added successfully")
  }, [formData, staff, generateEmployeeId, generateEmpId, resetForm, addStaff, getRoleCount])

  const handleEditStaff = useCallback(() => {
    if (!editingStaff || !formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error("Please fill in required fields (First Name, Last Name, and Email)")
      return
    }

    if (staff.some(member => 
      member._id !== editingStaff._id && 
      member.email.toLowerCase() === formData.email.toLowerCase()
    )) {
      toast.error("A staff member with this email already exists")
      return
    }

    // Check role limits if role is changing
    if (editingStaff.role !== formData.role) {
      const currentRoleCount = staff.filter(member => 
        member.role === formData.role && 
        member.status === "Active" && 
        member._id !== editingStaff._id
      ).length
      const roleLimit = roleLimits[formData.role]
      
      if (currentRoleCount >= roleLimit) {
        toast.error(`Cannot change to ${formData.role} role. Maximum limit of ${roleLimit} reached.`)
        return
      }
    }



    const updatedData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      role: formData.role,
      department: formData.department,
      status: formData.status,
      salary: formData.salary ? parseInt(formData.salary) : editingStaff.salary,
      emergencyContact: {
        name: formData.emergencyContact.name.trim() || undefined,
        phone: formData.emergencyContact.phone.trim() || undefined,
        relationship: formData.emergencyContact.relationship.trim() || undefined
      },
      notes: formData.notes.trim() || undefined,
      workHours: formData.workHours,
      // Government Documents
      aadhaarNumber: formData.aadhaarNumber.trim() || undefined,
      panNumber: formData.panNumber.trim() || undefined,
      drivingLicenseNumber: formData.drivingLicenseNumber.trim() || undefined,
      // Document Files
      aadhar: formData.aadhar || null,
      pan: formData.pan || null,
      driving: formData.driving || null,
      // Bank Account Details
      bankAccountNumber: formData.bankAccountNumber.trim() || undefined,
      bankName: formData.bankName.trim() || undefined,
      ifscCode: formData.ifscCode.trim() || undefined,
      bankBranch: formData.bankBranch.trim() || undefined,
      accountHolderName: formData.accountHolderName.trim() || undefined,
      username: formData.username.trim() || undefined,
      password: formData.password.trim() || undefined
    }
    
    updateStaff(editingStaff._id, updatedData)
    setIsEditDialogOpen(false)
    setEditingStaff(null)
    resetForm()
    toast.success("Staff member updated successfully")
  }, [editingStaff, formData, resetForm, updateStaff])

  const handleDeleteStaff = useCallback((staffId) => {
    deleteStaff(staffId)
    toast.success("Staff member removed successfully")
  }, [deleteStaff])

  const openEditDialog = useCallback((member) => {
    console.log("Editing staff member:", member);
    console.log("Documents check:", member.documents);
    console.log("Length:", member.documents?.length);
    setEditingStaff(member)
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      address: member.address,
      role: member.role,
      department: member.department,
      status: member.status,
      salary: member.salary.toString(),
      emergencyContact: {
        name: member.emergencyContact?.name || "",
        phone: member.emergencyContact?.phone || "",
        relationship: member.emergencyContact?.relationship || ""
      },
      notes: member.notes || "",
      workHours: member.workHours,
      // Government Documents
      aadhaarNumber: member.aadhaarNumber || "",
      panNumber: member.panNumber || "",
      drivingLicenseNumber: member.drivingLicenseNumber || "",
      // Document Files
      aadhar: member.documents[0]?.url || null,
      pan: member.documents[1]?.url || null,
      driving: member.documents[2]?.url || null,
      // Bank Account Details
      bankAccountNumber: member.bankAccountNumber || "",
      bankName: member.bankName || "",
      ifscCode: member.ifscCode || "",
      bankBranch: member.bankBranch || "",
      accountHolderName: member.accountHolderName || "",
      username: member.username || "",
      password: member.password || ""
    })
    setIsEditDialogOpen(true)
  }, [])

  const openAddDialog = useCallback(() => {
    resetForm()
    setIsAddDialogOpen(true)
  }, [resetForm])

  const closeAddDialog = useCallback(() => {
    setIsAddDialogOpen(false)
    resetForm()
  }, [resetForm])

  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false)
    setEditingStaff(null)
    resetForm()
  }, [resetForm])



  const getRoleAvailability = useCallback((role) => {
    const current = getRoleCount(role)
    const limit = roleLimits[role]
    return { current, limit, available: limit - current }
  }, [getRoleCount])

  const getStatusVariant = useCallback((status) => {
    switch (status) {
      case "Active": return "default"
      case "On Leave": return "secondary"
      case "Inactive": return "outline"
      case "Terminated": return "destructive"
      default: return "secondary"
    }
  }, [])

  const getRoleVariant = useCallback((role) => {
    switch (role) {
      case "Admin": return "default"
      case "Sales-man": return "secondary"
      case "Biller": return "outline"
      case "Packager": return "secondary"
      default: return "outline"
    }
  }, [])

  // Calculated stats
  const totalStaff = staff.length
  const activeStaff = staff.filter(s => s.status === "Active").length
  const totalSalaryExpense = staff.filter(s => s.status === "Active").reduce((sum, member) => sum + (member.salary || 0), 0)

  const departmentBreakdown = departments.map(dept => ({
    department: dept,
    count: staff.filter(s => s.department === dept).length
  }))

  const recentHires = Array.from(staff)
  .sort((a, b) => new Date(b.hireDate) - new Date(a.hireDate))
  .slice(0, 5);

  return (
    <div className="w-full">
      <div className="ml-8 lg:hidden">
        <h1 className="text-xl">Employee Accounts</h1>
      </div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2>Staff Account Management</h2>
            <p className="text-muted-foreground">Manage employee records, roles, and employment details</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Button disabled={!isAnyRoleAvailable} onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
            {!isAnyRoleAvailable && (
              <p className="text-xs text-red-500">
                All role limits reached
              </p>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStaff}</div>
              <p className="text-xs text-muted-foreground">
                {activeStaff} active employees
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
              <IndianRupeeIcon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center"><IndianRupeeIcon className="h-4 w-4 text-black" />{Math.round(totalSalaryExpense / 12).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Active employees only</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employee Retention</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{((activeStaff / totalStaff) * 100).toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Currently active staff</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Role Limits</CardTitle>
              <Shield className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {Object.entries(roleLimits).slice(0, 2).map(([role, limit]) => {
                  const current = getRoleCount(role)
                  return (
                    <div key={role} className="flex justify-between text-xs">
                      <span>{role}:</span>
                      <span className={current >= limit ? "text-red-500 font-medium" : "text-muted-foreground"}>
                        {current}/{limit}
                      </span>
                    </div>
                  )
                })}
                <p className="text-xs text-muted-foreground mt-1">View more in Reports</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role Limits Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Role Availability Status</CardTitle>
            <CardDescription>Current staff count vs maximum allowed per role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(roleLimits).map(([role, limit]) => {
                const current = getRoleCount(role.toLowerCase())
                const percentage = (current / limit) * 100
                const isAtLimit = current >= limit
                
                return (
                  <div key={role} className="text-center space-y-2">
                    <div className="text-sm font-medium">{role}</div>
                    <div className={`text-2xl font-bold ${isAtLimit ? 'text-red-500' : 'text-green-600'}`}>
                      {current}/{limit}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${isAtLimit ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isAtLimit ? 'At Limit' : `${limit - current} available`}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="directory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="directory">Staff Directory</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="directory" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff, roles, or departments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Staff Table */}
            <Card>
              <CardHeader>
                <CardTitle>Employee Directory ({filteredAndSortedStaff.length})</CardTitle>
                <CardDescription>Complete staff roster with roles, departments, and employment details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="min-w-[800px] px-4 sm:px-0">
                    <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('firstName')}
                        >
                          <div className="flex items-center gap-2">
                            Employee
                            <Filter className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Contact & Emergency</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('role')}
                        >
                          <div className="flex items-center gap-2">
                            Role & Department
                            <Filter className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('salary')}
                        >
                          <div className="flex items-center gap-2">
                            Annual Salary
                            <Filter className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('hireDate')}
                        >
                          <div className="flex items-center gap-2">
                            Hire Date
                            <Filter className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedStaff.map((member) => (
                        console.log("Rendering member:", member),
                          <TableRow key={member._id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>{member.firstName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{member.firstName} {member.lastName}</p>
                                  <p className="text-sm text-muted-foreground">{member.employeeId}</p>
                                  <p className="text-xs text-muted-foreground">{member.workHours}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{member.email}</span>
                                </div>
                                {member.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm">{member.phone}</span>
                                  </div>
                                )}
                                {member.emergencyContact && (
                                  <>
                                  <p className="text-xs text-muted-foreground">Person Name: {member.emergencyContact.name || "demo"}</p>
                                  <p className="text-xs text-muted-foreground">Phone: {member.emergencyContact.phone || "demo"}</p>
                                  <p className="text-xs text-muted-foreground">Relationship: {member.emergencyContact.relationship || "demo"}</p>
                                </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge variant={getRoleVariant(member.role)}>
                                  {member.role}
                                </Badge>
                                <p className="text-sm text-muted-foreground">{member.department}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusVariant(member.status)}>
                                {member.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{member.salary ? `${member.salary?.toLocaleString()}` : 'N/A'}</TableCell>
                            <TableCell>{member.hireDate}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedStaff(member);
                                      }}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                          <AvatarImage src={selectedStaff?.avatar} />
                                          <AvatarFallback>{selectedStaff?.firstName[0]}{selectedStaff?.lastName[0]}</AvatarFallback>
                                        </Avatar>
                                        {selectedStaff?.firstName} {selectedStaff?.lastName}
                                      </DialogTitle>
                                      <DialogDescription>Complete employee profile and employment details</DialogDescription>
                                    </DialogHeader>
                                    {selectedStaff && (
                                      <div className="grid gap-6 py-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                          <div className="space-y-4">
                                            <div>
                                              <Label>Employee Information</Label>
                                              <div className="space-y-2 mt-2">
                                                <p><span className="text-sm text-muted-foreground">Employee ID:</span> {selectedStaff.employeeId}</p>
                                                <p><span className="text-sm text-muted-foreground">Full Name:</span> {selectedStaff.firstName} {selectedStaff.lastName}</p>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-sm text-muted-foreground">Status:</span>
                                                  <Badge variant={getStatusVariant(selectedStaff.status)}>
                                                    {selectedStaff.status}
                                                  </Badge>
                                                </div>
                                              </div>
                                            </div>

                                            <div>
                                              <Label>Contact Details</Label>
                                              <div className="space-y-2 mt-2">
                                                <div className="flex items-center gap-2">
                                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                                  <span className="text-sm">{selectedStaff.email}</span>
                                                </div>
                                                {selectedStaff.phone && (
                                                  <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">{selectedStaff.phone}</span>
                                                  </div>
                                                )}
                                                {selectedStaff.address && (
                                                  <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">{selectedStaff.address}</span>
                                                  </div>
                                                )}
                                                {selectedStaff.emergencyContact && (
                                                  <div>
                                                    <Label>Emergency Contact:</Label>
                                                    <p className="text-sm">Person name: {selectedStaff.emergencyContact.name}</p>
                                                    <p className="text-sm">Phone: {selectedStaff.emergencyContact.phone}</p>
                                                    <p className="text-sm">Relationship: {selectedStaff.emergencyContact.relationship}</p>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="space-y-4">
                                            <div>
                                              <Label>Role & Department</Label>
                                              <div className="space-y-2 mt-2">
                                                <div className="flex items-center gap-2">
                                                  <span className="text-sm text-muted-foreground">Role:</span>
                                                  <Badge variant={getRoleVariant(selectedStaff.role)}>
                                                    {selectedStaff.role}
                                                  </Badge>
                                                </div>
                                                <p><span className="text-sm text-muted-foreground">Department:</span> {selectedStaff.department}</p>
                                                <p><span className="text-sm text-muted-foreground">Work Hours:</span> {selectedStaff.workHours}</p>
                                              </div>
                                            </div>

                                            <div>
                                              <Label>System Access</Label>
                                              <div className="space-y-2 mt-2">
                                                {selectedStaff.lastLogin && (
                                                  <p><span className="text-sm text-muted-foreground">Last Login:</span> {selectedStaff.lastLogin}</p>
                                                )}
                                                <p><span className="text-sm text-muted-foreground">Access Level:</span> {selectedStaff.role}</p>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="space-y-4">
                                            <div>
                                              <Label>Employment Details</Label>
                                              <div className="space-y-3 mt-2">
                                                <div>
                                                  <p className="text-sm text-muted-foreground">Annual Salary</p>
                                                  <p className="text-2xl font-bold">${selectedStaff.salary.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                  <p className="text-sm text-muted-foreground">Hire Date</p>
                                                  <p className="font-medium">{selectedStaff.hireDate}</p>
                                                </div>
                                                <div>
                                                  <p className="text-sm text-muted-foreground">Tenure</p>
                                                  <p className="font-medium">
                                                    {Math.floor((new Date().getTime() - new Date(selectedStaff.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Government Documents Section */}
                                        {(selectedStaff.aadhaarNumber || selectedStaff.panNumber || selectedStaff.drivingLicenseNumber) && (
                                          <div>
                                            <Label>Government Documents</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                              {selectedStaff.aadhaarNumber && (
                                                <div className="p-3 border rounded-lg">
                                                  <div className="flex items-center gap-2 mb-2">
                                                    {
                                                      selectedStaff.documents[0]?.url && <img src={digital_ocean_url + selectedStaff.documents[0].url} className="w-32 h-24 object-fit" alt="Aadhaar Card" />
                                                    }
                                                  </div>
                                                  <span className="text-sm font-medium">Aadhaar Card</span>
                                                  <p className="text-sm text-muted-foreground">{selectedStaff.aadhaarNumber}</p>
                                                </div>
                                              )}
                                              {selectedStaff.panNumber && (
                                                <div className="p-3 border rounded-lg">
                                                  <div className="flex items-center gap-2 mb-2">
                                                    {selectedStaff.documents[1]?.url && <img src={digital_ocean_url + selectedStaff.documents[1].url} className="w-32 h-24 object-fit" alt="PAN Card" />}
                                                  </div>
                                                    <span className="text-sm font-medium">PAN Card</span>
                                                  <p className="text-sm text-muted-foreground">{selectedStaff.panNumber}</p>
                                                </div>
                                              )}
                                              {console.log('stadf',selectedStaff)}
                                              {selectedStaff.drivingLicenseNumber && (
                                                <div className="p-3 border rounded-lg">
                                                  <div className="flex items-center gap-2 mb-2">
                                                    {selectedStaff.documents[2]?.url && <img src={digital_ocean_url + selectedStaff.documents[2].url} className="w-32 h-24 object-fit" alt="Driving License" />}
                                                  </div>
                                                    <span className="text-sm font-medium">Driving License</span>
                                                  <p className="text-sm text-muted-foreground">{selectedStaff.drivingLicenseNumber}</p>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}

                                        {/* Bank Account Details Section */}
                                        {(selectedStaff.bankAccountNumber || selectedStaff.bankName) && (
                                          <div>
                                            <Label>Bank Account Details</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                              <div className="space-y-2">
                                                {selectedStaff.accountHolderName && (
                                                  <p><span className="text-sm text-muted-foreground">Account Holder:</span> {selectedStaff.accountHolderName}</p>
                                                )}
                                                {selectedStaff.bankAccountNumber && (
                                                  <p><span className="text-sm text-muted-foreground">Account Number:</span> {selectedStaff.bankAccountNumber}</p>
                                                )}
                                                {selectedStaff.bankName && (
                                                  <p><span className="text-sm text-muted-foreground">Bank Name:</span> {selectedStaff.bankName}</p>
                                                )}
                                              </div>
                                              <div className="space-y-2">
                                                {selectedStaff.ifscCode && (
                                                  <p><span className="text-sm text-muted-foreground">IFSC Code:</span> {selectedStaff.ifscCode}</p>
                                                )}
                                                {selectedStaff.bankBranch && (
                                                  <p><span className="text-sm text-muted-foreground">Branch:</span> {selectedStaff.bankBranch}</p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {selectedStaff.permissions && selectedStaff.permissions.length > 0 && (
                                          <div>
                                            <Label>System Permissions</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                              {selectedStaff.permissions.map((permission, index) => (
                                                <Badge key={index} variant="outline">{permission.replace('_', ' ')}</Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {selectedStaff.notes && (
                                          <div>
                                            <Label>Employee Notes</Label>
                                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{selectedStaff.notes}</p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => openEditDialog(member)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Remove Staff Member</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to remove {member.firstName} {member.lastName} from the system? This will permanently delete their employee record and access permissions. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteStaff(member._id)}
                                        className="bg-danger text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Remove Employee
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentBreakdown.map(dept => (
                <Card key={dept.department}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {dept.department}
                      <Badge variant="outline">{dept.count} staff</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {staff.filter(s => s.department === dept.department).map(member => (
                        <div key={member._id} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{member.firstName} {member.lastName}</span>
                          <Badge variant={getRoleVariant(member.role)} className="text-xs">
                            {member.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Hires</CardTitle>
                  <CardDescription>Newest team members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentHires.map(member => (
                      <div key={member._id} className="flex justify-between text-sm">
                        <span className="font-medium">{member.firstName} {member.lastName}</span>
                        <span className="text-muted-foreground">{member.hireDate}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                  <CardDescription>Staff allocation by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departmentBreakdown.filter(d => d.count > 0).map(dept => (
                      <div key={dept.department} className="flex justify-between text-sm">
                        <span>{dept.department}</span>
                        <span>{dept.count} staff</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Employment Status</CardTitle>
                  <CardDescription>Current workforce overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Employees</p>
                      <p className="text-lg font-bold">{totalStaff}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Employees</p>
                      <p className="text-lg font-bold">{activeStaff}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Annual Salaries</p>
                      <p className="text-lg font-bold">${totalSalaryExpense.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Role Limits Detailed Report */}
            <Card>
              <CardHeader>
                <CardTitle>Role Limits & Availability Report</CardTitle>
                <CardDescription>Detailed breakdown of staff capacity by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(roleLimits).map(([role, limit]) => {
                    const current = getRoleCount(role)
                    const percentage = (current / limit) * 100
                    const isAtLimit = current >= limit
                    const isNearLimit = percentage >= 80
                    
                    return (
                      <div key={role} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge variant={getRoleVariant(role)}>
                              {role}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              ({current} active staff)
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`font-medium ${isAtLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-600' : 'text-green-600'}`}>
                              {current} / {limit}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {limit - current} positions available
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        {isAtLimit && (
                          <p className="text-xs text-red-600">⚠️ At maximum capacity - cannot add more {role} staff</p>
                        )}
                        {isNearLimit && !isAtLimit && (
                          <p className="text-xs text-yellow-600">⚠️ Near capacity - {limit - current} position(s) remaining</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Staff Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>Create a comprehensive employee profile with role assignments and contact details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="add-firstName">First Name *</Label>
                  <Input 
                    id="add-firstName" 
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="John" 
                  />
                </div>
                <div>
                  <Label htmlFor="add-lastName">Last Name *</Label>
                  <Input 
                    id="add-lastName" 
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Doe" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="add-email">Email Address *</Label>
                  <Input 
                    id="add-email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="john.doe@company.com" 
                  />
                </div>
                <div>
                  <Label htmlFor="add-phone">Phone Number</Label>
                  <Input 
                    id="add-phone" 
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567" 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="add-address">Address</Label>
                <Input 
                  id="add-address" 
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="Complete address" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="add-role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => updateFormData('role', value)}>
                    <SelectTrigger id="add-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => {
                        const availability = getRoleAvailability(role)
                        const isAvailable = availability.available > 0
                        
                        return (
                          <SelectItem 
                            key={role} 
                            value={role}
                            disabled={!isAvailable}
                            className={!isAvailable ? "opacity-50" : ""}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span>{role}</span>
                              <span className={`text-xs ml-2 ${!isAvailable ? 'text-red-500' : 'text-muted-foreground'}`}>
                                ({availability.current}/{availability.limit})
                              </span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Numbers show current/maximum allowed for each role
                  </p>
                </div>
                <div>
                  <Label htmlFor="add-department">Department</Label>
                  <Select value={formData.role} onValueChange={(value) => updateFormData('department', value)}>
                    <SelectTrigger id="add-department">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add-status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                    <SelectTrigger id="add-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="add-workHours">Work Schedule</Label>
                  <Select value={formData.workHours} onValueChange={(value) => updateFormData('workHours', value)}>
                    <SelectTrigger id="add-workHours">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {workHourTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="add-salary">Annual Salary ($)</Label>
                  <Input 
                    id="add-salary" 
                    type="number"
                    value={formData.salary}
                    onChange={(e) => updateFormData('salary', e.target.value)}
                    placeholder="50000" 
                  />
                </div>
              </div>
              {/* Emergency Contact Section */}
              <div>
                <h3 className="text-lg font-medium">Emergency Contact</h3>
                <Label htmlFor="add-emergencyContact">Person Name</Label>
                <Input 
                  id="add-emergencyContact" 
                  value={formData.emergencyContact.name}
                  onChange={(e) => updateFormData('emergencyContact', { ...formData.emergencyContact, name: e.target.value })}
                  placeholder="Contact name" 
                />
              </div>
              <div>
                <Label htmlFor="add-emergencyContactPhone">Person Phone</Label>
                <Input 
                  id="add-emergencyContactPhone" 
                  value={formData.emergencyContact.phone}
                  onChange={(e) => updateFormData('emergencyContact', { ...formData.emergencyContact, phone: e.target.value })}
                  placeholder="Contact phone number" 
                />
              </div>
              <div>
                <Label htmlFor="add-emergencyContactRelationship">Person Relationship</Label>
                <Input 
                  id="add-emergencyContactRelationship" 
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => updateFormData('emergencyContact', { ...formData.emergencyContact, relationship: e.target.value })}
                  placeholder="Contact relationship" 
                />
              </div>

              {/* Government Documents Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Government Documents</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="add-aadhaarNumber">Aadhaar Card Number</Label>
                    <Input 
                      id="add-aadhaarNumber" 
                      value={formData.aadhaarNumber}
                      onChange={(e) => updateFormData('aadhaarNumber', e.target.value)}
                      placeholder="1234 5678 9012" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-panNumber">PAN Card Number</Label>
                    <Input 
                      id="add-panNumber" 
                      value={formData.panNumber}
                      onChange={(e) => updateFormData('panNumber', e.target.value)}
                      placeholder="ABCDE1234F" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-drivingLicenseNumber">Driving License Number</Label>
                    <Input 
                      id="add-drivingLicenseNumber" 
                      value={formData.drivingLicenseNumber}
                      onChange={(e) => updateFormData('drivingLicenseNumber', e.target.value)}
                      placeholder="DL-1420110012345" 
                    />
                  </div>
                </div>

                {/* Document Upload Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="add-aadhaarPhoto">Aadhaar Card Photo</Label>
                    <div className="mt-1">
                      <Input 
                        id="add-aadhaarPhoto" 
                        name="aadhar"
                        type="file"
                        accept="image/*"
                        value={formData.aadharFile}
                        onChange={(e) => {updateFormData('aadhar', e.target.files?.[0] || null)}}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Upload Aadhaar card image</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="add-panPhoto">PAN Card Photo</Label>
                    <div className="mt-1">
                      <Input 
                        id="add-panPhoto" 
                        type="file"
                        name="pan"
                        accept="image/*"
                        onChange={(e) => updateFormData('pan', e.target.files?.[0] || null)}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Upload PAN card image</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="add-drivingLicensePhoto">Driving License Photo</Label>
                    <div className="mt-1">
                      <Input 
                        id="add-drivingLicensePhoto" 
                        type="file"
                        name="driving"
                        accept="image/*"
                        onChange={(e) => updateFormData('driving', e.target.files?.[0] || null)}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Upload license image</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Account Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Bank Account Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="add-accountHolderName">Account Holder Name</Label>
                    <Input 
                      id="add-accountHolderName" 
                      value={formData.accountHolderName}
                      onChange={(e) => updateFormData('accountHolderName', e.target.value)}
                      placeholder="Full name as per bank records" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-bankAccountNumber">Bank Account Number</Label>
                    <Input 
                      id="add-bankAccountNumber" 
                      value={formData.bankAccountNumber}
                      onChange={(e) => updateFormData('bankAccountNumber', e.target.value)}
                      placeholder="1234567890123456" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="add-bankName">Bank Name</Label>
                    <Input 
                      id="add-bankName" 
                      value={formData.bankName}
                      onChange={(e) => updateFormData('bankName', e.target.value)}
                      placeholder="State Bank of India" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-ifscCode">IFSC Code</Label>
                    <Input 
                      id="add-ifscCode" 
                      value={formData.ifscCode}
                      onChange={(e) => updateFormData('ifscCode', e.target.value)}
                      placeholder="SBIN0001234" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="add-bankBranch">Branch</Label>
                    <Input 
                      id="add-bankBranch" 
                      value={formData.bankBranch}
                      onChange={(e) => updateFormData('bankBranch', e.target.value)}
                      placeholder="Main Branch, City" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="add-notes">Employee Notes</Label>
                <Textarea 
                  id="add-notes" 
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Additional notes about the employee's skills, background, or special requirements..." 
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="add-username">Username</Label>
                <Input 
                  id="add-username" 
                  value={formData.username}
                  onChange={(e) => updateFormData('username', e.target.value)}
                  placeholder="Enter username" 
                />
                <p className="text-xs text-muted-foreground mt-1">This will be the user's login ID</p>
              </div>
              <div>
                <Label htmlFor="add-password">Password</Label>
                <Input 
                  id="add-password" 
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  placeholder="Enter password" 
                />
              </div>
                
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeAddDialog}>
                Cancel
              </Button>
              <Button onClick={handleAddStaff}>
                Add Staff Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Staff Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>Edit Staff Member</DialogTitle>
              <DialogDescription>Update employee information and employment details</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-firstName">First Name *</Label>
                  <Input 
                    id="edit-firstName" 
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="John" 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lastName">Last Name *</Label>
                  <Input 
                    id="edit-lastName" 
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Doe" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-email">Email Address *</Label>
                  <Input 
                    id="edit-email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="john.doe@company.com" 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input 
                    id="edit-phone" 
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567" 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input 
                  id="edit-address" 
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="Complete address" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => updateFormData('role', value)}>
                    <SelectTrigger id="edit-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => {
                        const availability = getRoleAvailability(role)
                        const isCurrentRole = editingStaff?.role === role
                        const isAvailable = availability.available > 0 || isCurrentRole
                        
                        return (
                          <SelectItem 
                            key={role} 
                            value={role}
                            disabled={!isAvailable}
                            className={!isAvailable ? "opacity-50" : ""}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span>{role}</span>
                              <span className={`text-xs ml-2 ${!isAvailable ? 'text-red-500' : 'text-muted-foreground'}`}>
                                ({availability.current}/{availability.limit})
                              </span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Numbers show current/maximum allowed for each role
                  </p>
                </div>
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  {console.log(formData) }
                  <Select value={formData.department} disabled={true} onValueChange={(value) => updateFormData('department', value)}>
                    <SelectTrigger id="edit-department">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-workHours">Work Schedule</Label>
                  <Select value={formData.workHours} onValueChange={(value) => updateFormData('workHours', value)}>
                    <SelectTrigger id="edit-workHours">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {workHourTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-salary">Annual Salary ($)</Label>
                  <Input 
                    id="edit-salary" 
                    type="number"
                    value={formData.salary}
                    onChange={(e) => updateFormData('salary', e.target.value)}
                    placeholder="50000" 
                  />
                </div>
              </div>

              <div>
                <Label>Emergency Contact</Label>
                <Label htmlFor="edit-emergencyContact">Person Name</Label>
                <Input 
                  id="edit-emergencyContact" 
                  value={formData.emergencyContact.name1= null ? formData.emergencyContact.name : ''}
                  onChange={(e) => updateFormData('emergencyContact', { ...formData.emergencyContact, name: e.target.value })}
                  placeholder="Contact name" 
                />
                <Label htmlFor="edit-emergencyContact">Person Phone</Label>
                <Input 
                  id="edit-emergencyContact" 
                  value={formData.emergencyContact?.phone || ''}
                  onChange={(e) => updateFormData('emergencyContact', { ...formData.emergencyContact, phone: e.target.value })}
                  placeholder="Contact phone number" 
                />
                <Label htmlFor="edit-emergencyContact">relationship</Label>
                <Input 
                  id="edit-emergencyContact" 
                  value={formData.emergencyContact?.relationship || ''}
                  onChange={(e) => updateFormData('emergencyContact', { ...formData.emergencyContact, relationship: e.target.value })}
                  placeholder="Contact relationship" 
                />
              </div>

              {/* Government Documents Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Government Documents</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-aadhaarNumber">Aadhaar Card Number</Label>
                    <Input 
                      id="edit-aadhaarNumber" 
                      value={formData.aadhaarNumber}
                      onChange={(e) => updateFormData('aadhaarNumber', e.target.value)}
                      placeholder="1234 5678 9012" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-panNumber">PAN Card Number</Label>
                    <Input 
                      id="edit-panNumber" 
                      value={formData.panNumber}
                      onChange={(e) => updateFormData('panNumber', e.target.value)}
                      placeholder="ABCDE1234F" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-drivingLicenseNumber">Driving License Number</Label>
                    <Input 
                      id="edit-drivingLicenseNumber" 
                      value={formData.drivingLicenseNumber}
                      onChange={(e) => updateFormData('drivingLicenseNumber', e.target.value)}
                      placeholder="DL-1420110012345" 
                    />
                  </div>
                </div>

                {/* Document Upload Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-aadhaarPhoto">Aadhaar Card Photo</Label>
                    <div className="mt-1">
                      <Input 
                        id="edit-aadhaarPhoto" 
                        type="file"
                        name="aadhar"
                        accept="image/*"
                        onChange={(e) => formData.aadhar(e.target.files?.[0] || null)}
                        className="cursor-pointer"
                      />
                      {
                        formData.aadhar && <img src={digital_ocean_url + formData.aadhar} alt="Aadhaar Card" />
                      }
                      
                      <p className="text-xs text-muted-foreground mt-1">Upload Aadhaar card image</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-panPhoto">PAN Card Photo</Label>
                    <div className="mt-1">
                      <Input 
                        id="edit-panPhoto" 
                        type="file"
                        name="pan"
                        accept="image/*"
                        onChange={(e) => formData.pan(e.target.files?.[0] || null)}
                        className="cursor-pointer"
                      />
                      { formData.pan && <img src={digital_ocean_url + formData.pan} alt="PAN Card" /> }
                      <p className="text-xs text-muted-foreground mt-1">Upload PAN card image</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-drivingLicensePhoto">Driving License Photo</Label>
                    <div className="mt-1">
                      <Input 
                        id="edit-drivingLicensePhoto" 
                        type="file"
                        name="driving"
                        accept="image/*"
                        onChange={(e) => formData.driving(e.target.files?.[0] || null)}
                        className="cursor-pointer"
                      />
                      { formData.driving && <img src={digital_ocean_url + formData.driving} alt="Driving License" /> }
                      <p className="text-xs text-muted-foreground mt-1">Upload license image</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Account Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Bank Account Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-accountHolderName">Account Holder Name</Label>
                    <Input 
                      id="edit-accountHolderName" 
                      value={formData.accountHolderName}
                      onChange={(e) => updateFormData('accountHolderName', e.target.value)}
                      placeholder="Full name as per bank records" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-bankAccountNumber">Bank Account Number</Label>
                    <Input 
                      id="edit-bankAccountNumber" 
                      value={formData.bankAccountNumber}
                      onChange={(e) => updateFormData('bankAccountNumber', e.target.value)}
                      placeholder="1234567890123456" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-bankName">Bank Name</Label>
                    <Input 
                      id="edit-bankName" 
                      value={formData.bankName}
                      onChange={(e) => updateFormData('bankName', e.target.value)}
                      placeholder="State Bank of India" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-ifscCode">IFSC Code</Label>
                    <Input 
                      id="edit-ifscCode" 
                      value={formData.ifscCode}
                      onChange={(e) => updateFormData('ifscCode', e.target.value)}
                      placeholder="SBIN0001234" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-bankBranch">Branch</Label>
                    <Input 
                      id="edit-bankBranch" 
                      value={formData.bankBranch}
                      onChange={(e) => updateFormData('bankBranch', e.target.value)}
                      placeholder="Main Branch, City" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-notes">Employee Notes</Label>
                <Textarea 
                  id="edit-notes" 
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Additional notes about the employee's skills, background, or special requirements..." 
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeEditDialog}>
                Cancel
              </Button>
              <Button onClick={handleEditStaff}>
                Update Staff Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default StaffAccount