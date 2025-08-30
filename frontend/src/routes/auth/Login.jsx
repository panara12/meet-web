import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { setUserInfo } from '../../store/slice/appSlice';
import LoadingGif from '../../component/loading';
import ShowError from '../../component/showError';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    domain:'',
    password: ''
  });
const { mutate: loginMutation, isPending, isError, error } = useLogin();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  return (
    <div className="min-h-screen bg-container flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dark">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-medium">
            Welcome back! Please enter your credentials
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-light placeholder-medium text-dark rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="domain" className="sr-only">
                domain
              </label>
              <input
                id="domain"
                name="domain"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-light placeholder-medium text-dark rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="domain"
                value={formData.domain}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-light placeholder-medium text-dark rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-light rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-medium">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-dark">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button className="btn btn-primary w-full" type="submit" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </button>
          </div>
            {isPending && <LoadingGif size={120} />}

            {/* Error message */}
            {isError && (
              <ShowError error={error} />
            )}
        </form>
      </div>
    </div>
  );
}

export default Login;
