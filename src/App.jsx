import { useEffect, useMemo, useState } from 'react'
import { ShoppingBag, Search, Menu, X, Minus, Plus, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Header({ cartCount, onOpenCart, onOpenMenu, onSearchToggle }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-4 rounded-full border border-black/10 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
          <div className="flex items-center justify-between px-4 py-3">
            <button aria-label="Open menu" onClick={onOpenMenu} className="p-2 rounded-full hover:bg-black/5">
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-center select-none">
              <div className="text-2xl font-black tracking-tight leading-none">ANOMIE</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-black/60">Standard Deviation</div>
            </div>
            <div className="flex items-center gap-2">
              <button aria-label="Search" onClick={onSearchToggle} className="p-2 rounded-full hover:bg-black/5">
                <Search className="w-5 h-5" />
              </button>
              <button aria-label="Open cart" onClick={onOpenCart} className="relative p-2 rounded-full hover:bg-black/5">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] w-4 h-4 rounded-full grid place-items-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function MenuOverlay({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
          <motion.div onClick={onClose} className="absolute inset-0 bg-black/50" />
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 24 }} className="relative mx-auto mt-24 w-[92%] max-w-3xl rounded-3xl border border-black/10 bg-white p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold tracking-tight">Explore</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5" aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: 'New Arrivals', href: '#' },
                { label: 'Apparel', href: '#category-apparel' },
                { label: 'Accessories', href: '#category-accessories' },
                { label: 'Objects', href: '#category-objects' },
                { label: 'Lookbook', href: '#lookbook' },
                { label: 'About', href: '#about' },
              ].map((i) => (
                <a key={i.label} href={i.href} onClick={onClose} className="group flex items-center justify-between rounded-2xl border border-black/10 p-4 hover:bg-black/5">
                  <span className="text-lg font-medium">{i.label}</span>
                  <ChevronRight className="w-5 h-5 text-black/60 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CartDrawer({ open, onClose, cart, setCart }) {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const modifyQty = (idx, delta) => {
    setCart((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], quantity: Math.max(1, next[idx].quantity + delta) }
      return next
    })
  }
  const removeItem = (idx) => setCart((prev) => prev.filter((_, i) => i !== idx))

  return (
    <AnimatePresence>
      {open && (
        <motion.aside initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: 'spring', stiffness: 260, damping: 30 }} className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-black/10 p-4">
            <h3 className="text-lg font-semibold">Your cart</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5" aria-label="Close cart"><X className="w-5 h-5" /></button>
          </div>
          <div className="h-[calc(100%-152px)] overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center text-black/60 mt-12">Your cart is empty.</div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 border border-black/10 rounded-2xl p-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/5">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-xs text-black/60">ANOMIE</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium truncate">{item.title}</div>
                        <div className="text-sm text-black/60">${item.price.toFixed(2)}</div>
                      </div>
                      <button onClick={() => removeItem(idx)} className="p-1.5 rounded-full hover:bg-black/5" aria-label="Remove"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-black/10 px-2 py-1">
                      <button onClick={() => modifyQty(idx, -1)} className="p-1 rounded-full hover:bg-black/5" aria-label="Decrease"><Minus className="w-4 h-4" /></button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => modifyQty(idx, 1)} className="p-1 rounded-full hover:bg-black/5" aria-label="Increase"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-black/10 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-black/60">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <button disabled={cart.length === 0} className="mt-3 w-full rounded-full bg-black px-4 py-3 text-white font-semibold disabled:opacity-50">Checkout</button>
            <p className="mt-2 text-xs text-black/60">Taxes and shipping calculated at checkout.</p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function ProductCard({ product, onAdd }) {
  return (
    <motion.div layout className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white">
      <div className="relative aspect-[3/4] overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-zinc-50">
            <div className="text-4xl font-black">A</div>
            <div className="text-xs uppercase tracking-widest text-black/50">ANOMIE</div>
          </div>
        )}
        <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => onAdd(product)} className="absolute bottom-3 left-3 right-3 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white">
          Add to cart
        </motion.button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium truncate">{product.title}</h3>
          <span className="font-semibold">${product.price?.toFixed(2)}</span>
        </div>
        {product.description && <p className="mt-1 line-clamp-2 text-sm text-black/60">{product.description}</p>}
      </div>
    </motion.div>
  )
}

function Hero() {
  return (
    <section className="relative pt-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white">
          <div className="relative h-[58vh] min-h-[420px] w-full overflow-hidden rounded-[32px]">
            <div className="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2400&auto=format&fit=crop" alt="Editorial" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
            </div>
            <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-12">
              <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="text-4xl md:text-7xl font-black tracking-tight">ANOMIE</motion.h2>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="uppercase tracking-[0.35em] text-[11px] text-black/70">Standard Deviation</motion.p>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="mt-6 flex items-center gap-3">
                <a href="#shop" className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/90">Shop Now</a>
                <a href="#lookbook" className="rounded-full border border-black px-5 py-2.5 text-sm font-semibold hover:bg-black text-black hover:text-white">Lookbook</a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 overflow-hidden">
        <motion.div initial={{ x: 0 }} animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 20, ease: 'linear' }} className="whitespace-nowrap border-y border-black/10 py-3 text-sm text-black/70">
          <span className="mx-6">ANOMIE — Standard Deviation — Essentials engineered for everyday deviation</span>
          <span className="mx-6">ANOMIE — Standard Deviation — Essentials engineered for everyday deviation</span>
          <span className="mx-6">ANOMIE — Standard Deviation — Essentials engineered for everyday deviation</span>
          <span className="mx-6">ANOMIE — Standard Deviation — Essentials engineered for everyday deviation</span>
        </motion.div>
      </div>
    </section>
  )
}

function Filters({ categories, active, setActive, query, setQuery }) {
  return (
    <div className="mx-auto max-w-7xl px-4 mt-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActive('all')} className={`rounded-full px-4 py-2 text-sm border ${active==='all' ? 'bg-black text-white border-black' : 'border-black/10 hover:bg-black/5'}`}>All</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setActive(c)} className={`rounded-full px-4 py-2 text-sm border capitalize ${active===c ? 'bg-black text-white border-black' : 'border-black/10 hover:bg-black/5'}`}>{c}</button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60" />
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search products" className="w-72 rounded-full border border-black/10 bg-white px-9 py-2 text-sm outline-none placeholder:text-black/50 focus:ring-2 focus:ring-black/10" />
        </div>
      </div>
    </div>
  )
}

function LookbookSection() {
  return (
    <section id="lookbook" className="mx-auto max-w-7xl px-4 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div whileHover={{ y: -4 }} className="overflow-hidden rounded-3xl border border-black/10 bg-white">
          <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop" alt="Look 1" className="h-[28rem] w-full object-cover" />
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="overflow-hidden rounded-3xl border border-black/10 bg-white">
          <img src="https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1600&auto=format&fit=crop" alt="Look 2" className="h-[28rem] w-full object-cover" />
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-black/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} ANOMIE — Standard Deviation</div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-black">Terms</a>
          <a href="#" className="hover:text-black">Privacy</a>
          <a href="#" className="hover:text-black">Contact</a>
        </div>
      </div>
    </footer>
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/products`)
        if (!res.ok) throw new Error('Failed to load products')
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
        } else {
          setProducts([
            { title: 'ANOMIE Logo Tee', description: 'Premium cotton tee with minimal ANOMIE mark.', price: 38, category: 'apparel', image: 'https://images.unsplash.com/photo-1750816204148-5d02aff367cb?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxBTk9NSUUlMjBMb2dvJTIwVGVlfGVufDB8MHx8fDE3NjI5NTU1NjZ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
            { title: 'Standard Deviation Hoodie', description: 'Heavyweight fleece in washed black.', price: 78, category: 'apparel', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop' },
            { title: 'Canvas Tote', description: 'Everyday carry with screenprinted lockup.', price: 24, category: 'accessories', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1600&auto=format&fit=crop' },
            { title: 'Cap — Black', description: '6-panel with tonal embroidery.', price: 32, category: 'accessories', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop' },
          ])
        }
      } catch (e) {
        setProducts([
          { title: 'ANOMIE Logo Tee', description: 'Premium cotton tee with minimal ANOMIE mark.', price: 38, category: 'apparel', image: 'https://images.unsplash.com/photo-1750816204148-5d02aff367cb?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxBTk9NSUUlMjBMb2dvJTIwVGVlfGVufDB8MHx8fDE3NjI5NTU1NjZ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
          { title: 'Standard Deviation Hoodie', description: 'Heavyweight fleece in washed black.', price: 78, category: 'apparel', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop' },
          { title: 'Canvas Tote', description: 'Everyday carry with screenprinted lockup.', price: 24, category: 'accessories', image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1600&auto=format&fit=crop' },
          { title: 'Cap — Black', description: '6-panel with tonal embroidery.', price: 32, category: 'accessories', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop' },
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
        return prev.map((i) => (i.title === p.title ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...p, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean))
    return Array.from(set)
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = category === 'all' || p.category === category
      const matchQuery = !query || `${p.title} ${p.description || ''}`.toLowerCase().includes(query.toLowerCase())
      return matchCategory && matchQuery
    })
  }, [products, category, query])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <Header cartCount={cart.reduce((n,i)=>n+i.quantity,0)} onOpenCart={() => setCartOpen(true)} onOpenMenu={() => setMenuOpen(true)} onSearchToggle={() => setShowSearch((s)=>!s)} />

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} />

      <main>
        <Hero />

        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mx-auto max-w-7xl px-4 mt-6">
              <div className="rounded-3xl border border-black/10 bg-white p-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/60" />
                  <input value={query} onChange={(e)=>setQuery(e.target.value)} autoFocus placeholder="Search products, e.g. hoodie" className="w-full rounded-2xl border border-black/10 bg-white px-10 py-3 text-sm outline-none placeholder:text-black/50 focus:ring-2 focus:ring-black/10" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Filters categories={categories} active={category} setActive={setCategory} query={query} setQuery={setQuery} />

        <section id="shop" className="mx-auto max-w-7xl px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold">Featured</h3>
            <div className="text-sm text-black/60">{filtered.length} items</div>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 rounded-3xl bg-black/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p, idx) => (
                <ProductCard key={idx} product={p} onAdd={addToCart} />
              ))}
            </motion.div>
          )}
        </section>

        <LookbookSection />
      </main>

      <Footer />
    </div>
  )
}

export default App
