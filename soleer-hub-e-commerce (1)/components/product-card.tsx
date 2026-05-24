'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product, useCartStore, useWishlistStore } from '@/lib/store'
import { formatPrice } from '@/lib/data'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const { addItem } = useCartStore()
  const wishlist = useWishlistStore()
  const isInWishlist = wishlist.isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWishlist) {
      wishlist.removeItem(product.id)
    } else {
      wishlist.addItem(product)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/product/${product.id}`}>
        <div
          className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-secondary/50">
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton" />
            )}
            <img
              src={product.image}
              alt={product.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Discount Badge */}
            {product.discount && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-lg">
                -{product.discount}%
              </div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-4 gap-2"
            >
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="gradient-primary text-primary-foreground shadow-lg"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
              <Link href={`/product/${product.id}`}>
                <Button size="icon" variant="secondary" className="shadow-lg">
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                isInWishlist
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Category & Brand */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>{product.category}</span>
              <span className="font-medium">{product.brand}</span>
            </div>

            {/* Name */}
            <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviews.toLocaleString()})
              </span>
            </div>

            {/* Price */}
            <div className="mt-3">
              {product.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ou 12x de {formatPrice(product.price / 12)}
                </p>
              </div>
            </div>

            {/* Stock indicator */}
            {product.stock <= 10 && product.stock > 0 && (
              <p className="text-xs text-yellow-500 mt-2">
                Apenas {product.stock} em estoque!
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Skeleton for loading state
export function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 skeleton rounded w-1/3" />
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-4 skeleton rounded w-2/3" />
        <div className="h-3 skeleton rounded w-1/2 mt-2" />
        <div className="h-6 skeleton rounded w-1/3 mt-3" />
      </div>
    </div>
  )
}
