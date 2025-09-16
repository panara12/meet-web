import React, { useMemo, useState } from "react"
import { Search, Star, Mail, Phone, Building2, ArrowUpDown, Eye, Edit, Trash2, Plus, DollarSign } from "lucide-react"

const initialClients = [
  { id: "CLT-001", name: "Acme Corporation", email: "contact@acme.com", phone: "+1 (555) 123-4567", address: "123 Business St, NY 10001", status: "VIP", totalOrders: 45, totalSpent: 125000, lastOrder: "2024-01-15", joinDate: "2023-03-10", industry: "Technology", companySize: "Enterprise (1000+ employees)", priority: "High" },
  { id: "CLT-002", name: "Tech Solutions Inc", email: "info@techsolutions.com", phone: "+1 (555) 987-6543", address: "456 Tech Ave, CA 94102", status: "Active", totalOrders: 32, totalSpent: 89500, lastOrder: "2024-01-14", joinDate: "2023-05-22", industry: "Software Development", companySize: "Medium (100-500 employees)", priority: "High" },
  { id: "CLT-003", name: "Global Trade Co", email: "orders@globaltrade.com", phone: "+1 (555) 555-0123", address: "789 Commerce Blvd, TX 75201", status: "Inactive", totalOrders: 18, totalSpent: 42300, lastOrder: "2023-12-20", joinDate: "2023-08-15", industry: "Import/Export", companySize: "Large (500-1000 employees)", priority: "Medium" }
]

export default function ClientList() {
  const [clients, setClients] = useState(initialClients)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [priority, setPriority] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  const filtered = useMemo(() => {
    const filtered = clients.filter(c => {
      const q = search.toLowerCase()
      const matches =
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.industry || "").toLowerCase().includes(q)
      const matchesStatus = status === "all" || c.status === status
      const matchesPriority = priority === "all" || c.priority === priority
      return matches && matchesStatus && matchesPriority
    })
    const sorted = [...filtered].sort((a, b) => {
      let aVal = a[sortField] ?? ""
      let bVal = b[sortField] ?? ""
      if (sortField === "totalSpent" || sortField === "totalOrders") {
        aVal = Number(aVal)
        bVal = Number(bVal)
      }
      if (sortField === "lastOrder" || sortField === "joinDate") {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })
    return sorted
  }, [clients, search, status, priority, sortField, sortDirection])

  const totalRevenue = filtered.reduce((s, c) => s + c.totalSpent, 0)
  const totalOrders = filtered.reduce((s, c) => s + c.totalOrders, 0)

  const handleSort = (field) => {
    if (field === sortField) setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDirection("asc") }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2>Client Management</h2>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <button className="btn bg-primary text-primary-foreground px-3 py-2 rounded inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Clients</div>
              <div className="text-2xl font-semibold">{filtered.length}</div>
            </div>
            <Building2 className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="text-2xl font-semibold">${totalRevenue.toLocaleString()}</div>
            </div>
            <DollarSign className="hidden" />
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Orders</div>
              <div className="text-2xl font-semibold">{totalOrders}</div>
            </div>
            <Building2 className="hidden" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full border rounded px-9 py-2" placeholder="Search clients..." value={search} onChange={(e)=>setSearch(e.target.value)} />
        </div>
        <select className="border rounded px-3 py-2" value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="VIP">VIP</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </select>
        <select className="border rounded px-3 py-2" value={priority} onChange={(e)=>setPriority(e.target.value)}>
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left px-3 py-2 cursor-pointer" onClick={()=>handleSort('name')}>
                <div className="inline-flex items-center gap-2">Client <ArrowUpDown className="h-4 w-4" /></div>
              </th>
              <th className="text-left px-3 py-2">Contact & Industry</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Priority</th>
              <th className="text-left px-3 py-2 cursor-pointer" onClick={()=>handleSort('totalOrders')}>
                <div className="inline-flex items-center gap-2">Orders <ArrowUpDown className="h-4 w-4" /></div>
              </th>
              <th className="text-left px-3 py-2 cursor-pointer" onClick={()=>handleSort('totalSpent')}>
                <div className="inline-flex items-center gap-2">Revenue <ArrowUpDown className="h-4 w-4" /></div>
              </th>
              <th className="text-left px-3 py-2 cursor-pointer hidden md:table-cell" onClick={()=>handleSort('lastOrder')}>
                <div className="inline-flex items-center gap-2">Last Order <ArrowUpDown className="h-4 w-4" /></div>
              </th>
              <th className="text-left px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((client)=> (
              <tr key={client.id} className="border-t">
                <td className="px-3 py-2 align-top">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{client.name}</div>
                    {client.status === 'VIP' && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  </div>
                  <div className="text-xs text-muted-foreground">{client.id}</div>
                  {client.companySize && <div className="text-xs text-muted-foreground">{client.companySize}</div>}
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.industry && <div className="text-xs text-muted-foreground">{client.industry}</div>}
                  </div>
                </td>
                <td className="px-3 py-2 align-top">
                  <span className="inline-block px-2 py-1 rounded border text-xs">{client.status}</span>
                </td>
                <td className="px-3 py-2 align-top">
                  {client.priority && <span className="inline-block px-2 py-1 rounded border text-xs">{client.priority}</span>}
                </td>
                <td className="px-3 py-2 align-top">{client.totalOrders}</td>
                <td className="px-3 py-2 align-top">${client.totalSpent.toLocaleString()}</td>
                <td className="px-3 py-2 align-top hidden md:table-cell">{client.lastOrder}</td>
                <td className="px-3 py-2 align-top">
                  <div className="flex items-center gap-1">
                    <button className="h-8 w-8 p-0 rounded hover:bg-muted flex items-center justify-center"><Eye className="h-4 w-4" /></button>
                    <button className="h-8 w-8 p-0 rounded hover:bg-muted flex items-center justify-center"><Edit className="h-4 w-4" /></button>
                    <button className="h-8 w-8 p-0 rounded hover:bg-muted flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


