import { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout.tsx';
import { Card, Button } from '../components/common';
import { Settings as SettingsIcon, Bell, Lock, User } from 'lucide-react';

export default function Settings() {
  const [name, setName] = useState('Store Manager');
  const [email, setEmail] = useState('manager@store.com');
  const [notifications, setNotifications] = useState({ stockout: true, budget: true, weekly: false });
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('wisemann-settings');
    if (saved) {
      const settings = JSON.parse(saved);
      setName(settings.name || name); setEmail(settings.email || email);
      setNotifications(settings.notifications || notifications);
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('wisemann-settings', JSON.stringify({ name, email, notifications }));
    setNotice('Settings saved.');
  };

  const changePassword = () => {
    const password = window.prompt('Enter your new password (at least 8 characters):');
    if (password === null) return;
    setNotice(password.length >= 8 ? 'Password updated for this demo session.' : 'Password must be at least 8 characters.');
  };
  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
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
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-border px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-border px-4 py-2"
              />
            </div>
            <Button variant="primary" onClick={saveSettings}>Save Changes</Button>
            {notice && <p className="text-sm text-success" role="status">{notice}</p>}
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
              <input type="checkbox" checked={notifications.stockout} onChange={(e) => setNotifications({ ...notifications, stockout: e.target.checked })} className="w-4 h-4" />
              <span className="text-text">Stockout alerts</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={notifications.budget} onChange={(e) => setNotifications({ ...notifications, budget: e.target.checked })} className="w-4 h-4" />
              <span className="text-text">Budget warnings</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={notifications.weekly} onChange={(e) => setNotifications({ ...notifications, weekly: e.target.checked })} className="w-4 h-4" />
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

          <Button variant="secondary" onClick={changePassword}>Change Password</Button>
        </Card>
      </div>
    </MainLayout>
  );
}
