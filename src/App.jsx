import { useEffect, useState } from 'react'
import { ShoppingCart, Search, Menu } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Header({ cartCount }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 rounded hover:bg-black/5">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight">ANOMIE</h1>
            <p className="text-xs uppercase tracking-widest text-black/60">Standard Deviation</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-black/5 rounded-full px-3 py-2 w-96">
          <Search className="w-4 h-4 text-black/60" />
          <input placeholder="Search products" className="bg-transparent outline-none text-sm flex-1" />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded hover:bg-black/5">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full grid place-items-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

function ProductCard({ product, onAdd }) {
  return (
    <div className="group rounded-2xl border border-black/10 overflow-hidden bg-white hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gradient-to-br from-zinc-50 to-white grid place-items-center">
        {product.image ? (
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-6">
            <div className="text-4xl font-black">A</div>
            <div className="text-xs uppercase tracking-widest text-black/50">ANOMIE</div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{product.title}</h3>
        <p className="text-sm text-black/60 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold">${product.price?.toFixed(2)}</span>
          <button onClick={() => onAdd(product)} className="text-sm font-semibold bg-black text-white px-3 py-1.5 rounded-full hover:bg-black/90">
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-16 py-12 border-t border-black/10 text-center text-sm text-black/60">
      <p>© {new Date().getFullYear()} ANOMIE — Standard Deviation. All rights reserved.</p>
    </footer>
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/products`)
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
        } else {
          // Seed demo items when DB is empty (frontend only for preview)
          setProducts([
            { title: 'ANOMIE Logo Tee', description: 'Premium cotton tee with minimal ANOMIE mark.', price: 38, category: 'apparel', image: 'https://images.unsplash.com/photo-1750816204148-5d02aff367cb?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxBTk9NSUUlMjBMb2dvJTIwVGVlfGVufDB8MHx8fDE3NjI5NTU1NjZ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
            { title: 'Standard Deviation Hoodie', description: 'Heavyweight fleece in washed black.', price: 78, category: 'apparel', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop' },
            { title: 'Canvas Tote', description: 'Everyday carry with screenprinted lockup.', price: 24, category: 'accessories', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop' },
            { title: 'Cap — Black', description: '6-panel with tonal embroidery.', price: 32, category: 'accessories', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop' },
          ])
        }
      } catch (e) {
        // offline/demo fallback
        setProducts([
          { title: 'ANOMIE Logo Tee', description: 'Premium cotton tee with minimal ANOMIE mark.', price: 38, category: 'apparel', image: 'https://images.unsplash.com/photo-1750816204148-5d02aff367cb?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxBTk9NSUUlMjBMb2dvJTIwVGVlfGVufDB8MHx8fDE3NjI5NTU1NjZ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
          { title: 'Standard Deviation Hoodie', description: 'Heavyweight fleece in washed black.', price: 78, category: 'apparel', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop' },
          { title: 'Canvas Tote', description: 'Everyday carry with screenprinted lockup.', price: 24, category: 'accessories', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop' },
          { title: 'Cap — Black', description: '6-panel with tonal embroidery.', price: 32, category: 'accessories', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop' },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const addToCart = (p) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.title === p.title)
      if (existing) {
        return prev.map((i) => i.title === p.title ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...p, quantity: 1 }]
    })
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <Header cartCount={cart.length} />

      <section className="max-w-6xl mx-auto px-4 pt-10">
        <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-12 overflow-hidden relative">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">ANOMIE</h2>
            <p className="uppercase tracking-widest text-black/60 mt-1 text-sm">Standard Deviation</p>
            <p className="mt-6 text-black/70">Minimal essentials with a cerebral edge. Built for everyday deviation.</p>
            <a href="#shop" className="inline-block mt-6 bg-black text-white px-5 py-2.5 rounded-full font-semibold hover:bg-black/90">Shop now</a>
          </div>
        </div>
      </section>

      <section id="shop" className="max-w-6xl mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Featured</h3>
          <div className="text-sm text-black/60">Subtotal: ${subtotal.toFixed(2)}</div>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-black/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p, idx) => (
              <ProductCard key={idx} product={p} onAdd={addToCart} />)
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default App
