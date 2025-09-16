import React, { useState } from "react"
import { Settings as SettingsIcon, Download, Upload, RefreshCw } from "lucide-react"

export default function Settings() {
  const [companyName, setCompanyName] = useState("OrderFlow")
  const [companyEmail, setCompanyEmail] = useState("support@example.com")
  const [theme, setTheme] = useState("light")
  const [importJson, setImportJson] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl flex items-center gap-2"><SettingsIcon className="h-5 w-5" /> System Settings</h2>
          <p className="text-sm text-muted-foreground">Configure system preferences</p>
        </div>
        <div className="flex gap-2">
          <button className="border rounded px-3 py-2 inline-flex items-center gap-2"><Download className="h-4 w-4"/>Export</button>
          <button className="border rounded px-3 py-2 inline-flex items-center gap-2"><RefreshCw className="h-4 w-4"/>Reset</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-lg border p-4 space-y-3">
          <div className="text-lg font-semibold">System Configuration</div>
          <div className="space-y-2">
            <label className="text-sm">Company Name</label>
            <input className="w-full border rounded px-3 py-2" value={companyName} onChange={(e)=>setCompanyName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Company Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" value={companyEmail} onChange={(e)=>setCompanyEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Theme</label>
            <select className="w-full border rounded px-3 py-2" value={theme} onChange={(e)=>setTheme(e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <button className="w-full bg-primary text-primary-foreground rounded px-3 py-2">Save Changes</button>
        </div>

        <div className="rounded-lg border p-4 space-y-3">
          <div className="text-lg font-semibold">Import Settings</div>
          <textarea rows={8} className="w-full border rounded px-3 py-2 text-sm" placeholder="Paste settings JSON here..." value={importJson} onChange={(e)=>setImportJson(e.target.value)} />
          <div className="flex gap-2">
            <button className="flex-1 bg-primary text-primary-foreground rounded px-3 py-2">Import Settings</button>
            <button className="flex-1 border rounded px-3 py-2">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}


