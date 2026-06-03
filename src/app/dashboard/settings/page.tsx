'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Camera, Bell, Lock, Moon, Sun, User, Save } from 'lucide-react'
import { uploadProfileImage } from '@/lib/firebase/storage'
import { updateUserAvatar } from '@/lib/firebase/auth'
import { updateUserProfilePhoto } from '@/lib/firebase/firestore'



export default function SettingsPage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.displayName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [uploading, setUploading] = useState(false)
  const handleSave = () => {
    alert('Settings saved successfully!')
  }
  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file || !user) return

    try {
      setUploading(true)

      const photoURL = await uploadProfileImage(
        user.uid,
        file
      )

      await updateUserAvatar(photoURL)

      await updateUserProfilePhoto(
        user.uid,
        photoURL
      )

      alert('Profile picture updated')
    } catch (error) {
      console.error(error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-500 mt-2">
          Manage your account preferences and application settings.
        </p>
      </div>
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <img
            src={
              user?.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                name || 'User'
              )}`
            }
            alt="Profile"
            className="w-24 h-24 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
          />

          <label className="absolute -bottom-2 -right-2 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />

            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition">
              <Camera className="w-4 h-4" />
            </div>
          </label>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Profile Picture
          </h3>

          <p className="text-sm text-slate-500">
            Upload JPG, PNG or WebP
          </p>

          {uploading && (
            <p className="text-xs text-brand-600 mt-2">
              Uploading...
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-6">
        {/* Profile */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-5">
            {darkMode ? (
              <Moon className="w-5 h-5 text-indigo-500" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500" />
            )}
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>

          <div className="flex items-center justify-between">
            <span>Dark Mode</span>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-8 rounded-full transition ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition ${darkMode ? 'ml-7' : 'ml-1'
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="flex items-center justify-between">
            <span>Email Notifications</span>

            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-14 h-8 rounded-full transition ${notifications ? 'bg-green-600' : 'bg-slate-300'
                }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition ${notifications ? 'ml-7' : 'ml-1'
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Lock className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>

          <button className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            Change Password
          </button>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-3 rounded-xl font-medium transition"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  )
}