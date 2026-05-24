'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Smartphone, Laptop, Gamepad2, Cpu, Mouse, Monitor, Headphones, Cable, ArrowRight, Zap, Shield, Truck, CreditCard, Star, Package } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard } from './product-card'
import { categories, formatPrice } from '@/lib/data'
import { useCartStore, useProductsStore } from '@/lib/store'

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphone: Smartphone,
  laptop: Laptop,
  'gamepad-2': Gamepad2,
  cpu: Cpu,
  mouse: Mouse,
  monitor: Monitor,
  headphones: Headphones,
  cable: Cable,
}

export function HomePage() {
  const { getAllProducts, getFeaturedProducts } = useProductsStore()
  const products = getAllProducts()
  const featuredProducts = getFeaturedProducts()
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Categories */}
      <CategoriesSection />
      
      {/* Featured Products or Empty State */}
      {products.length === 0 ? (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Nenhum produto disponivel</h2>
              <p className="text-muted-foreground mb-6">
                O administrador ainda nao cadastrou produtos na loja. Volte em breve!
              </p>
              <Link href="/admin">
                <Button className="gradient-primary">
                  Acessar Painel Admin
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <section className="py-12 md:py-16">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Produtos em Destaque</h2>
                    <p className="text-muted-foreground mt-1">Os mais desejados da semana</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {featuredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Promo Banner */}
          <PromoBanner />

          {/* All Products */}
          <section className="py-12 md:py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">Todos os Produtos</h2>
                  <p className="text-muted-foreground mt-1">{products.length} produtos disponiveis</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Features */}
      <FeaturesSection />

      {/* Brands Carousel */}
      <BrandsSection />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}

function HeroSection() {
  const { getAllProducts } = useProductsStore()
  const products = getAllProducts()
  const { addItem } = useCartStore()

  // Use real products if available, otherwise show static content
  const hasProducts = products.length > 0

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[500px]">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              {hasProducts ? 'Novos Produtos' : 'Em Breve'}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
              Soleer Hub
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Tecnologia Premium
            </p>
            <p className="text-muted-foreground mb-6 max-w-md">
              A melhor loja de tecnologia e produtos gamers do Brasil. Encontre os melhores produtos com precos incriveis.
            </p>

            {hasProducts && products[0] && (
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-3xl md:text-4xl font-bold text-primary">
                  {formatPrice(products[0].price)}
                </span>
                {products[0].originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(products[0].originalPrice)}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {hasProducts && products[0] ? (
                <>
                  <Button 
                    size="lg" 
                    className="gradient-primary glow-primary-sm"
                    onClick={() => addItem(products[0])}
                  >
                    Comprar Agora
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Link href={`/product/${products[0].id}`}>
                    <Button size="lg" variant="outline">
                      Ver Detalhes
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/admin">
                  <Button size="lg" className="gradient-primary glow-primary-sm">
                    Cadastrar Produtos
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <img
                src={hasProducts && products[0]?.image ? products[0].image : "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&h=800&fit=crop"}
                alt="Featured Product"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 glass rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Qualidade</p>
                  <p className="text-xs text-muted-foreground">Garantida</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="py-12 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Categorias</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll('left')} className="rounded-full">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll('right')} className="rounded-full">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.icon] || Cpu
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/category/${category.id}`}
                  className="flex flex-col items-center gap-3 p-6 min-w-[140px] bg-card rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm whitespace-nowrap">{category.name}</p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function PromoBanner() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20">
          <div className="absolute inset-0 grid-pattern opacity-50" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
            <div>
              <span className="inline-block px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full mb-4">
                OFERTA ESPECIAL
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ate 50% OFF em
                <br />
                <span className="gradient-text">Perifericos Gamer</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Mouses, teclados, headsets e muito mais com descontos incriveis por tempo limitado.
              </p>
              <Link href="/admin">
                <Button size="lg" className="gradient-primary glow-primary-sm">
                  Ver Ofertas
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=400&fit=crop"
                alt="Gaming Setup"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: Truck,
      title: 'Entrega Expressa',
      description: 'Receba em ate 24h nas principais capitais',
    },
    {
      icon: Shield,
      title: 'Compra Segura',
      description: 'Seus dados protegidos com criptografia',
    },
    {
      icon: CreditCard,
      title: 'PIX e Boleto',
      description: 'Pague da forma que preferir',
    },
    {
      icon: Headphones,
      title: 'Suporte 24/7',
      description: 'Atendimento especializado sempre',
    },
  ]

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BrandsSection() {
  const brands = ['Apple', 'Samsung', 'Sony', 'NVIDIA', 'Razer', 'Logitech', 'AMD', 'ASUS']

  return (
    <section className="py-12 border-y border-border bg-secondary/20">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-lg font-medium text-muted-foreground mb-8">
          Marcas Oficiais Parceiras
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.map((brand) => (
            <div
              key={brand}
              className="text-2xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function NewsletterSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Receba ofertas exclusivas
          </h2>
          <p className="text-muted-foreground mb-8">
            Cadastre-se e seja o primeiro a saber sobre promocoes e lancamentos
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 h-12 px-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
            />
            <Button className="h-12 px-8 gradient-primary glow-primary-sm">
              Inscrever
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">S</span>
                </div>
                <div>
                  <span className="font-bold text-lg">Soleer</span>
                  <span className="text-primary text-xs font-medium ml-1">Hub</span>
                </div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              A melhor loja de tecnologia e produtos gamers do Brasil.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Institucional</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Sobre nos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trabalhe conosco</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Termos de uso</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Ajuda</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Central de ajuda</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Rastrear pedido</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trocas e devolucoes</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Fale conosco</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Pagamento</h4>
            <div className="flex flex-wrap gap-2">
              {['PIX', 'Boleto'].map((method) => (
                <div
                  key={method}
                  className="px-3 py-2 bg-secondary rounded-lg text-xs font-medium"
                >
                  {method}
                </div>
              ))}
            </div>
            <h4 className="font-semibold mt-6 mb-4">Seguranca</h4>
            <div className="flex gap-2">
              <div className="px-3 py-2 bg-secondary rounded-lg text-xs font-medium">SSL</div>
              <div className="px-3 py-2 bg-secondary rounded-lg text-xs font-medium">PCI</div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>2024 Soleer Hub. Todos os direitos reservados.</p>
          <p className="mt-1">CNPJ: 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  )
}
