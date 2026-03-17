// [path]: app/(dashboard)/dashboard/settings/page.tsx

'use client';

import { useState } from 'react';
import { User, Bell, Palette, Wrench } from 'lucide-react';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your account and workshop preferences.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* User Profile Section */}
        <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
             <User className="mr-3 text-gray-400" /> User Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg text-white">John &quot;Boss&quot; Doe (Placeholder)</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg text-white">boss@allamericanmuscle.co.za</p>
            </div>
            <Button variant="outline" size="sm">Edit Profile</Button>
           </div>
        </div>

        {/* Workshop Management Section */}
        <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Wrench className="mr-3 text-gray-400" /> Workshop Management
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-200">Project Templates</p>
                <p className="text-sm text-gray-400">Create and manage templates for new projects.</p>
              </div>
              <Button href="/dashboard/settings/templates" variant="secondary" size="sm">
                Manage Templates
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Bell className="mr-3 text-gray-400" /> Notifications
          </h2>
          <div className="space-y-4">
           <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-200">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive an email when a customer comments.</p>
              </div>
              <ToggleSwitch enabled={emailNotifications} setEnabled={setEmailNotifications} />
            </div>
          </div>
        </div>
        
        {/* Appearance Section */}
        <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Palette className="mr-3 text-gray-400" /> Appearance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-200">Dark Mode</p>
                <p className="text-sm text-gray-400">Toggle the UI theme.</p>
              </div>
               <ToggleSwitch enabled={darkMode} setEnabled={setDarkMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}