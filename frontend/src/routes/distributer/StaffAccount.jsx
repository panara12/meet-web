import React, { useMemo, useState } from "react"
import { Search, Filter, Mail, Phone, MapPin, Users, DollarSign, Eye, Edit, Trash2, Plus, BadgeCheck } from "lucide-react"

const roles = ["Admin", "Packager", "Biller", "Sales-man"]
const departments = ["Management", "Sales", "Finance", "Operations", "HR", "IT"]
const statuses = ["Active", "Inactive", "On Leave", "Terminated"]

const seed = [
  { id: "EMP-001", employeeId: "ADM001", firstName: "Ava", lastName: "Patel", email: "ava@company.com", phone: "+1 555 333 111", role: "Admin", department: "Management", status: "Active", salary: 90000, hireDate: "2023-06-10" },
  { id: "EMP-002", employeeId: "SAL001", firstName: "John", lastName: "Smith", email: "john@company.com", phone: "+1 555 333 222", role: "Sales-man", department: "Sales", status: "Active", salary: 48000, hireDate: "2023-09-03" },
  { id: "EMP-003", employeeId: "BIL001", firstName: "Maya", lastName: "Chen", email: "maya@company.com", phone: "+1 555 333 333", role: "Biller", department: "Finance", status: "On Leave", salary: 52000, hireDate: "2022-11-21" },
]

export default function StaffAccount() {
  const [rows, setRows] = useState(seed)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [deptFilter, setDeptFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("firstName")
  const [sortDirection, setSortDirection] = useState("asc")

  const handleSort = (field) => {
    if (field === sortField) setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDirection("asc") }
  }

  const filtered = useMemo(() => {
    return rows
      .filter(m => {
        const q = search.toLowerCase()
        const matches =
          m.firstName.toLowerCase().includes(q) ||
          m.lastName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.employeeId.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q)
        const matchesRole = roleFilter === "all" || m.role === roleFilter
        const matchesDept = deptFilter === "all" || m.department === deptFilter
        const matchesStatus = statusFilter === "all" || m.status === statusFilter
        return matches && matchesRole && matchesDept && matchesStatus
      })
      .sort((a, b) => {
        let aVal = a[sortField]
        let bVal = b[sortField]
        if (sortField === "hireDate") { aVal = new Date(aVal); bVal = new Date(bVal) }
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
        return 0
      })
  }, [rows, search, roleFilter, deptFilter, statusFilter, sortField, sortDirection])

  const totalStaff = rows.length
  const activeStaff = rows.filter(s => s.status === "Active").length
  const totalSalaryExpense = rows.filter(s => s.status === "Active").reduce((s, m) => s + m.salary, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2>Staff Account Management</h2>
          <p className="text-muted-foreground">Manage employee records, roles, and details</p>
        </div>
        <button className="btn bg-primary text-primary-foreground px-3 py-2 rounded inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Total Staff</div>
              <div className="text-2xl font-semibold">{totalStaff}</div>
            </div>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Active</div>
              <div className="text-2xl font-semibold">{activeStaff}</div>
            </div>
            <BadgeCheck className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Monthly Payroll</div>
              <div className="text-2xl font-semibold">${Math.round(totalSalaryExpense/12).toLocaleString()}</div>
            </div>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Retention</div>
          <div className="text-2xl font-semibold">{((activeStaff/Math.max(totalStaff,1))*100).toFixed(1)}%</div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input className="w-full border rounded px-9 py-2" placeholder="Search staff, roles, or departments..." value={search} onChange={(e)=>setSearch(e.target.value)} />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select className="border rounded px-3 py-2" value={roleFilter} onChange={(e)=>setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select className="border rounded px-3 py-2" value={deptFilter} onChange={(e)=>setDeptFilter(e.target.value)}>
              <option value="all">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="border rounded px-3 py-2" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-[900px] px-4 sm:px-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-3 py-2 cursor-pointer" onClick={()=>handleSort('firstName')}>
                  <div className="inline-flex items-center gap-2">Employee <Filter className="h-4 w-4" /></div>
                </th>
                <th className="text-left px-3 py-2">Contact</th>
                <th className="text-left px-3 py-2 cursor-pointer" onClick={()=>handleSort('role')}>
                  <div className="inline-flex items-center gap-2">Role & Dept <Filter className="h-4 w-4" /></div>
                </th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2 cursor-pointer" onClick={()=>handleSort('salary')}>
                  <div className="inline-flex items-center gap-2">Annual Salary <Filter className="h-4 w-4" /></div>
                </th>
                <th className="text-left px-3 py-2 cursor-pointer" onClick={()=>handleSort('hireDate')}>
                  <div className="inline-flex items-center gap-2">Hire Date <Filter className="h-4 w-4" /></div>
                </th>
                <th className="text-left px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(member => (
                <tr key={member.id} className="border-t">
                  <td className="px-3 py-2">
                    <div className="font-medium">{member.firstName} {member.lastName}</div>
                    <div className="text-xs text-muted-foreground">{member.employeeId}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" /><span>{member.email}</span></div>
                      <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" /><span>{member.phone}</span></div>
                      <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-muted-foreground" /><span className="truncate">{member.address || '—'}</span></div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-1 rounded border text-xs">{member.role}</span>
                      <div className="text-xs text-muted-foreground">{member.department}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${member.status==='Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{member.status}</span>
                  </td>
                  <td className="px-3 py-2">${member.salary.toLocaleString()}</td>
                  <td className="px-3 py-2">{member.hireDate}</td>
                  <td className="px-3 py-2">
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
    </div>
  )
}


