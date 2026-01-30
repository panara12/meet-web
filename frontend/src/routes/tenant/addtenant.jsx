import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../distributer/ui/card';
import { Input } from '../distributer/ui/input';
import { Label } from '../distributer/ui/label';
import { Button } from '../distributer/ui/button';
import { Checkbox } from '../distributer/ui/checkbox';
import Separator from '../distributer/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../distributer/ui/dialog';
import { Eye, EyeOff, Lock, User, Building2, Database, CreditCard, Users, MapPin, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {useAddTenant} from '../../hooks/tenant/useAddTenant';

export default function TenantRegistrationPage() {
  // Login state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({
    username: '',
    password: ''
  });
  const {mutate:addtenant, isPensing: isAddTenantPending} = useAddTenant()

  // Form state - Tenant fields
  const [tenantData, setTenantData] = useState({
    D_name: '',
    D_domain: '',
    D_plan: '',
    D_payment: '',
    D_dbname: ''
  });

  // Form state - Distributor fields
  const [distributorData, setDistributorData] = useState({
    distributer_name: '',
    distributer_mobile: '',
    distributer_email: '',
    distributer_password: '',
    distributer_firms: '',
    distributer_city: '',
    distributer_username: ''
  });

  // Form state - Limits fields
  const [limitsData, setLimitsData] = useState({
    adminlimit: 0,
    salesmanlimit: 0,
    packagelimit: 0,
    billinglimit: 0,
    liveLocationlimit: 0,
    routeLocationlimit: 0,
    wantToUsePhotos: false,
    isAdminMembers: false,
    wantToUsePayment: false,
    wantToUseLocation: false
  });

  const [showDistributorPassword, setShowDistributorPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle login
  const handleLogin = () => {
    // Replace with your actual login logic/API call
    if (loginCredentials.username === 'admin' && loginCredentials.password === 'admin123') {
      setIsAuthenticated(true);
      setShowLoginDialog(false);
      toast.success('Login successful!');
    } else {
      toast.error('Invalid credentials. Try admin/admin123');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Validate required fields
    const requiredTenantFields = ['D_name', 'D_domain', 'D_plan', 'D_payment', 'D_dbname'];
    const requiredDistributorFields = ['distributer_name', 'distributer_mobile', 'distributer_email', 'distributer_password', 'distributer_username'];

    const missingTenantFields = requiredTenantFields.filter(field => !tenantData[field]);
    const missingDistributorFields = requiredDistributorFields.filter(field => !distributorData[field]);

    if (missingTenantFields.length > 0 || missingDistributorFields.length > 0) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    // Prepare payload
    const payload = {
      // Tenant fields
      D_name: tenantData.D_name,
      D_domain: tenantData.D_domain,
      D_plan: tenantData.D_plan,
      D_payment: tenantData.D_payment,
      D_dbname: tenantData.D_dbname,

      // Distributor fields
      distributer_name: distributorData.distributer_name,
      distributer_mobile: distributorData.distributer_mobile,
      distributer_email: distributorData.distributer_email,
      distributer_password: distributorData.distributer_password,
      distributer_firms: distributorData.distributer_firms,
      distributer_city: distributorData.distributer_city,
      distributer_username: distributorData.distributer_username,

      // Limits fields (with duplicated location limits)
      adminlimit: Number(limitsData.adminlimit),
      salesmanlimit: Number(limitsData.salesmanlimit),
      packagelimit: Number(limitsData.packagelimit),
      billinglimit: Number(limitsData.billinglimit),
      
      // Location limits - both same value
      liveLocationlimit: Number(limitsData.liveLocationlimit),
      totalLiveLocationlimit: Number(limitsData.liveLocationlimit),
      
      routeLocationlimit: Number(limitsData.routeLocationlimit),
      totalRouteLocationlimit: Number(limitsData.routeLocationlimit),

      // Boolean flags
      wantToUsePhotos: limitsData.wantToUsePhotos,
      isAdminMembers: limitsData.isAdminMembers,
      wantToUsePayment: limitsData.wantToUsePayment,
      wantToUseLocation: limitsData.wantToUseLocation
    };

    console.log('Payload to submit:', JSON.stringify(payload, null, 2));

    try {
      // Replace with your actual API call
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(payload)
      // });
      // const data = await response.json();

      // Simulate API call
      addtenant(payload);
      
      toast.success('Tenant registered successfully!');
      
      // Reset form
      setTenantData({ D_name: '', D_domain: '', D_plan: '', D_payment: '', D_dbname: '' });
      setDistributorData({ distributer_name: '', distributer_mobile: '', distributer_email: '', distributer_password: '', distributer_firms: '', distributer_city: '', distributer_username: '' });
      setLimitsData({ adminlimit: 0, salesmanlimit: 0, packagelimit: 0, billinglimit: 0, liveLocationlimit: 0, routeLocationlimit: 0, wantToUsePhotos: false, isAdminMembers: false, wantToUsePayment: false, wantToUseLocation: false });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to register tenant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Login Dialog
  if (!isAuthenticated) {
    return (
      <Dialog open={showLoginDialog} onOpenChange={() => {}}>
        <DialogContent className="max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              Admin Login
            </DialogTitle>
            <DialogDescription>
              Please enter your credentials to access the tenant registration page
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={loginCredentials.username}
                  onChange={(e) => setLoginCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={loginCredentials.password}
                  onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Demo credentials: admin / admin123
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Main Registration Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Tenant Registration
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Create a new tenant account with distributor details and system limits
          </p>
        </div>

        <div className="space-y-6">
          {/* Tenant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Tenant Information
              </CardTitle>
              <CardDescription>
                Basic tenant configuration and domain settings
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="D_name">Tenant Name <span className="text-destructive">*</span></Label>
                <Input
                  id="D_name"
                  placeholder="Enter tenant name"
                  value={tenantData.D_name}
                  onChange={(e) => setTenantData(prev => ({ ...prev, D_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="D_domain">Domain <span className="text-destructive">*</span></Label>
                <Input
                  id="D_domain"
                  placeholder="example.com"
                  value={tenantData.D_domain}
                  onChange={(e) => setTenantData(prev => ({ ...prev, D_domain: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="D_plan">Plan <span className="text-destructive">*</span></Label>
                <Input
                  id="D_plan"
                  placeholder="Basic, Pro, Enterprise"
                  value={tenantData.D_plan}
                  onChange={(e) => setTenantData(prev => ({ ...prev, D_plan: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="D_payment">Payment <span className="text-destructive">*</span></Label>
                <Input
                  id="D_payment"
                  placeholder="Monthly, Yearly"
                  value={tenantData.D_payment}
                  onChange={(e) => setTenantData(prev => ({ ...prev, D_payment: e.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="D_dbname">Database Name <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Database className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="D_dbname"
                    placeholder="tenant_db_name"
                    value={tenantData.D_dbname}
                    onChange={(e) => setTenantData(prev => ({ ...prev, D_dbname: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Distributor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Distributor Information
              </CardTitle>
              <CardDescription>
                Primary distributor account details
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distributer_name">Name <span className="text-destructive">*</span></Label>
                <Input
                  id="distributer_name"
                  placeholder="Distributor full name"
                  value={distributorData.distributer_name}
                  onChange={(e) => setDistributorData(prev => ({ ...prev, distributer_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distributer_username">Username <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="distributer_username"
                    placeholder="username"
                    value={distributorData.distributer_username}
                    onChange={(e) => setDistributorData(prev => ({ ...prev, distributer_username: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="distributer_mobile">Mobile <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="distributer_mobile"
                    type="tel"
                    placeholder="+1234567890"
                    value={distributorData.distributer_mobile}
                    onChange={(e) => setDistributorData(prev => ({ ...prev, distributer_mobile: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="distributer_email">Email <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="distributer_email"
                    type="email"
                    placeholder="distributor@example.com"
                    value={distributorData.distributer_email}
                    onChange={(e) => setDistributorData(prev => ({ ...prev, distributer_email: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="distributer_password">Password <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="distributer_password"
                    type={showDistributorPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={distributorData.distributer_password}
                    onChange={(e) => setDistributorData(prev => ({ ...prev, distributer_password: e.target.value }))}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDistributorPassword(!showDistributorPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showDistributorPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="distributer_firms">Firms</Label>
                <Input
                  id="distributer_firms"
                  placeholder="Firm names (comma separated)"
                  value={distributorData.distributer_firms}
                  onChange={(e) => setDistributorData(prev => ({ ...prev, distributer_firms: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">Separate multiple firms with commas</p>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="distributer_city">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="distributer_city"
                    placeholder="City name"
                    value={distributorData.distributer_city}
                    onChange={(e) => setDistributorData(prev => ({ ...prev, distributer_city: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                System Limits & Permissions
              </CardTitle>
              <CardDescription>
                Configure user limits and feature permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Limits */}
              <div>
                <h3 className="text-sm font-semibold mb-3">User Limits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminlimit">Admin Limit</Label>
                    <Input
                      id="adminlimit"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={limitsData.adminlimit}
                      onChange={(e) => setLimitsData(prev => ({ ...prev, adminlimit: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salesmanlimit">Salesman Limit</Label>
                    <Input
                      id="salesmanlimit"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={limitsData.salesmanlimit}
                      onChange={(e) => setLimitsData(prev => ({ ...prev, salesmanlimit: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="packagelimit">Package Limit</Label>
                    <Input
                      id="packagelimit"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={limitsData.packagelimit}
                      onChange={(e) => setLimitsData(prev => ({ ...prev, packagelimit: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billinglimit">Billing Limit</Label>
                    <Input
                      id="billinglimit"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={limitsData.billinglimit}
                      onChange={(e) => setLimitsData(prev => ({ ...prev, billinglimit: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location Limits */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Location Limits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="liveLocationlimit">Live Location Limit</Label>
                    <Input
                      id="liveLocationlimit"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={limitsData.liveLocationlimit}
                      onChange={(e) => setLimitsData(prev => ({ ...prev, liveLocationlimit: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      This value will be used for both liveLocationlimit and totalLiveLocationlimit
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routeLocationlimit">Route Location Limit</Label>
                    <Input
                      id="routeLocationlimit"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={limitsData.routeLocationlimit}
                      onChange={(e) => setLimitsData(prev => ({ ...prev, routeLocationlimit: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      This value will be used for both routeLocationlimit and totalRouteLocationlimit
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Feature Permissions */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Feature Permissions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wantToUsePhotos"
                      checked={limitsData.wantToUsePhotos}
                      onCheckedChange={(checked) => setLimitsData(prev => ({ ...prev, wantToUsePhotos: checked }))}
                    />
                    <label
                      htmlFor="wantToUsePhotos"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Enable Photos
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isAdminMembers"
                      checked={limitsData.isAdminMembers}
                      onCheckedChange={(checked) => setLimitsData(prev => ({ ...prev, isAdminMembers: checked }))}
                    />
                    <label
                      htmlFor="isAdminMembers"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Admin Members
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wantToUsePayment"
                      checked={limitsData.wantToUsePayment}
                      onCheckedChange={(checked) => setLimitsData(prev => ({ ...prev, wantToUsePayment: checked }))}
                    />
                    <label
                      htmlFor="wantToUsePayment"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Enable Payment
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wantToUseLocation"
                      checked={limitsData.wantToUseLocation}
                      onCheckedChange={(checked) => setLimitsData(prev => ({ ...prev, wantToUseLocation: checked }))}
                    />
                    <label
                      htmlFor="wantToUseLocation"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Enable Location
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setTenantData({ D_name: '', D_domain: '', D_plan: '', D_payment: '', D_dbname: '' });
                setDistributorData({ distributer_name: '', distributer_mobile: '', distributer_email: '', distributer_password: '', distributer_firms: '', distributer_city: '', distributer_username: '' });
                setLimitsData({ adminlimit: 0, salesmanlimit: 0, packagelimit: 0, billinglimit: 0, liveLocationlimit: 0, routeLocationlimit: 0, wantToUsePhotos: false, isAdminMembers: false, wantToUsePayment: false, wantToUseLocation: false });
                toast.info('Form reset');
              }}
            >
              Reset Form
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Register Tenant
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}