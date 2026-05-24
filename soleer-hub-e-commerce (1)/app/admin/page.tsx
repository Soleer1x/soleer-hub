'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, Users, ShoppingCart, Settings,
  TrendingUp, TrendingDown, DollarSign, Eye, Plus, Search,
  Edit, Trash2, ChevronLeft, ChevronRight,
  Menu, X, LogOut, Bell, BarChart3, ArrowUpRight, Save,
  MessageCircle, Image as ImageIcon, Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/logo'
import { formatPrice, categories, brands } from '@/lib/data'
import { 
  useAuthStore, useProductsStore, useOrdersStore, 
  useChatStore, Product 
} from '@/lib/store'

type Tab = 'dashboard' | 'products' | 'orders' | 'users' | 'chat' | 'settings'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  
  const { user, logout, isAuthenticated, loginAsAdmin } = useAuthStore()

  const handleAdminLogin = async () => {
    setIsLoggingIn(true)
    setLoginError('')
    const success = await loginAsAdmin(loginForm.email, loginForm.password)
    if (!success) {
      setLoginError('Credenciais invalidas')
    }
    setIsLoggingIn(false)
  }

  // Show login form if not authenticated as admin
  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl border border-border p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Area Administrativa</h1>
              <p className="text-muted-foreground mt-2">
                Acesso restrito a administradores
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">E-mail</label>
                <Input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="admin@soleerhub.com"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Senha</label>
                <Input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="********"
                  className="h-12"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>

              {loginError && (
                <p className="text-sm text-destructive text-center">{loginError}</p>
              )}

              <Button
                className="w-full gradient-primary h-12"
                onClick={handleAdminLogin}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Entrando...' : 'Entrar como Admin'}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Credenciais de teste: admin@soleerhub.com / admin123
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <Link href="/">
                <Button variant="ghost">Voltar para a Loja</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  const menuItems = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as Tab, label: 'Produtos', icon: Package },
    { id: 'orders' as Tab, label: 'Pedidos', icon: ShoppingCart },
    { id: 'users' as Tab, label: 'Usuarios', icon: Users },
    { id: 'chat' as Tab, label: 'Chat', icon: MessageCircle },
    { id: 'settings' as Tab, label: 'Configuracoes', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <Logo size="md" />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm">
                Ver Loja
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && <DashboardContent />}
            {activeTab === 'products' && <ProductsContent />}
            {activeTab === 'orders' && <OrdersContent />}
            {activeTab === 'users' && <UsersContent />}
            {activeTab === 'chat' && <ChatContent />}
            {activeTab === 'settings' && <SettingsContent />}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

function DashboardContent() {
  const { getAllProducts } = useProductsStore()
  const { getAllOrders } = useOrdersStore()
  const { users } = useAuthStore()
  
  const products = getAllProducts()
  const orders = getAllOrders()

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0)

  const stats = [
    { label: 'Vendas Total', value: formatPrice(totalSales), change: '+12%', up: true, icon: DollarSign },
    { label: 'Pedidos', value: orders.length.toString(), change: '+8%', up: true, icon: ShoppingCart },
    { label: 'Produtos', value: products.length.toString(), change: '+5%', up: true, icon: Package },
    { label: 'Usuarios', value: users.length.toString(), change: '+15%', up: true, icon: Users },
  ]

  const recentOrders = orders.slice(-5).reverse()

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 lg:p-6 bg-card rounded-xl border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.up ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl lg:text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">Pedidos Recentes</h3>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Nenhum pedido ainda
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.userName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                      order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                      order.status === 'shipped' ? 'bg-purple-500/10 text-purple-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {order.status === 'completed' ? 'Concluido' :
                       order.status === 'processing' ? 'Processando' :
                       order.status === 'shipped' ? 'Enviado' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">Produtos Cadastrados</h3>
          </div>
          <div className="divide-y divide-border">
            {products.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Nenhum produto cadastrado
              </div>
            ) : (
              products.slice(0, 5).map((product, index) => (
                <div key={product.id} className="p-4 flex items-center gap-4">
                  <span className="text-lg font-bold text-muted-foreground w-6">
                    {index + 1}
                  </span>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <p className="font-bold text-primary">{formatPrice(product.price)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductsContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '',
    brand: '',
    stock: '',
    featured: false,
    discount: '',
  })

  const { getAllProducts, addProduct, updateProduct, deleteProduct } = useProductsStore()
  const products = getAllProducts()

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      category: '',
      brand: '',
      stock: '',
      featured: false,
      discount: '',
    })
    setEditingProduct(null)
    setShowForm(false)
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      image: product.image,
      category: product.category,
      brand: product.brand,
      stock: product.stock.toString(),
      featured: product.featured || false,
      discount: product.discount?.toString() || '',
    })
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleSubmit = () => {
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      image: formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      category: formData.category,
      brand: formData.brand,
      stock: parseInt(formData.stock),
      featured: formData.featured,
      discount: formData.discount ? parseInt(formData.discount) : undefined,
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, productData)
    } else {
      addProduct(productData)
    }
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gradient-primary" onClick={() => setShowForm(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Produto
        </Button>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border p-6"
            >
              <h2 className="text-xl font-bold mb-6">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Nome do Produto</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: iPhone 15 Pro Max"
                    className="h-12"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Descricao</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descricao detalhada do produto..."
                    className="w-full h-24 px-4 py-3 rounded-lg bg-secondary border border-border resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preco (R$)</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="999.90"
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preco Original (R$)</label>
                  <Input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="1299.90"
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-12 px-4 rounded-lg bg-secondary border border-border"
                  >
                    <option value="">Selecione...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Marca</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full h-12 px-4 rounded-lg bg-secondary border border-border"
                  >
                    <option value="">Selecione...</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Estoque</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="100"
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Desconto (%)</label>
                  <Input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="10"
                    className="h-12"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">URL da Imagem</label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="h-12"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 rounded accent-primary"
                    />
                    <span>Produto em Destaque</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  Cancelar
                </Button>
                <Button className="gradient-primary flex-1" onClick={handleSubmit}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingProduct ? 'Salvar Alteracoes' : 'Criar Produto'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">Nenhum produto cadastrado</h3>
            <p className="text-muted-foreground mb-4">Adicione seu primeiro produto para comecar a vender</p>
            <Button className="gradient-primary" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 font-medium">Produto</th>
                  <th className="text-left p-4 font-medium">Categoria</th>
                  <th className="text-left p-4 font-medium">Preco</th>
                  <th className="text-left p-4 font-medium">Estoque</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{product.category}</td>
                    <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                    <td className="p-4">
                      <span className={`${product.stock <= 10 ? 'text-yellow-500' : 'text-foreground'}`}>
                        {product.stock} un.
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {product.stock > 0 ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function OrdersContent() {
  const { getAllOrders, updateOrderStatus } = useOrdersStore()
  const orders = getAllOrders()
  const [filter, setFilter] = useState<string>('all')

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-primary/10 text-primary border-primary' : ''}
        >
          Todos ({statusCounts.all})
        </Button>
        <Button 
          variant={filter === 'pending' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pendentes ({statusCounts.pending})
        </Button>
        <Button 
          variant={filter === 'processing' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setFilter('processing')}
        >
          Processando ({statusCounts.processing})
        </Button>
        <Button 
          variant={filter === 'shipped' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setFilter('shipped')}
        >
          Enviados ({statusCounts.shipped})
        </Button>
        <Button 
          variant={filter === 'completed' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Concluidos ({statusCounts.completed})
        </Button>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground">Os pedidos aparecerao aqui quando forem realizados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 font-medium">Pedido</th>
                  <th className="text-left p-4 font-medium">Cliente</th>
                  <th className="text-left p-4 font-medium">Data</th>
                  <th className="text-left p-4 font-medium">Itens</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-4 font-mono font-medium">#{order.id}</td>
                    <td className="p-4">
                      <p className="font-medium">{order.userName}</p>
                      <p className="text-sm text-muted-foreground">{order.userEmail}</p>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">{order.items.length} itens</td>
                    <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className={`px-2 py-1 rounded-lg text-sm font-medium border-0 cursor-pointer ${
                          order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                          order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                          order.status === 'shipped' ? 'bg-purple-500/10 text-purple-500' :
                          order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                          'bg-yellow-500/10 text-yellow-500'
                        }`}
                      >
                        <option value="pending">Pendente</option>
                        <option value="processing">Processando</option>
                        <option value="shipped">Enviado</option>
                        <option value="completed">Concluido</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm">Ver detalhes</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function UsersContent() {
  const { users } = useAuthStore()
  const { getUserOrders } = useOrdersStore()

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-card rounded-xl border border-border">
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-sm text-muted-foreground">Total de Usuarios</p>
        </div>
        <div className="p-4 bg-card rounded-xl border border-border">
          <p className="text-2xl font-bold">{users.filter(u => getUserOrders(u.id).length > 0).length}</p>
          <p className="text-sm text-muted-foreground">Clientes Ativos</p>
        </div>
        <div className="p-4 bg-card rounded-xl border border-border">
          <p className="text-2xl font-bold">{users.filter(u => {
            const date = new Date(u.createdAt)
            const now = new Date()
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
          }).length}</p>
          <p className="text-sm text-muted-foreground">Novos este mes</p>
        </div>
        <div className="p-4 bg-card rounded-xl border border-border">
          <p className="text-2xl font-bold">
            {users.length > 0 
              ? formatPrice(users.reduce((sum, u) => sum + getUserOrders(u.id).reduce((s, o) => s + o.total, 0), 0) / Math.max(users.length, 1))
              : 'R$ 0'}
          </p>
          <p className="text-sm text-muted-foreground">Ticket Medio</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">Nenhum usuario cadastrado</h3>
            <p className="text-muted-foreground">Os usuarios aparecerao aqui quando se cadastrarem</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 font-medium">Usuario</th>
                  <th className="text-left p-4 font-medium">Cadastro</th>
                  <th className="text-left p-4 font-medium">Pedidos</th>
                  <th className="text-left p-4 font-medium">Total Gasto</th>
                  <th className="text-right p-4 font-medium">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => {
                  const userOrders = getUserOrders(user.id)
                  const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0)
                  
                  return (
                    <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-bold">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4">{userOrders.length} pedidos</td>
                      <td className="p-4 font-medium">{formatPrice(totalSpent)}</td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm">Ver detalhes</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function ChatContent() {
  const { getAllConversations, getMessages, sendMessage, markAsRead } = useChatStore()
  const conversations = getAllConversations()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')

  const messages = selectedConversation ? getMessages(selectedConversation) : []
  const selectedConv = conversations.find(c => c.id === selectedConversation)

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return
    sendMessage(selectedConversation, 'admin-1', 'Administrador', true, newMessage)
    setNewMessage('')
  }

  useEffect(() => {
    if (selectedConversation) {
      markAsRead(selectedConversation, true)
    }
  }, [selectedConversation, markAsRead])

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden h-[calc(100vh-12rem)]">
      <div className="grid md:grid-cols-3 h-full">
        {/* Conversations List */}
        <div className="border-r border-border overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Conversas</h3>
          </div>
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma conversa ainda</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full p-4 text-left hover:bg-secondary/50 transition-colors ${
                    selectedConversation === conv.id ? 'bg-secondary/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">{conv.participantName.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conv.participantName}</p>
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage || 'Nova conversa'}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <p className="font-semibold">{selectedConv?.participantName}</p>
                <p className="text-sm text-muted-foreground">{selectedConv?.participantEmail}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.isAdmin
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.isAdmin ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="h-12"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button className="gradient-primary h-12 px-6" onClick={handleSendMessage}>
                    Enviar
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Selecione uma conversa</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SettingsContent() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">Informacoes da Loja</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome da Loja</label>
            <Input defaultValue="Soleer Hub" className="h-12" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">E-mail de Contato</label>
            <Input defaultValue="contato@soleerhub.com" className="h-12" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Telefone</label>
            <Input defaultValue="(11) 99999-9999" className="h-12" />
          </div>
          <Button className="gradient-primary">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alteracoes
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">Configuracoes de Envio</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Frete Gratis a partir de</label>
            <Input defaultValue="R$ 299,00" className="h-12" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Valor do Frete Padrao</label>
            <Input defaultValue="R$ 29,90" className="h-12" />
          </div>
          <Button className="gradient-primary">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alteracoes
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">Metodos de Pagamento</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div>
              <p className="font-medium">PIX</p>
              <p className="text-sm text-muted-foreground">10% de desconto</p>
            </div>
            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-sm rounded">Ativo</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div>
              <p className="font-medium">Boleto Bancario</p>
              <p className="text-sm text-muted-foreground">Vencimento em 3 dias</p>
            </div>
            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-sm rounded">Ativo</span>
          </div>
        </div>
      </div>
    </div>
  )
}
