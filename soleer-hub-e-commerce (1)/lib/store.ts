import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface User {
  id: string
  name: string
  email: string
  cpf?: string
  phone?: string
  avatar?: string
  isAdmin?: boolean
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  brand: string
  rating: number
  reviews: number
  stock: number
  featured?: boolean
  discount?: number
  specs?: Record<string, string>
  createdAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Address {
  id: string
  label: string
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  isDefault?: boolean
}

export interface Order {
  id: string
  userId: string
  userName: string
  userEmail: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'
  paymentMethod: 'pix' | 'boleto'
  address: Address
  createdAt: string
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  isAdmin: boolean
  message: string
  createdAt: string
  read: boolean
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantEmail: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

// Auth Store
interface AuthState {
  user: User | null
  users: User[]
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginAsAdmin: (email: string, password: string) => Promise<boolean>
  register: (data: { name: string; email: string; password: string; cpf: string; phone: string }) => Promise<boolean>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  getAllUsers: () => User[]
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isAuthenticated: false,
      isLoading: false,
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Check if user exists
        const existingUser = get().users.find(u => u.email === email)
        if (existingUser) {
          set({ user: existingUser, isAuthenticated: true, isLoading: false })
          return true
        }
        
        set({ isLoading: false })
        return false
      },
      loginAsAdmin: async (email: string, password: string) => {
        set({ isLoading: true })
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Admin credentials check
        if (email === 'admin@soleerhub.com' && password === 'admin123') {
          const adminUser: User = {
            id: 'admin-1',
            name: 'Administrador',
            email: 'admin@soleerhub.com',
            isAdmin: true,
            createdAt: new Date().toISOString(),
          }
          set({ user: adminUser, isAuthenticated: true, isLoading: false })
          return true
        }
        
        set({ isLoading: false })
        return false
      },
      register: async (data) => {
        set({ isLoading: true })
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: data.name,
          email: data.email,
          cpf: data.cpf,
          phone: data.phone,
          isAdmin: false,
          createdAt: new Date().toISOString(),
        }
        
        set((state) => ({ 
          users: [...state.users, newUser],
          user: newUser, 
          isAuthenticated: true, 
          isLoading: false 
        }))
        return true
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (data) => set((state) => {
        if (!state.user) return state
        const updatedUser = { ...state.user, ...data }
        const updatedUsers = state.users.map(u => 
          u.id === state.user?.id ? updatedUser : u
        )
        return { user: updatedUser, users: updatedUsers }
      }),
      getAllUsers: () => get().users,
    }),
    { name: 'soleer-auth' }
  )
)

// Products Store - Admin manages products
interface ProductsState {
  products: Product[]
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviews'>) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
  getAllProducts: () => Product[]
  getProductsByCategory: (category: string) => Product[]
  getFeaturedProducts: () => Product[]
  searchProducts: (query: string) => Product[]
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: `prod-${Date.now()}`,
          rating: 0,
          reviews: 0,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ products: [...state.products, newProduct] }))
      },
      updateProduct: (id, data) => {
        set((state) => ({
          products: state.products.map(p => 
            p.id === id ? { ...p, ...data } : p
          )
        }))
      },
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter(p => p.id !== id)
        }))
      },
      getProduct: (id) => get().products.find(p => p.id === id),
      getAllProducts: () => get().products,
      getProductsByCategory: (category) => 
        get().products.filter(p => p.category.toLowerCase() === category.toLowerCase()),
      getFeaturedProducts: () => get().products.filter(p => p.featured),
      searchProducts: (query) => {
        const lowercaseQuery = query.toLowerCase()
        return get().products.filter(p => 
          p.name.toLowerCase().includes(lowercaseQuery) ||
          p.description.toLowerCase().includes(lowercaseQuery) ||
          p.category.toLowerCase().includes(lowercaseQuery) ||
          p.brand.toLowerCase().includes(lowercaseQuery)
        )
      },
    }),
    { name: 'soleer-products' }
  )
)

// Cart Store
interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id)
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          return { items: [...state.items, { product, quantity }] }
        })
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId),
        }))
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }))
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0)
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    { name: 'soleer-cart' }
  )
)

// Wishlist Store
interface WishlistState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          if (state.items.some(item => item.id === product.id)) return state
          return { items: [...state.items, product] }
        })
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId),
        }))
      },
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId)
      },
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'soleer-wishlist' }
  )
)

// Address Store
interface AddressState {
  addresses: Address[]
  addAddress: (address: Omit<Address, 'id'>) => void
  updateAddress: (id: string, data: Partial<Address>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  getDefaultAddress: () => Address | undefined
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],
      addAddress: (address) => {
        const newAddress: Address = {
          ...address,
          id: `addr-${Date.now()}`,
        }
        set((state) => {
          const addresses = state.addresses.map(a => ({ ...a, isDefault: false }))
          return { addresses: [...addresses, { ...newAddress, isDefault: true }] }
        })
      },
      updateAddress: (id, data) => {
        set((state) => ({
          addresses: state.addresses.map(a => 
            a.id === id ? { ...a, ...data } : a
          )
        }))
      },
      deleteAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter(a => a.id !== id)
        }))
      },
      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map(a => ({
            ...a,
            isDefault: a.id === id
          }))
        }))
      },
      getDefaultAddress: () => get().addresses.find(a => a.isDefault),
    }),
    { name: 'soleer-addresses' }
  )
)

// Orders Store
interface OrdersState {
  orders: Order[]
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => string
  updateOrderStatus: (id: string, status: Order['status']) => void
  getUserOrders: (userId: string) => Order[]
  getAllOrders: () => Order[]
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      createOrder: (order) => {
        const orderId = `SH${Date.now().toString().slice(-8)}`
        const newOrder: Order = {
          ...order,
          id: orderId,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ orders: [...state.orders, newOrder] }))
        return orderId
      },
      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map(o => 
            o.id === id ? { ...o, status } : o
          )
        }))
      },
      getUserOrders: (userId) => get().orders.filter(o => o.userId === userId),
      getAllOrders: () => get().orders,
    }),
    { name: 'soleer-orders' }
  )
)

// Chat Store
interface ChatState {
  conversations: Conversation[]
  messages: ChatMessage[]
  sendMessage: (conversationId: string, senderId: string, senderName: string, isAdmin: boolean, message: string) => void
  getConversation: (participantId: string) => Conversation | undefined
  getOrCreateConversation: (participantId: string, participantName: string, participantEmail: string) => string
  getMessages: (conversationId: string) => ChatMessage[]
  markAsRead: (conversationId: string, isAdmin: boolean) => void
  getAllConversations: () => Conversation[]
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: [],
      sendMessage: (conversationId, senderId, senderName, isAdmin, message) => {
        const newMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId,
          senderName,
          isAdmin,
          message,
          createdAt: new Date().toISOString(),
          read: false,
        }
        
        set((state) => ({
          messages: [...state.messages, newMessage],
          conversations: state.conversations.map(c => 
            c.id === conversationId ? {
              ...c,
              lastMessage: message,
              lastMessageAt: newMessage.createdAt,
              unreadCount: isAdmin ? c.unreadCount : c.unreadCount + 1,
            } : c
          )
        }))
      },
      getConversation: (participantId) => 
        get().conversations.find(c => c.participantId === participantId),
      getOrCreateConversation: (participantId, participantName, participantEmail) => {
        const existing = get().conversations.find(c => c.participantId === participantId)
        if (existing) return existing.id
        
        const conversationId = `conv-${Date.now()}`
        const newConversation: Conversation = {
          id: conversationId,
          participantId,
          participantName,
          participantEmail,
          lastMessage: '',
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0,
        }
        
        set((state) => ({
          conversations: [...state.conversations, newConversation]
        }))
        
        return conversationId
      },
      getMessages: (conversationId) => 
        get().messages.filter(m => m.conversationId === conversationId),
      markAsRead: (conversationId, isAdmin) => {
        set((state) => ({
          messages: state.messages.map(m => 
            m.conversationId === conversationId && m.isAdmin !== isAdmin
              ? { ...m, read: true }
              : m
          ),
          conversations: state.conversations.map(c =>
            c.id === conversationId
              ? { ...c, unreadCount: 0 }
              : c
          )
        }))
      },
      getAllConversations: () => get().conversations,
    }),
    { name: 'soleer-chat' }
  )
)
