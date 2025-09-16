import React, { useMemo, useState } from "react"
import { Package, DollarSign, AlertTriangle, TrendingDown, BarChart3, Search, Grid3X3, List, Eye, Edit, Trash2, Plus, Building2, Tag } from "lucide-react"

const sampleCompanies = [
  { id: "C1", name: "Acme Corp" },
  { id: "C2", name: "Tech Solutions" }
]
const categories = ["Electronics", "Apparel", "Home"]
const seed = [
  { id: "P1", sku: "ACM-1001", name: "Wireless Mouse", price: 24.99, stockQuantity: 120, lowStockThreshold: 10, status: "active", category: "Electronics", companyId: "C1", companyName: "Acme Corp", description: "Ergonomic 2.4G mouse", tags: [] },
  { id: "P2", sku: "TEC-9001", name: "USB-C Cable", price: 7.5, stockQuantity: 8, lowStockThreshold: 15, status: "active", category: "Electronics", companyId: "C2", companyName: "Tech Solutions", description: "1m fast charge", tags: [] },
  { id: "P3", sku: "ACM-2001", name: "Cotton T-Shirt", price: 12.0, stockQuantity: 0, lowStockThreshold: 5, status: "inactive", category: "Apparel", companyId: "C1", companyName: "Acme Corp", description: "Unisex" , tags: []}
]

export default function Inventory() {
  const [products, setProducts] = useState(seed)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [company, setCompany] = useState("all")
  const [status, setStatus] = useState("all")
  const [view, setView] = useState("table")
  const [sortField, setSortField] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  const stats = useMemo(() => {
    const totalProducts = products.length
    const totalValue = products.reduce((s, p) => s + p.price * p.stockQuantity, 0)
    const lowStock = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold).length
    const outOfStock = products.filter(p => p.stockQuantity === 0).length
    return { totalProducts, totalValue, lowStock, outOfStock, categories: new Set(products.map(p => p.category)).size }
  }, [products])

  const filtered = useMemo(() => {
    let list = products
    const q = search.toLowerCase()
    if (q) list = list.filter(p => (p.name + p.sku + (p.description||"")).toLowerCase().includes(q))
    if (category !== "all") list = list.filter(p => p.category === category)
    if (company !== "all") list = list.filter(p => p.companyId === company)
    if (status !== "all") list = list.filter(p => p.status === status)
    const sorted = [...list].sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      if (sortField === "price") { aVal = a.price; bVal = b.price }
      if (sortField === "stockQuantity") { aVal = a.stockQuantity; bVal = b.stockQuantity }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })
    return sorted
  }, [products, search, category, company, status, sortField, sortOrder])

  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
  const stockStatus = (p) => p.stockQuantity === 0 ? { label: "Out of Stock", cls: "bg-red-100 text-red-700" } : (p.stockQuantity <= p.lowStockThreshold ? { label: "Low Stock", cls: "bg-amber-100 text-amber-700" } : { label: "In Stock", cls: "bg-green-100 text-green-700" })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Inventory Management</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <button className="btn bg-primary text-primary-foreground px-3 py-2 rounded inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Products</div>
          <div className="text-2xl font-semibold">{stats.totalProducts}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total Value</div>
          <div className="text-2xl font-semibold">{fmt(stats.totalValue)}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Low Stock</div>
          <div className="text-2xl font-semibold text-amber-600">{stats.lowStock}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Out of Stock</div>
          <div className="text-2xl font-semibold text-red-600">{stats.outOfStock}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Categories</div>
          <div className="text-2xl font-semibold">{stats.categories}</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input className="w-full border rounded px-9 py-2" placeholder="Search products by name, SKU, description..." value={search} onChange={(e)=>setSearch(e.target.value)} />
        </div>
        <select className="border rounded px-3 py-2" value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="border rounded px-3 py-2" value={company} onChange={(e)=>setCompany(e.target.value)}>
          <option value="all">All Companies</option>
          {sampleCompanies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="border rounded px-3 py-2" value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="discontinued">Discontinued</option>
        </select>
        <div className="flex bg-muted rounded-md p-1">
          <button className={`px-2 py-1 rounded ${view==='table' ? 'bg-background shadow' : ''}`} onClick={()=>setView('table')}><List className="h-4 w-4" /></button>
          <button className={`px-2 py-1 rounded ${view==='grid' ? 'bg-background shadow' : ''}`} onClick={()=>setView('grid')}><Grid3X3 className="h-4 w-4" /></button>
        </div>
      </div>

      {view === 'table' ? (
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-3 py-2 cursor-pointer" onClick={()=>{ setSortField('name'); setSortOrder(sortOrder==='asc'?'desc':'asc') }}>Product</th>
                <th className="text-left px-3 py-2">Company</th>
                <th className="text-left px-3 py-2">Category</th>
                <th className="text-left px-3 py-2 cursor-pointer" onClick={()=>{ setSortField('price'); setSortOrder(sortOrder==='asc'?'desc':'asc') }}>Price</th>
                <th className="text-left px-3 py-2 cursor-pointer" onClick={()=>{ setSortField('stockQuantity'); setSortOrder(sortOrder==='asc'?'desc':'asc') }}>Stock</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const s = stockStatus(p)
                return (
                  <tr key={p.id} className="border-t">
                    <td className="px-3 py-2">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.sku}</div>
                    </td>
                    <td className="px-3 py-2"><div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" />{p.companyName}</div></td>
                    <td className="px-3 py-2"><span className="inline-block px-2 py-1 rounded border text-xs">{p.category}</span></td>
                    <td className="px-3 py-2">{fmt(p.price)}</td>
                    <td className="px-3 py-2"><span className={`inline-block px-2 py-1 rounded text-xs ${s.cls}`}>{p.stockQuantity} units</span></td>
                    <td className="px-3 py-2"><span className={`inline-block px-2 py-1 rounded border text-xs ${p.status==='active'?'':'opacity-60'}`}>{p.status}</span></td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button className="h-8 w-8 p-0 rounded hover:bg-muted flex items-center justify-center"><Eye className="h-4 w-4" /></button>
                        <button className="h-8 w-8 p-0 rounded hover:bg-muted flex items-center justify-center"><Edit className="h-4 w-4" /></button>
                        <button className="h-8 w-8 p-0 rounded hover:bg-muted flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(p => {
            const s = stockStatus(p)
            return (
              <div key={p.id} className="rounded-lg border hover:shadow-lg transition-shadow">
                <div className="p-4 border-b">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.sku}</div>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded border text-xs ${p.status==='active'?'':'opacity-60'}`}>{p.status}</span>
                  </div>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Building2 className="h-4 w-4" /><span className="truncate">{p.companyName}</span></div>
                  <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-muted-foreground" /><span className="inline-block px-2 py-1 rounded border text-xs">{p.category}</span></div>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">{fmt(p.price)}</div>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${s.cls}`}>{p.stockQuantity} units</span>
                  </div>
                  {p.description && <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>}
                  <div className="flex gap-1">
                    <button className="flex-1 border rounded px-2 py-1 text-sm">View</button>
                    <button className="border rounded px-2 py-1 text-sm">Edit</button>
                    <button className="border rounded px-2 py-1 text-sm">Delete</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="p-8 rounded border text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  )
}


