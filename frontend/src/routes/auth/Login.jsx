import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react';
import { ChevronDown, Shield, User, Package, CreditCard, Truck } from 'lucide-react';
import { useLogin } from '../../hooks/auth/useLogin';
import ErrorMessage from '../../component/ui/errorMessage';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';


function Login() {
    const [selectedLoginType, setSelectedLoginType] = useState('Email');
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');
    const {mutate:UserLogin,isPending, isError, error} = useLogin();
    const [formError, setFormError] = useState('');
    const [errorOtp,setErrorOtp] = useState("");
    const location = useLocation();
    useEffect(() => {
      if (location?.state?.result) {
        setErrorOtp(location.state.result);
        window.history.replaceState({}, document.title); // Clear state
      }
    }, [location]);
    

    const [isOpen, setIsOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'admin',
      name: 'Admin',
      icon: <Shield className="w-5 h-5 text-red-500" />,
      color: 'border-red-200 bg-red-50'
    },
    {
      id: 'salesman',
      name: 'Salesman',
      icon: <User className="w-5 h-5 text-green-500" />,
      color: 'border-green-200 bg-green-50'
    },
    {
      id: 'packing',
      name: 'Packing',
      icon: <Package className="w-5 h-5 text-blue-500" />,
      color: 'border-blue-200 bg-blue-50'
    }
    // {
    //   id: 'billing-department',
    //   name: 'Billing Department',
    //   icon: <CreditCard className="w-5 h-5 text-purple-500" />,
    //   color: 'border-purple-200 bg-purple-50'
    // },
    // {
    //   id: 'vendor',
    //   name: 'Vendor',
    //   icon: <Truck className="w-5 h-5 text-orange-500" />,
    //   color: 'border-orange-200 bg-orange-50'
    // }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormError('');
    setIsOpen(false);
  };

  const handleLogin = ()=>{
     setFormError('');
     if (!selectedRole) {
      setFormError('Please select your department');
      return;
    }

    if (!selectedLoginType) {
      setFormError('Please select login type');
      return;
    }

    if (!username.trim()) {
      setFormError(`Please enter your ${selectedLoginType.toLowerCase()}`);
      return;
    }

    if (!password.trim()) {
      setFormError('Please enter your password');
      return;
    }
    const userdata = {
      type:selectedLoginType,
      username:username.trim(),
      password:password.trim()
    }
    UserLogin(userdata);
    
  }


  return (
    <div className='w-full m-0 p-0 flex justify-center items-center text-white'>
      <div className='hidden lg:block w-1/2 flex justify-center px-16 py-12 items-center brand-gradient-dark'>
        <div className=' flex items-center flex-col'>
          <div className='w-3/6'>
            <img src="./logo.png" alt="" className=''/>
          </div>
          <div className='flex flex-col items-center'>
            <p className='text-4xl mb-5'>Order Management System</p>
            <p className='text-xl'>Streamline your business operations with our</p>
            <p className='text-xl'>comprehensive management platform</p>
          </div>
          
          <div className="grid grid-cols-2 gap-5 mt-14 max-w-sm">
            <div className="text-center flex flex-col  ">
              <div className="self-center feature-box">
                <Icon icon="mynaui:package" width="30" height="30" />
              </div>
              <p className="text-sm text-brand-light">Inventory Management</p>
            </div>
            <div className="text-center flex flex-col">
              <div className="self-center feature-box">
                <Icon icon="tabler:file-text" width="30" height="30" />
              </div>
              <p className="text-sm text-brand-light">Order Processing</p>
            </div>
            <div className="text-center flex flex-col">
              <div className="self-center feature-box">
                <Icon icon="majesticons:users-line" width="30" height="30" />
              </div>
              <p className="text-sm text-brand-light">Customer Management</p>
            </div>
            <div className="text-center flex flex-col">
              <div className="self-center feature-box">
                <Icon icon="ri:truck-line" width="30" height="30" />
              </div>
              <p className="text-sm text-brand-light">Vendor Relations</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 min-h-screen flex justify-center items-center bg-gray-100">
        <div className="w-full max-w-sm mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">Welcome Back</h2>
            <p className="text-gray-600 text-sm">Please sign in to your account</p>
          </div>
          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-2xl p-6">
            {/* Role Selection */}
            <div className="relative w-full max-w-md">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Your Role
      </label>
      
      {/* Dropdown Toggle */}
      <div
        className={`relative w-full bg-white border-2 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${
          isOpen 
            ? 'border-blue-500 shadow-lg' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span className={selectedRole ? 'text-gray-900' : 'text-gray-500'}>
            {selectedRole ? selectedRole.name : 'Choose your department'}
          </span>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                selectedRole?.id === role.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => handleRoleSelect(role)}
            >
              <div className={`p-2 rounded-lg border ${role.color}`}>
                {role.icon}
              </div>
              <span className="text-gray-900 font-medium">{role.name}</span>
              {selectedRole?.id === role.id && (
                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>

            {/* Login Type Tabs */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Login Credentials
              </label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['Email','Username', 'Mobile'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedLoginType(type)}
                    className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                      selectedLoginType === type
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* username Input */}
            <div className="mb-4 text-black">
              <input
                type={selectedLoginType === 'username' ? 'username' : selectedLoginType === 'Mobile' ? 'tel' : 'text'}
                placeholder={`Enter your ${selectedLoginType.toLowerCase()}${selectedLoginType === 'Email' ? '' : ' address'}`}
                value={username}
                onChange={(e) => setusername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              />
            </div>

            {/* Password Input */}
            <div className="mb-4 text-black">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
              />
            </div>

            {/* Validation Error */}
            {formError && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {formError}
              </div>
            )}

            {/* Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <Link to="/forgotpassword" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 mb-4">
                {isPending?'Login...':'Login'}
            </button>

            {
              isError &&  <ErrorMessage message={error.response.data.message} />
            }

            {
              errorOtp && <ErrorMessage message={errorOtp} />
            }

            {/* Support Link */}
            {/* <div className="text-center">
              <p className="text-xs text-gray-600">
                Need technical support?{' '}
                <button className="text-blue-600 hover:text-blue-800 transition-colors">
                  Contact IT Department
                </button>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login