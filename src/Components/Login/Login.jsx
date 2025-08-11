import React, { useState } from 'react';
import { Button, Input } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../utils/axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const [phone, setPhone] = useState('+998');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    if (!input.startsWith('+998')) {
      setPhone('+998');
      return;
    }
    const digitsOnly = input.slice(4).replace(/\D/g, '');
    const limitedDigits = digitsOnly.slice(0, 9);
    setPhone('+998' + limitedDigits);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

const handleLogin = async () => {
  try {
    setLoading(true);
    const loginData = { phone, password };
    const response = await axios.post('api/login', loginData);
    const token = response.data.data.token; // Note the added .data
    const user = response.data.data.user; // Get the user data

    if (token) {
      localStorage.setItem('token', token);
      // You might want to store user information if needed
      localStorage.setItem('user', JSON.stringify(user));

      Swal.fire({
        title: 'Muvaffaqiyatli!',
        icon: 'success',
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showCloseButton: true,
        toast: true,
        showConfirmButton: false,
      });

      // Navigate to dashboard if login successful
      navigate('/dashboard');
    }
  } catch (error) {
    Swal.fire({
      title: 'Xatolik!',
      text: error.response?.data?.message || error.message || 'Kirishda xatolik.',
      icon: 'error',
      position: 'top-end',
      timer: 3000,
      timerProgressBar: true,
      showCloseButton: true,
      toast: true,
      showConfirmButton: false,
    });
  } finally {
    setLoading(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] px-2">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/30">
        <div className="text-center mb-8">
          <span className="text-white font-bold text-2xl tracking-wide">Moni</span>
          <h2 className="mt-4 text-xl font-semibold text-white">Tizimga kirish</h2>
          <p className="mt-2 text-sm text-gray-200">Kirish uchun ma'lumotlarni kiriting</p>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1">
              Telefon raqam
            </label>
            <Input
              id="phone"
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              onKeyPress={handleKeyPress}
              placeholder="+998 XX XXX XX XX"
              className="bg-white/30 text-white placeholder-gray-300   focus:ring-2 focus:ring-green-400  "
              maxLength={13}
              crossOrigin={undefined}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              Parol
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Parolni kiriting"
                className="bg-white/30 text-white placeholder-gray-300   focus:ring-2 focus:ring-green-400  "
                crossOrigin={undefined}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none"
              >
                {showPassword ? (
                  <VisibilityOffIcon className="h-5 w-5" />
                ) : (
                  <VisibilityIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <Button
            onClick={handleLogin}
            disabled={loading}
            ripple={true}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow transition"
          >
            {loading ? 'Yuklanmoqda...' : 'Kirish'}
          </Button>
        </div>
        <div className="text-center text-xs text-gray-300 mt-6">
          &copy; {new Date().getFullYear()} Moni . Barcha huquqlar himoyalangan.
        </div>
      </div>
    </div>
  );
};

export default Login;