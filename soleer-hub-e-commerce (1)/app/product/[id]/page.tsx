'use client'

import { useState, use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ChevronLeft, Heart, Share2, ShoppingCart, Star, Check, 
  Truck, Shield, RotateCcw, Minus, Plus, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { CartDrawer } from '@/components/cart-drawer'
import { ProductCard } from '@/components/product-card'
import { formatPrice } from '@/lib/data'
import { useCartStore, useWishlistStore, useProductsStore } from '@/lib/store'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const { getProduct, getAllProducts } = useProductsStore()
  const product = getProduct(id)
  const allProducts = getAllProducts()
  
  const { addItem } = useCartStore()
  const wishlist = useWishlistStore()
  const isInWishlist = product ? wishlist.isInWishlist(product.id) : false

  const relatedProducts = allProducts.filter(p => p.category === product?.category && p.id !== id).slice(0, 4)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto nao encontrado</h1>
          <Link href="/">
            <Button className="gradient-primary">Voltar para Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = product.images || [product.image, product.image, product.image]

  const handleAddToCart = () => {
    addItem(product, quantity)
    setIsCartOpen(true)
  }

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      wishlist.removeItem(product.id)
    } else {
      wishlist.addItem(product)
    }
  }

  return (
    <>
      <Header onCartOpen={() => setIsCartOpen(true)} onSearch={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-primary transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/50">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-lg">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span className="px-2 py-1 bg-secondary rounded">{product.brand}</span>
                <span>|</span>
                <span>{product.category}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews.toLocaleString()} avaliacoes)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {product.originalPrice && (
                <p className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
                {product.discount && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded">
                    -{product.discount}%
                  </span>
                )}
              </div>
              <p className="text-green-500 text-sm font-medium">
                <span className="font-bold">{formatPrice(product.price * 0.9)}</span> a vista no PIX (10% off)
              </p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Specs */}
            {product.specs && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-xl">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-muted-foreground">{key}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 bg-secondary rounded-xl px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                className="flex-1 h-14 gradient-primary text-lg font-semibold glow-primary-sm"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={`h-14 w-14 ${isInWishlist ? 'border-primary text-primary' : ''}`}
                onClick={handleToggleWishlist}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
              </Button>

              <Button variant="outline" size="icon" className="h-14 w-14">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              {product.stock > 0 ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 font-medium">Em estoque</span>
                  {product.stock <= 10 && (
                    <span className="text-yellow-500">- Apenas {product.stock} unidades!</span>
                  )}
                </>
              ) : (
                <span className="text-destructive">Produto indisponivel</span>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/30">
                <Truck className="w-6 h-6 text-primary mb-2" />
                <p className="text-xs font-medium">Entrega Expressa</p>
                <p className="text-xs text-muted-foreground">em ate 24h</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/30">
                <Shield className="w-6 h-6 text-primary mb-2" />
                <p className="text-xs font-medium">Garantia</p>
                <p className="text-xs text-muted-foreground">12 meses</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/30">
                <RotateCcw className="w-6 h-6 text-primary mb-2" />
                <p className="text-xs font-medium">Devolucao</p>
                <p className="text-xs text-muted-foreground">7 dias gratis</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Produtos Relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
