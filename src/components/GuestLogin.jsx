import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function GuestLogin({ onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleGuestLogin = async (e) => {
    e.preventDefault();
    try {
      // Generate a unique guest ID and password
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const guestId = `guest_${timestamp}_${randomString}`;
      const guestPassword = `guest_${timestamp}_${randomString}`;
      
      // Create guest account with unique ID
      const guestData = {
        name,
        email,
        password: guestPassword,
        isGuest: true,
        guestId
      };
      
      await register(guestData);
      // After registration, automatically log in
      await login(email, guestPassword);
      toast.success('Guest account created and logged in successfully');
      onClose();
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to create guest account');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Continue as Guest</h2>
      <form onSubmit={handleGuestLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue as Guest
        </button>
      </form>
    </div>
  );
}

export default GuestLogin;