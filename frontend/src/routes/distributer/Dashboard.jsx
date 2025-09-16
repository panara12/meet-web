import React, { useState } from "react"
import { Users, Package, Building2, DollarSign, AlertTriangle, CheckCircle, MessageSquare, Inbox, Send } from "lucide-react"

export default function Dashboard() {
  const [showContact, setShowContact] = useState(false)
  const [contact, setContact] = useState({ name: "", email: "", subject: "", message: "" })
  const stats = {
    activeStaff: 4,
    totalProducts: 89,
    activeCompanies: 12,
    inventoryValue: 128430,
    lowStock: 6,
    outOfStock: 1,
    unreadNews: 2
  }

  const formatCurrency = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl lg:text-3xl">Welcome to OrderFlow</h1>
        <p className="text-muted-foreground">Overview and quick actions</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Active Staff</div>
              <div className="mt-1 text-2xl font-semibold">{stats.activeStaff}</div>
            </div>
            <Users className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Products</div>
              <div className="mt-1 text-2xl font-semibold">{stats.totalProducts}</div>
            </div>
            <Package className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="mt-2 text-xs flex items-center gap-2">
            {stats.lowStock > 0 ? (
              <>
                <AlertTriangle className="h-3 w-3 text-amber-600" />
                <span className="text-amber-700">{stats.lowStock} low stock</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-green-700">Healthy</span>
              </>
            )}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Active Companies</div>
              <div className="mt-1 text-2xl font-semibold">{stats.activeCompanies}</div>
            </div>
            <Building2 className="h-6 w-6 text-purple-500" />
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Inventory Value</div>
              <div className="mt-1 text-2xl font-semibold">{formatCurrency(stats.inventoryValue)}</div>
            </div>
            <DollarSign className="h-6 w-6 text-teal-600" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <button className="border rounded-lg p-4 text-left hover:bg-accent">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              <div>
                <div className="font-medium">Contact VoidVortex</div>
                <div className="text-sm text-muted-foreground">Request features & updates</div>
              </div>
            </div>
          </button>
          <button className="border rounded-lg p-4 text-left hover:bg-accent" onClick={() => setShowContact(true)}>
            <div className="flex items-center gap-3">
              <Send className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">Send a Message</div>
                <div className="text-sm text-muted-foreground">Support within 24-48 hours</div>
              </div>
            </div>
          </button>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Inbox className="h-5 w-5 text-indigo-500" />
              <div>
                <div className="font-medium">VoidVortex Messages</div>
                <div className="text-sm text-muted-foreground">{stats.unreadNews} new</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg border w-full max-w-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Contact VoidVortex Tech</h3>
              <button className="text-sm text-muted-foreground" onClick={() => setShowContact(false)}>Close</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm">Full Name</label>
                <input className="border rounded px-3 py-2 w-full" value={contact.name} onChange={(e)=>setContact({...contact,name:e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Email</label>
                <input type="email" className="border rounded px-3 py-2 w-full" value={contact.email} onChange={(e)=>setContact({...contact,email:e.target.value})} />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm">Subject</label>
                <input className="border rounded px-3 py-2 w-full" value={contact.subject} onChange={(e)=>setContact({...contact,subject:e.target.value})} />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm">Message</label>
                <textarea rows={4} className="border rounded px-3 py-2 w-full" value={contact.message} onChange={(e)=>setContact({...contact,message:e.target.value})} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary px-4 py-2 rounded bg-primary text-primary-foreground" onClick={()=>setShowContact(false)}>Send</button>
              <button className="btn px-4 py-2 rounded border" onClick={()=>setShowContact(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


