import React, { useMemo, useState } from "react"
import { Search, Mail, Phone, Building, MapPin, Clock, Eye, Edit, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react"

const mockStaff = [
  { id: "1", employeeId: "SAL001", firstName: "John", lastName: "Smith", email: "john@acme.com", phone: "+1 555 000 111", department: "Sales", role: "Sales-man", status: "Active", address: "123 Market St, NY, USA", lastLogin: "Today 10:12" },
  { id: "2", employeeId: "SAL002", firstName: "Sarah", lastName: "Johnson", email: "sarah@acme.com", phone: "+1 555 000 222", department: "Sales", role: "Sales-man", status: "Inactive", address: "456 Pine Rd, CA, USA", lastLogin: "Yesterday" },
  { id: "3", employeeId: "PKG001", firstName: "Mike", lastName: "Lee", email: "mike@acme.com", phone: "+1 555 000 333", department: "Operations", role: "Packager", status: "Active", address: "22 Third Ave, TX, USA", lastLogin: "2 days ago" }
]

export default function SalesPanel() {
  const [search, setSearch] = useState("")
  const filtered = useMemo(() => mockStaff.filter(m => {
    const q = search.toLowerCase()
    return (
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q)
    )
  }), [search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2>Staff Panel</h2>
          <p className="text-muted-foreground">Manage and monitor staff members</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full border rounded px-9 py-2" placeholder="Search staff by name, role, department..." value={search} onChange={(e)=>setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(member => (
          <div key={member.id} className="rounded-lg border hover:shadow-lg transition-shadow">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{member.firstName} {member.lastName}</div>
                  <div className="text-xs text-muted-foreground">{member.employeeId}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="h-8 w-8 p-0 rounded hover:bg-muted flex items-center justify-center"><Eye className="h-4 w-4" /></button>
                  <button className="h-8 w-8 p-0 rounded hover:bg-muted flex items-center justify-center"><Edit className="h-4 w-4" /></button>
                  <button className="h-8 w-8 p-0 rounded hover:bg-muted flex items-center justify-center"><MessageSquare className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-block px-2 py-1 rounded border text-xs">{member.role}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {member.status === 'Active' ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                  {member.status}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span className="truncate">{member.email}</span></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{member.phone}</span></div>
              <div className="flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground" /><span>{member.department}</span></div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="truncate">{member.address}</span></div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span>Last login: {member.lastLogin}</span></div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded border p-8 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No staff members found</p>
        </div>
      )}
    </div>
  )
}


