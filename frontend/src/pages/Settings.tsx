import MainLayout from '../components/layout/MainLayout.tsx';
import { Card, Button } from '../components/common';
import { Settings as SettingsIcon, Bell, Lock, User } from 'lucide-react';

export default function Settings() {
  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2 flex items-center gap-2">
            <SettingsIcon size={32} />
            Settings
          </h1>
          <p className="text-text-secondary">Manage your store and account preferences.</p>
        </div>

        {/* Account Settings */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User size={24} className="text-text-muted" />
            <h2 className="text-xl font-bold text-ink">Account</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="Store Manager"
                className="w-full rounded-lg border border-border px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">Email</label>
              <input
                type="email"
                defaultValue="manager@store.com"
                className="w-full rounded-lg border border-border px-4 py-2"
              />
            </div>
            <Button variant="primary">Save Changes</Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell size={24} className="text-text-muted" />
            <h2 className="text-xl font-bold text-ink">Notifications</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-text">Stockout alerts</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-text">Budget warnings</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-text">Weekly summary</span>
            </label>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Lock size={24} className="text-text-muted" />
            <h2 className="text-xl font-bold text-ink">Security</h2>
          </div>

          <Button variant="secondary">Change Password</Button>
        </Card>
      </div>
    </MainLayout>
  );
}
