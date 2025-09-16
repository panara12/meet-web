import React, { useMemo, useState } from "react"
import { CreditCard, CheckCircle, XCircle, Clock, Search, ArrowUpDown } from "lucide-react"

const seed = [
  { id: "PR-001", salesmanName: "John Smith", salesmanEmail: "john@company.com", clientName: "Acme Corp", clientId: "CL-001", amount: 2500, currency: "USD", paymentMethod: "Bank Transfer", requestDate: "2024-09-11T09:15:00Z", status: "pending" },
  { id: "PR-002", salesmanName: "Sarah Johnson", salesmanEmail: "sarah@company.com", clientName: "Tech Solutions Inc", clientId: "CL-002", amount: 1850.75, currency: "USD", paymentMethod: "Credit Card", requestDate: "2024-09-11T11:30:00Z", status: "approved" }
]

export default function Payments() {
  const [rows, setRows] = useState(seed)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  const filtered = useMemo(() => rows
    .filter(r => (filterStatus === 'all' || r.status === filterStatus) && (
      r.salesmanName.toLowerCase().includes(search.toLowerCase()) ||
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
    ))
    .sort((a, b) => {
      let cmp = 0
      if (sortBy === 'date') cmp = new Date(a.requestDate) - new Date(b.requestDate)
      if (sortBy === 'amount') cmp = a.amount - b.amount
      if (sortBy === 'status') cmp = a.status.localeCompare(b.status)
      return sortOrder === 'asc' ? cmp : -cmp
    })
  , [rows, search, filterStatus, sortBy, sortOrder])

  const pendingCount = rows.filter(r => r.status === 'pending').length
  const approvedCount = rows.filter(r => r.status === 'approved').length
  const rejectedCount = rows.filter(r => r.status === 'rejected').length
  const pendingAmount = rows.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount, 0)

  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl">Payment Confirmations</h2>
          <p className="text-sm text-muted-foreground">Review and manage sales payment updates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4 flex items-center justify-between"><div><div className="text-xs text-muted-foreground">Pending</div><div className="text-2xl font-semibold">{pendingCount}</div></div><Clock className="h-6 w-6 text-amber-600"/></div>
        <div className="rounded-lg border p-4 flex items-center justify-between"><div><div className="text-xs text-muted-foreground">Approved</div><div className="text-2xl font-semibold">{approvedCount}</div></div><CheckCircle className="h-6 w-6 text-green-600"/></div>
        <div className="rounded-lg border p-4 flex items-center justify-between"><div><div className="text-xs text-muted-foreground">Rejected</div><div className="text-2xl font-semibold">{rejectedCount}</div></div><XCircle className="h-6 w-6 text-red-600"/></div>
        <div className="rounded-lg border p-4 flex items-center justify-between"><div><div className="text-xs text-muted-foreground">Pending Amount</div><div className="text-2xl font-semibold">{fmt(pendingAmount)}</div></div><CreditCard className="h-6 w-6 text-blue-600"/></div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input className="w-full border rounded px-9 py-2" placeholder="Search payments..." value={search} onChange={(e)=>setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <select className="border rounded px-3 py-2" value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select className="border rounded px-3 py-2" value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
            </select>
            <button className="h-9 px-3 rounded border inline-flex items-center gap-2" onClick={()=>setSortOrder(sortOrder==='asc'?'desc':'asc')} title={`Sort ${sortOrder==='asc'?'Descending':'Ascending'}`}>
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-3 py-2">Request</th>
                <th className="text-left px-3 py-2 hidden sm:table-cell">Salesman</th>
                <th className="text-left px-3 py-2">Client</th>
                <th className="text-left px-3 py-2">Amount</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">
                    <div className="text-sm font-medium">{r.id}</div>
                    <div className="text-xs text-muted-foreground">{r.paymentMethod}</div>
                  </td>
                  <td className="px-3 py-2 hidden sm:table-cell">
                    <div className="text-sm font-medium">{r.salesmanName}</div>
                    <div className="text-xs text-muted-foreground">{r.salesmanEmail}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm font-medium">{r.clientName}</div>
                    <div className="text-xs text-muted-foreground">{r.clientId}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-sm font-semibold">{fmt(r.amount)}</div>
                    <div className="text-xs text-muted-foreground">{r.currency}</div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${r.status==='pending'?'bg-amber-100 text-amber-700': r.status==='approved'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                      {r.status==='pending' && <Clock className="h-3 w-3"/>}
                      {r.status==='approved' && <CheckCircle className="h-3 w-3"/>}
                      {r.status==='rejected' && <XCircle className="h-3 w-3"/>}
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 hidden lg:table-cell">{new Date(r.requestDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


