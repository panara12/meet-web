import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import UseVerifyOtp from "../../hooks/auth/useVerifyOtp";
import { useSelector } from "react-redux";
import ErrorMessage from "../../component/ui/errorMessage";
import { useNavigate } from "react-router-dom";

// Simple UI Components (instead of importing from ./ui)
function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none ${className}`}
      {...props}
    />
  );
}

function Label({ children, className = "", ...props }) {
  return (
    <label
      className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-lg rounded-xl ${className}`}>{children}</div>
  );
}

function CardContent({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

function Alert({ children, className = "" }) {
  return (
    <div
      className={`flex items-start gap-2 p-3 rounded-lg border text-sm ${className}`}
    >
      {children}
    </div>
  );
}

function AlertDescription({ children, className = "" }) {
  return <span className={`${className}`}>{children}</span>;
}

// ---------------------- OTP Page --------------------------
export default function OTPVerification() {
  const navigate = useNavigate()
  const userEmail = useSelector((state) => state.app.userEmail);
  useEffect(()=>{
    if(userEmail == null) navigate('/login')
  },[userEmail])

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300); // 5 min
  const [canResend, setCanResend] = useState(false);
  

  const {mutate:verifyOtp,isPending, isError, error} = UseVerifyOtp()

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    verifyOtp({userEmail,otp})
  };

  const handleResendOTP = () => {
    setTimer(300);
    setCanResend(false);
    setOtp("");
    verifyOtp({userEmail,otp})
  };


  return (
    <div className="min-h-screen flex">
      {
        isError && <ErrorMessage message={error.message}/>
      }
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative">
        <div className="relative z-10 flex flex-col justify-center items-center text-center space-y-8 w-full p-12">
          <img src='./logo.png' alt="Logo" className="w-48 h-auto mx-auto mb-8" />
          <h1 className="text-4xl font-light">OTP Verification</h1>
          <p className="text-lg">Secure verification for password reset</p>
          <Alert className="bg-white/10 border-white/20 text-white">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Please enter the 6-digit code sent to your mobile within 5 minutes.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          {/* Back Button */}
          <Button
            className="flex items-center gap-2 text-blue-600 bg-transparent hover:underline"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">Enter OTP</h2>
            <p className="text-gray-600">We've sent a verification code to</p>
          </div>

          {/* OTP Form */}
          <Card>
            <CardContent>
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <Label htmlFor="otp">Enter 6-digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    placeholder="000000"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtp(value);
                    }}
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="text-center space-y-2">
                  {timer > 0 ? (
                    <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      Code expires in {formatTime(timer)}
                    </p>
                  ) : (
                    <p className="text-sm text-red-600">OTP has expired</p>
                  )}

                  {canResend && (
                    <Button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-blue-600 bg-transparent hover:underline"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" /> Resend OTP
                    </Button>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700"
                  disabled={otp.length !== 6 || isPending || timer === 0}
                >
                  {isPending ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

