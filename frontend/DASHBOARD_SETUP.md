# Dashboard Setup Guide

## Overview
A new dashboard has been added to the Meet application with protected routes and a modern header interface. The dashboard includes a comprehensive user profile management system.

## Features

### Dashboard Header
- **Sticky positioning**: Header stays at the top when scrolling
- **Left side**: App name "Meet Dashboard" with logo
- **Center**: Navigation menu with Home, Seller, Salesman, Packaging, Product, and Payment
- **Right side**: User profile with round avatar and logout functionality
- **Responsive**: Mobile-friendly with hamburger menu

### Protected Routes
- `/dashboard` - Main dashboard page
- `/dashboard/seller` - Seller management
- `/dashboard/salesman` - Salesman management
- `/dashboard/packaging` - Packaging management
- `/dashboard/product` - Product management
- `/dashboard/payment` - Payment management
- `/dashboard/profile` - User profile management

### User Profile Management
- **Personal Information**: Editable fields for user details
  - First Name, Last Name, Email, Phone
  - Company, Address, City, State, Pincode
- **Plan Information**: Read-only subscription details
  - Plan name, type, and pricing
  - Start and expiry dates
  - Feature list with included/excluded status
  - Billing information and payment method
- **Edit Mode**: Toggle between view and edit modes
- **Form Validation**: Input validation and error handling
- **Loading States**: Loading indicators for better UX

### Authentication Flow
1. Users must login first at `/login`
2. After successful login, they are redirected to `/dashboard`
3. All dashboard routes are protected and require authentication
4. Unauthenticated users are redirected to `/login`

## Components Created

### New Components
- `DashboardHeader.jsx` - Main dashboard header with navigation
- `DashboardLayout.jsx` - Layout wrapper for dashboard pages
- `ProtectedRoute.jsx` - Route protection component
- `Dashboard.jsx` - Main dashboard page with stats and overview
- `Seller.jsx` - Seller management placeholder
- `Salesman.jsx` - Salesman management placeholder
- `Packaging.jsx` - Packaging management placeholder
- `Payment.jsx` - Payment management placeholder
- `UserProfile.jsx` - User profile management page

### New Services
- `userProfileService.jsx` - API service for user profile operations
  - `getUserProfile()` - Fetch user profile data
  - `updateUserProfile()` - Update user profile information
  - `getUserPlan()` - Fetch user subscription plan details
  - Mock data functions for development

### Updated Files
- `App.jsx` - Added dashboard routes and protection
- `useLogin.jsx` - Updated to redirect to dashboard after login
- `DashboardHeader.jsx` - Added profile navigation and dropdown

## Usage

### Accessing the Dashboard
1. Navigate to `/login`
2. Enter valid credentials
3. You'll be automatically redirected to `/dashboard`

### Navigation
- Use the header navigation to move between different sections
- Click on your profile avatar to access profile settings and logout
- Mobile users can use the hamburger menu

### User Profile Management
1. Click on your profile avatar in the header
2. Select "Profile Settings" from the dropdown
3. View your personal information and plan details
4. Click "Edit Profile" to make changes
5. Save changes or cancel to revert

### Plan Information
The plan section displays:
- **Current Plan**: Name, type, and pricing
- **Subscription Period**: Start and expiry dates
- **Feature List**: Shows which features are included/excluded
  - OMS (Order Management System)
  - Tracker
  - Payment Gateway
  - Advanced Analytics (if included)
  - API Access (if included)
  - Priority Support (if included)
- **Billing Details**: Next billing date, auto-renewal status, payment method

### Logout
- Click on your profile avatar (right side of header)
- Select "Logout" from the dropdown
- You'll be redirected to the login page

## Styling
The dashboard uses Tailwind CSS with a clean, modern design:
- White background with subtle shadows
- Blue accent color (#3b82f6) for primary actions
- Green accent color (#10b981) for success states
- Responsive grid layouts
- Hover effects and smooth transitions
- Loading spinners and disabled states

## API Integration

### User Profile Endpoints
- `GET /user/profile` - Fetch user profile data
- `PUT /user/profile` - Update user profile information

### Plan Information Endpoints
- `GET /user/plan` - Fetch user subscription plan details

### Data Structure
```javascript
// User Profile
{
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+91 98765 43210",
  company: "Tech Solutions Ltd",
  address: "123 Business Park, Tech Street",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001"
}

// Plan Details
{
  planName: "Business Pro",
  planType: "Annual",
  startDate: "2024-01-15",
  expiryDate: "2025-01-15",
  price: "₹24,999",
  features: [
    {
      id: "oms",
      name: "OMS (Order Management System)",
      included: true,
      description: "Complete order processing and management"
    }
    // ... more features
  ]
}
```

## Future Enhancements
- Add real data integration for stats
- Implement CRUD operations for each section
- Add user role-based access control
- Include data visualization charts
- Add search and filtering capabilities
- Profile picture upload functionality
- Password change functionality
- Two-factor authentication
- Email verification system
- Plan upgrade/downgrade options
