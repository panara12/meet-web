import React, { useMemo, useState } from "react"
import { Building2, Search, Mail, Phone, Globe, Package, Calendar, MoreVertical } from "lucide-react"

const seed = [
  { id: "C1", name: "Acme Corp", industry: "Technology", email: "info@acme.com", phone: "+1 555 123 4567", website: "https://acme.com", productsCount: 34, status: "active", establishedDate: "2014-03-10", gstNumber: "22AAAAA0000A1Z5", panNumber: "ABCDE1234F" },
  { id: "C2", name: "Tech Solutions", industry: "Software Development", email: "hello@techsolutions.com", phone: "+1 555 222 3344", website: "https://techsolutions.com", productsCount: 18, status: "active", establishedDate: "2018-05-22" }
]

export default function Company() {
  const [companies, setCompanies] = useState(seed)
  const [search, setSearch] = useState("")
  const filtered = useMemo(() => companies.filter(c => {
    const q = search.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || (c.email||"").toLowerCase().includes(q)
  }), [companies, search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl lg:text-3xl">Company Management</h1>
          <p className="text-muted-foreground">Manage companies and their product associations</p>
        </div>
        <button className="btn bg-primary text-primary-foreground px-3 py-2 rounded inline-flex items-center gap-2">
          Add Company
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input className="w-full border rounded px-9 py-2" placeholder="Search companies..." value={search} onChange={(e)=>setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map(company => (
          <div key={company.id} className="rounded-lg border hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
            <div className="p-4 border-b">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-base lg:text-lg truncate font-semibold">{company.name}</div>
                    <div className="mt-1 text-xs">
                      <span className={`inline-block px-2 py-1 rounded border ${company.status==='active'?'':'opacity-70'}`}>{company.status}</span>
                    </div>
                  </div>
                </div>
                <button className="h-8 w-8 p-0 rounded hover:bg-muted flex items-center justify-center"><MoreVertical className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Building2 className="h-4 w-4" /><span>{company.industry}</span></div>
              {company.email && <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /><span className="truncate">{company.email}</span></div>}
              {company.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /><span>{company.phone}</span></div>}
              {company.website && <div className="flex items-center gap-2 text-muted-foreground"><Globe className="h-4 w-4" /><span className="truncate">{company.website}</span></div>}
              <div className="flex items-center gap-2 text-muted-foreground"><Package className="h-4 w-4" /><span>{company.productsCount || 0} products</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /><span>Est. {new Date(company.establishedDate).getFullYear()}</span></div>
              {company.gstNumber && <div className="text-xs text-muted-foreground">GST: <span className="font-mono">{company.gstNumber}</span></div>}
              {company.panNumber && <div className="text-xs text-muted-foreground">PAN: <span className="font-mono">{company.panNumber}</span></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


