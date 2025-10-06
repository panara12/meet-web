import React, { createContext, useContext, useState } from 'react';

const defaultSettings = {
  system: {
    companyName: 'OrderFlow Corp',
    companyEmail: 'admin@orderflow.com',
    timezone: 'utc-5',
    currency: 'usd',
    dateFormat: 'mm-dd-yyyy',
    language: 'en',
    theme: 'light',
    themeColor: '#3b82f6'
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    newOrders: true,
    paymentReceived: true,
    orderShipped: true,
    lowInventory: false,
    systemUpdates: false,
    notificationEmail: 'admin@orderflow.com'
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30,
    backupLocation: 'local'
  }
};

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('orderflow-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('orderflow-settings', JSON.stringify(newSettings));
  };

  const updateSystemSettings = (newSettings) => {
    saveSettings({
      ...settings,
      system: { ...settings.system, ...newSettings }
    });
  };

  const updateNotificationSettings = (newSettings) => {
    saveSettings({
      ...settings,
      notifications: { ...settings.notifications, ...newSettings }
    });
  };

  const updateBackupSettings = (newSettings) => {
    saveSettings({
      ...settings,
      backup: { ...settings.backup, ...newSettings }
    });
  };

  const resetToDefaults = () => {
    saveSettings(defaultSettings);
  };

  const exportSettings = () => {
    return JSON.stringify(settings, null, 2);
  };

  const importSettings = (settingsJson) => {
    try {
      const imported = JSON.parse(settingsJson);
      if (imported.system && imported.notifications && imported.backup) {
        saveSettings(imported);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSystemSettings,
        updateNotificationSettings,
        updateBackupSettings,
        resetToDefaults,
        exportSettings,
        importSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
