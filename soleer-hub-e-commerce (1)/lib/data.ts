import { Product } from './store'

// Remove all pre-created products - Admin will add products
export const products: Product[] = []

export const categories = [
  { id: 'smartphones', name: 'Smartphones', icon: 'smartphone', count: 0 },
  { id: 'notebooks', name: 'Notebooks', icon: 'laptop', count: 0 },
  { id: 'games', name: 'Games & Consoles', icon: 'gamepad-2', count: 0 },
  { id: 'hardware', name: 'Hardware', icon: 'cpu', count: 0 },
  { id: 'perifericos', name: 'Periféricos', icon: 'mouse', count: 0 },
  { id: 'monitores', name: 'Monitores', icon: 'monitor', count: 0 },
  { id: 'audio', name: 'Áudio', icon: 'headphones', count: 0 },
  { id: 'acessorios', name: 'Acessórios', icon: 'cable', count: 0 },
]

export const brands = [
  'Apple', 'Samsung', 'Sony', 'Microsoft', 'NVIDIA', 'AMD', 'Razer', 
  'Logitech', 'SteelSeries', 'HyperX', 'Corsair', 'ASUS', 'MSI'
]

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}
