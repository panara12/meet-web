import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { toast } from "sonner"
import { useSettings } from "./SettingsContext"
import { useStaff } from "./StaffContext"
import { 
  Settings, 
  User, 
  Bell, 
  Database, 
  Palette,
  Save,
  Users,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  RefreshCw,
  CreditCard,
  Check,
  X,
  Clock,
  Star,
  TrendingUp,
  Zap,
  Shield,
  RotateCcw,
  AlertTriangle
} from "lucide-react"
import { useGetDistributerById } from "../../hooks/distributer/useGetDistributerById"
import { useSelector } from "react-redux"
import { useGetAllSubAdmins } from "../../hooks/subadmin/useGetAllSubAdmin"
import { useUpdateSubAdmin } from "../../hooks/subadmin/useUpdateSubAdmin"
import { useDeleteSubAdmin } from "../../hooks/subadmin/useDeleteSubAdmin"
import { useAddSubAdmin } from "../../hooks/subadmin/useAddSubAdmin"

export function SettingsPanel() {
  const userInfo = useSelector((state) => state.app.userInfo);
  const limitsInfo = useSelector((state) => state.app.limits);
  console.log("setting",userInfo)
  const { settings, updateSystemSettings, updateNotificationSettings, updateBackupSettings, resetToDefaults, exportSettings, importSettings } = useSettings()
  const { staff } = useStaff()
  const { data:getDistributerById,isPending:isGetDistributerByIdPending} = useGetDistributerById()
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importJson, setImportJson] = useState('')
  const {data:listsubadmin} = useGetAllSubAdmins()
  const {mutate : updatesubadmin, isPending:isUpdateSubAdminPending} = useUpdateSubAdmin()
  const {mutate : deleteSubAdmin, isPending:isDeleteSubAdminPending} = useDeleteSubAdmin()
  const {mutate : addsubadmin, isPending:isAddSubAdminPending} = useAddSubAdmin()
  const [showAddSubAdminDialog, setShowAddSubAdminDialog] = useState(false)
  const [addSubAdminFormData, setAddSubAdminFormData] = useState({
    name: '',
    username: '',
    password: ''
  })

  console.log("Distributer data fetched: ", getDistributerById);

  const handleSystemSave = () => {
    toast.success('System settings saved successfully!')
  }

  const handleNotificationSave = () => {
    toast.success('Notification settings saved successfully!')
  }

  const handleBackupSave = () => {
    toast.success('Backup settings saved successfully!')
  }

  const handleCreateBackup = async () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Creating backup...',
        success: 'Backup created successfully!',
        error: 'Failed to create backup'
      }
    )
  }

  const handleExportSettings = () => {
    const settingsJson = exportSettings()
    const blob = new Blob([settingsJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orderflow-settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Settings exported successfully!')
  }

  const handleImportSettings = () => {
    if (!importJson.trim()) {
      toast.error('Please paste settings JSON')
      return
    }
    
    if (importSettings(importJson)) {
      toast.success('Settings imported successfully!')
      setShowImportDialog(false)
      setImportJson('')
    } else {
      toast.error('Invalid settings format')
    }
  }

  const handleAddSubAdmin = () => {
    if (!addSubAdminFormData.name || !addSubAdminFormData.username || !addSubAdminFormData.password) {
      toast.error('All fields are required')
      return
    }

    if (addSubAdminFormData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    addsubadmin(addSubAdminFormData, {
      onSuccess: () => {
        toast.success('SubAdmin added successfully!')
        setShowAddSubAdminDialog(false)
        setAddSubAdminFormData({ name: '', username: '', password: '' })
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to add SubAdmin')
      }
    })
  }

  const handleResetSettings = () => {
    resetToDefaults()
    setShowResetDialog(false)
    toast.success('Settings reset to defaults!')
  }

  const systemUsers = staff.map(member => ({
    id: member.employeeId,
    name: `${member.firstName} ${member.lastName}`,
    email: member.email,
    role: member.role,
    status: member.status,
    lastLogin: member.lastLogin || 'Never'
  }))

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1 ml-10">
          <h2 className="text-xl sm:text-2xl">System Settings</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Configure your order management system preferences</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* <Button variant="outline" onClick={handleExportSettings} className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Import Settings</DialogTitle>
                <DialogDescription>Paste your exported settings JSON below</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste settings JSON here..."
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  rows={6}
                  className="min-h-[120px] text-sm"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleImportSettings} className="flex-1">Import Settings</Button>
                  <Button variant="outline" onClick={() => setShowImportDialog(false)} className="flex-1 sm:flex-none">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md">
              <DialogHeader>
                <DialogTitle>Reset Settings</DialogTitle>
                <DialogDescription>
                  This will reset all settings to their default values. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button variant="destructive" onClick={handleResetSettings} className="flex-1">
                  Reset All Settings
                </Button>
                <Button variant="outline" onClick={() => setShowResetDialog(false)} className="flex-1 sm:flex-none">Cancel</Button>
              </div>
            </DialogContent>
          </Dialog> */}
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
          <TabsTrigger value="general" className="text-responsive-xs px-2 sm:px-4">General</TabsTrigger>
          {/* <TabsTrigger value="notifications" className="text-responsive-xs px-2 sm:px-4">Notifications</TabsTrigger> */}
          <TabsTrigger value="users" className="text-responsive-xs px-2 sm:px-4">Users</TabsTrigger>
          {/* <TabsTrigger value="backup" className="text-responsive-xs px-2 sm:px-4">Backup</TabsTrigger> */}
          {/* <TabsTrigger value="subscription" className="text-responsive-xs px-2 sm:px-4">Subscription</TabsTrigger> */}
          {/* <TabsTrigger value="about" className="text-responsive-xs px-2 sm:px-4">About</TabsTrigger> */}
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
                <CardDescription className="text-sm">Basic system settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-sm">Company Name</Label>
                  <Input 
                    id="company-name" 
                    value={getDistributerById?.data?.user_data.distributer_name}
                    onChange={(e) => updateSystemSettings({ companyName: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email" className="text-sm">Company Email</Label>
                  <Input 
                    id="company-email" 
                    type="email" 
                    value={getDistributerById?.data?.user_data.distributer_email}
                    onChange={(e) => updateSystemSettings({ companyEmail: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile-number" className="text-sm">Mobile Number</Label>
                  <Input 
                    id="mobile-number" 
                    type="tel" 
                    value={getDistributerById?.data?.user_data.distributer_mobile}
                    onChange={(e) => updateSystemSettings({ mobileNumber: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm">Default Username</Label>
                  <Input 
                    id="username" 
                    value={getDistributerById?.data?.user_data.distributer_username}
                    onChange={(e) => updateSystemSettings({ username: e.target.value })}
                    className="text-sm"
                  />
                </div>
                {/* <Button onClick={handleSystemSave} className="w-full text-sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button> */}
              </CardContent>
            </Card>
            {console.log(limitsInfo)}
            {
              limitsInfo?.isAdminMembers && 
                <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5" />
                        SubAdmin Management
                      </CardTitle>
                      <CardDescription className="text-sm">Manage SubAdmin accounts and permissions</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setShowAddSubAdminDialog(true)}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add SubAdmin
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {listsubadmin?.subadmins && listsubadmin.subadmins.length > 0 ? (
                    <div className="space-y-3">
                      {listsubadmin.subadmins.map((subadmin) => (
                        <SubAdminCard 
                          key={subadmin._id} 
                          subadmin={subadmin}
                          onUpdate={updatesubadmin}
                          onDelete={deleteSubAdmin}
                          isUpdating={isUpdateSubAdminPending}
                          isDeleting={isDeleteSubAdminPending}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No SubAdmins Yet</h3>
                      <p className="text-sm text-gray-600">
                        No SubAdmin accounts have been created yet.
                      </p>
                    </div>
                  )}
                </CardContent>
                </Card>
            }
            
          </div>
        </TabsContent>

        {/* <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-sm">Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.emailNotifications} 
                    onCheckedChange={(checked) => updateNotificationSettings({ emailNotifications: checked })} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive browser notifications</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.pushNotifications} 
                    onCheckedChange={(checked) => updateNotificationSettings({ pushNotifications: checked })} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Email Notification Types</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">New Orders</Label>
                    <Switch 
                      checked={settings.notifications.newOrders}
                      onCheckedChange={(checked) => updateNotificationSettings({ newOrders: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Payment Received</Label>
                    <Switch 
                      checked={settings.notifications.paymentReceived}
                      onCheckedChange={(checked) => updateNotificationSettings({ paymentReceived: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Order Shipped</Label>
                    <Switch 
                      checked={settings.notifications.orderShipped}
                      onCheckedChange={(checked) => updateNotificationSettings({ orderShipped: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Low Inventory</Label>
                    <Switch 
                      checked={settings.notifications.lowInventory}
                      onCheckedChange={(checked) => updateNotificationSettings({ lowInventory: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">System Updates</Label>
                    <Switch 
                      checked={settings.notifications.systemUpdates}
                      onCheckedChange={(checked) => updateNotificationSettings({ systemUpdates: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-email" className="text-sm">Notification Email</Label>
                <Input 
                  id="notification-email" 
                  type="email" 
                  value={settings.notifications.notificationEmail}
                  onChange={(e) => updateNotificationSettings({ notificationEmail: e.target.value })}
                  className="text-sm"
                />
              </div>

              <Button onClick={handleNotificationSave} className="w-full text-sm">
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">User Management</h3>
              <p className="text-sm text-muted-foreground">Manage system users connected to staff accounts</p>
            </div>
            {/* <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button> */}
          </div>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                System Users ({systemUsers.length})
              </CardTitle>
              <CardDescription className="text-sm">View and manage user accounts from staff system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm">User</TableHead>
                      <TableHead className="text-sm">Role</TableHead>
                      <TableHead className="text-sm">Status</TableHead>
                      {/* <TableHead className="hidden sm:table-cell text-sm">Last Login</TableHead> */}
                      {/* <TableHead className="text-sm">Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="min-w-[150px]">
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "Active" ? "default" : "secondary"} className="text-xs">
                            {user.status}
                          </Badge>
                        </TableCell>
                        {/* <TableCell className="text-xs hidden sm:table-cell">{user.lastLogin}</TableCell> */}
                        {/* <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5" />
                Backup & Recovery
              </CardTitle>
              <CardDescription className="text-sm">Manage your data backup and recovery settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Automatic Backup</Label>
                  <p className="text-xs text-muted-foreground">Enable automatic daily backups</p>
                </div>
                <Switch 
                  checked={settings.backup.autoBackup} 
                  onCheckedChange={(checked) => updateBackupSettings({ autoBackup: checked })} 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency" className="text-sm">Backup Frequency</Label>
                  <Select 
                    value={settings.backup.backupFrequency}
                    onValueChange={(value) => updateBackupSettings({ backupFrequency: value })}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retention-period" className="text-sm">Retention Period</Label>
                  <Select 
                    value={settings.backup.retentionPeriod.toString()}
                    onValueChange={(value) => updateBackupSettings({ retentionPeriod: parseInt(value) })}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleCreateBackup} className="flex-1 text-sm">Create Backup Now</Button>
                <Button variant="outline" onClick={handleBackupSave} className="flex-1 sm:flex-none text-sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Recent Backups</CardTitle>
              <CardDescription className="text-sm">Your recent backup history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Backup_2024-01-16_09-00.zip</p>
                    <p className="text-xs text-muted-foreground">Size: 45.2 MB</p>
                  </div>
                  <div className="text-xs text-muted-foreground">Today 9:00 AM</div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Backup_2024-01-15_09-00.zip</p>
                    <p className="text-xs text-muted-foreground">Size: 44.8 MB</p>
                  </div>
                  <div className="text-xs text-muted-foreground">Yesterday 9:00 AM</div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">Backup_2024-01-14_09-00.zip</p>
                    <p className="text-xs text-muted-foreground">Size: 43.9 MB</p>
                  </div>
                  <div className="text-xs text-muted-foreground">Jan 14 9:00 AM</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* <TabsContent value="subscription" className="space-y-4">
          <div className="space-y-6">
            
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-primary/10 to-transparent"></div>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-responsive-lg">
                      <CreditCard className="icon-responsive-base text-blue-primary" />
                      Current Subscription Plan
                    </CardTitle>
                    <CardDescription className="text-responsive-xs">Your active plan and billing information</CardDescription>
                  </div>
                  <Badge className="bg-green-primary text-white text-xs px-3 py-1">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid-responsive-1-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-responsive-base font-semibold text-blue-primary">Professional Plan</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-bold">$49</span>
                        <span className="text-responsive-xs text-muted-foreground">/month</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-responsive-xs">Billing Cycle</span>
                        <span className="text-responsive-xs font-medium">Monthly</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-responsive-xs">Next Billing Date</span>
                        <span className="text-responsive-xs font-medium">October 9, 2024</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-responsive-xs">Payment Method</span>
                        <span className="text-responsive-xs font-medium">•••• 4242</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-responsive-sm font-medium">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start text-responsive-xs">
                        <CreditCard className="icon-responsive-sm mr-2" />
                        Update Payment Method
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-responsive-xs">
                        <Download className="icon-responsive-sm mr-2" />
                        Download Invoice
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-responsive-xs">
                        <Settings className="icon-responsive-sm mr-2" />
                        Manage Subscription
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid-responsive-1-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-responsive-lg">
                    <Shield className="icon-responsive-base text-green-primary" />
                    Active Features
                  </CardTitle>
                  <CardDescription className="text-responsive-xs">Features included in your current plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-light rounded-lg">
                      <Check className="icon-responsive-sm text-green-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">Dashboard & Analytics</p>
                        <p className="text-xs text-muted-foreground">Real-time insights and reporting</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-light rounded-lg">
                      <Check className="icon-responsive-sm text-green-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">Client Management</p>
                        <p className="text-xs text-muted-foreground">Unlimited client records</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-light rounded-lg">
                      <Check className="icon-responsive-sm text-green-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">Staff Management</p>
                        <p className="text-xs text-muted-foreground">Up to 8 staff members</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-light rounded-lg">
                      <Check className="icon-responsive-sm text-green-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">Inventory Management</p>
                        <p className="text-xs text-muted-foreground">Advanced inventory tracking</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-light rounded-lg">
                      <Check className="icon-responsive-sm text-green-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">Company Management</p>
                        <p className="text-xs text-muted-foreground">Multi-company support</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-light rounded-lg">
                      <Check className="icon-responsive-sm text-green-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">Packaging & Tracking</p>
                        <p className="text-xs text-muted-foreground">Real-time order tracking</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-light rounded-lg">
                      <Check className="icon-responsive-sm text-green-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">Billing System</p>
                        <p className="text-xs text-muted-foreground">Automated invoicing</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-responsive-lg">
                    <Clock className="icon-responsive-base text-amber-primary" />
                    Coming Soon
                  </CardTitle>
                  <CardDescription className="text-responsive-xs">Features planned for future releases</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-amber-light rounded-lg">
                      <Clock className="icon-responsive-sm text-amber-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">Advanced Analytics</p>
                        <p className="text-xs text-muted-foreground">Predictive analytics & AI insights</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-amber-light rounded-lg">
                      <Clock className="icon-responsive-sm text-amber-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">Mobile App</p>
                        <p className="text-xs text-muted-foreground">iOS & Android companion app</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-amber-light rounded-lg">
                      <Clock className="icon-responsive-sm text-amber-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">API Integration</p>
                        <p className="text-xs text-muted-foreground">Third-party integrations</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-amber-light rounded-lg">
                      <Clock className="icon-responsive-sm text-amber-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">Advanced Security</p>
                        <p className="text-xs text-muted-foreground">2FA & SSO support</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-amber-light rounded-lg">
                      <Clock className="icon-responsive-sm text-amber-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">Custom Reports</p>
                        <p className="text-xs text-muted-foreground">Advanced reporting engine</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-amber-light rounded-lg">
                      <Clock className="icon-responsive-sm text-amber-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">Workflow Automation</p>
                        <p className="text-xs text-muted-foreground">Custom automation rules</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-amber-light rounded-lg">
                      <Clock className="icon-responsive-sm text-amber-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-responsive-xs font-medium">Multi-location Support</p>
                        <p className="text-xs text-muted-foreground">Multi-warehouse management</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card> 
            </div>
          </div>
        </TabsContent> */}

        {/* <TabsContent value="about" className="space-y-4">
          <div className="grid-responsive-1-2 gap-3 sm:gap-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-responsive-lg">
                  <Settings className="icon-responsive-base" />
                  Software Information
                </CardTitle>
                <CardDescription className="text-responsive-xs">System version and build details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                    <Label className="text-responsive-xs">Application Name</Label>
                    <span className="text-responsive-xs font-medium">OrderFlow Admin Panel</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                    <Label className="text-responsive-xs">Version</Label>
                    <Badge variant="secondary" className="text-xs">v2.1.4</Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                    <Label className="text-responsive-xs">Build Number</Label>
                    <span className="text-responsive-xs font-mono text-muted-foreground">2024.09.001</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                    <Label className="text-responsive-xs">Release Date</Label>
                    <span className="text-responsive-xs">September 9, 2024</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                    <Label className="text-responsive-xs">Environment</Label>
                    <Badge variant="outline" className="text-xs">Production</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}
      </Tabs>

      {/* Add SubAdmin Dialog */}
      <Dialog open={showAddSubAdminDialog} onOpenChange={setShowAddSubAdminDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Add New SubAdmin
            </DialogTitle>
            <DialogDescription>
              Create a new SubAdmin account with login credentials
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Full Name *</Label>
              <Input
                id="add-name"
                value={addSubAdminFormData.name}
                onChange={(e) => setAddSubAdminFormData({...addSubAdminFormData, name: e.target.value})}
                placeholder="Enter full name"
                disabled={isAddSubAdminPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-username">Username *</Label>
              <Input
                id="add-username"
                value={addSubAdminFormData.username}
                onChange={(e) => setAddSubAdminFormData({...addSubAdminFormData, username: e.target.value})}
                placeholder="Enter username"
                disabled={isAddSubAdminPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-password">Password *</Label>
              <Input
                id="add-password"
                type="password"
                value={addSubAdminFormData.password}
                onChange={(e) => setAddSubAdminFormData({...addSubAdminFormData, password: e.target.value})}
                placeholder="Enter password"
                disabled={isAddSubAdminPending}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button 
                onClick={handleAddSubAdmin} 
                disabled={isAddSubAdminPending}
                className="flex-1"
              >
                {isAddSubAdminPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add SubAdmin
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddSubAdminDialog(false)
                  setAddSubAdminFormData({ name: '', username: '', password: '' })
                }}
                disabled={isAddSubAdminPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// SubAdmin Card Component with Edit and Delete functionality
function SubAdminCard({ subadmin, onUpdate, onDelete, isUpdating, isDeleting }) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: subadmin.name,
    username: subadmin.username,
    password: ''
  })
  console.log('SubAdminCard render:', subadmin)

  const handleUpdateSubAdmin = () => {
    if (!editFormData.name || !editFormData.username) {
      toast.error('Name and username are required')
      return
    }

    const updateData = {
      id: subadmin._id,
      name: editFormData.name,
      username: editFormData.username,
    }

    // Only include password if it's been changed
    if (editFormData.password && editFormData.password.trim() !== '') {
      updateData.password = editFormData.password
    }

    onUpdate(updateData, {
      onSuccess: () => {
        toast.success('SubAdmin updated successfully!')
        setShowEditDialog(false)
        setEditFormData({ name: '', username: '', password: '' })
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to update SubAdmin')
      }
    })
  }

  const handleDeleteSubAdmin = () => {
    onDelete(subadmin._id, {
      onSuccess: () => {
        toast.success('SubAdmin deleted successfully!')
        setShowDeleteDialog(false)
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to delete SubAdmin')
      }
    })
  }

  const recentLogins = [...(subadmin.log_history || [])]
    .sort((a, b) => new Date(b.login_time) - new Date(a.login_time))
    .slice(0, 2)

  const isCurrentlyLoggedIn = recentLogins.length > 0 && !recentLogins[0].logout_time

  return (
    <>
      <div className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold flex items-center gap-2">
                {subadmin.name}
              </h4>
              <p className="text-xs text-gray-600">@{subadmin.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => {
                setEditFormData({
                  name: subadmin.name,
                  username: subadmin.username,
                  password: ''
                })
                setShowEditDialog(true)
              }}
            >
              <Edit className="h-4 w-4 text-blue-600" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>

        {recentLogins.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Recent Activity
            </p>
            {recentLogins.map((log) => {
              const loginDate = new Date(log.login_time)
              const logoutDate = log.logout_time ? new Date(log.logout_time) : null

              return (
                <div key={log._id} className="text-xs text-gray-600 pl-4">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Login:</span>
                    <span>{loginDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="text-gray-400">•</span>
                    <span>{loginDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {logoutDate && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <span className="font-medium">Logout:</span>
                      <span>{logoutDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Edit SubAdmin Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit SubAdmin
            </DialogTitle>
            <DialogDescription>
              Update SubAdmin account information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-username">Username *</Label>
              <Input
                id="edit-username"
                value={editFormData.username}
                onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
              <Input
                id="edit-password"
                type="password"
                value={editFormData.password}
                onChange={(e) => setEditFormData({...editFormData, password: e.target.value})}
                placeholder="Enter new password"
              />
              <p className="text-xs text-gray-500">Only enter a password if you want to change it</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button 
                onClick={handleUpdateSubAdmin} 
                disabled={isUpdating}
                className="flex-1"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update SubAdmin
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowEditDialog(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Delete SubAdmin
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this SubAdmin account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-red-800 mb-1">Warning</p>
                <p className="text-red-700">
                  Deleting <strong>{subadmin.name}</strong> (@{subadmin.username}) will remove all their access and login history permanently.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button 
              variant="destructive"
              onClick={handleDeleteSubAdmin} 
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete SubAdmin
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SettingsPanel