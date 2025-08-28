"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import styles from "@/components/Products.module.css";
import { ProductsService } from "@/services/productsService";
import { Category, Product } from "@/types/products";
import Image from "next/image";

const productsService = new ProductsService();

export default function ProductsPage() {
  const params = useParams();
  const lang = Array.isArray(params.lang)
    ? params.lang[0]
    : params.lang || "tr";

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const cats = await productsService.getCategories();
        const prods = await productsService.getProducts();
        setCategories(cats.filter((c) => c.isActive));
        setProducts(prods.filter((p) => p.isActive));
        setFilteredProducts(prods.filter((p) => p.isActive));
      } catch (err) {
        console.error("Veriler yüklenemedi", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Kategori değiştiğinde yumuşak geçiş
  useEffect(() => {
    setIsFiltering(true);
    
    const timer = setTimeout(() => {
      const filtered = activeCategory === "all"
        ? products
        : products.filter((p) => p.categoryId === activeCategory);
      
      setFilteredProducts(filtered);
      setIsFiltering(false);
    }, 300); // 300ms animasyon süresi
    
    return () => clearTimeout(timer);
  }, [activeCategory, products]);

  // Modal kapandığında body scroll'unu geri getir
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const changeSlide = useCallback(
    (direction: "next" | "prev") => {
      if (!selectedProduct?.images) return;
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((i) => {
          if (direction === "next")
            return (i + 1) % selectedProduct.images!.length;
          return (
            (i - 1 + selectedProduct.images!.length) %
            selectedProduct.images!.length
          );
        });
        setFade(true);
      }, 300); // Zamanı 300ms'ye çıkardık (150ms'den)
    },
    [selectedProduct]
  );

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedProduct(null);
      document.body.style.overflow = "auto";
    }
  }, []);

  // Modal açıldığında ekranı ortala
  useEffect(() => {
    if (selectedProduct) {
      const modalContent = document.querySelector(
        `.${styles.modalContent}`
      ) as HTMLElement;
      if (modalContent) {
        setTimeout(() => {
          modalContent.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      }
    }
  }, [selectedProduct]);

  if (loading) return <p className={styles.loading}>Yükleniyor...</p>;

  return (
    <section className={styles.productsSection}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.floatingShapes}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
          <div className={styles.shape4}></div>
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {lang === "tr" ? "Ürünlerimiz" : "Our Products"}
          </h1>
          <p className={styles.heroSubtitle}>
            {lang === "tr" 
              ? "Kaliteli ve özenle seçilmiş ürünlerimizi keşfedin" 
              : "Discover our quality and carefully selected products"}
          </p>
        </div>
      </div>

      {/* CATEGORY NAVBAR */}
      <div className={styles.categoryNavbarContainer}>
        <div className={styles.categoryNavbar}>
          <button
            className={`${styles.categoryButton} ${
              activeCategory === "all" ? styles.activeCategory : ""
            }`}
            onClick={() => setActiveCategory("all")}
          >
            {lang === "tr" ? "Hepsi" : "All"}
          </button>
          {categories
            .sort((a, b) => a.order - b.order)
            .map((cat) => (
              <button
                key={cat.id}
                className={`${styles.categoryButton} ${
                  activeCategory === cat.id ? styles.activeCategory : ""
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {lang === "tr" ? cat.name_tr : cat.name_en}
              </button>
            ))}
        </div>
      </div>

      {/* PRODUCTS GRID - Yumuşak geçiş için animasyon sınıfı */}
      <div className={`${styles.productsGrid} ${isFiltering ? styles.fadeOut : styles.fadeIn}`}>
        {filteredProducts.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            lang={lang}
            onClick={() => {
              setSelectedProduct(p);
              setCurrentImageIndex(0);
              setFade(true);
              document.body.style.overflow = "hidden";
            }}
          />
        ))}
      </div>

      {/* MODAL */}
      {selectedProduct && (
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
          <div className={styles.modalContent} id="modal-content">
            {selectedProduct.images && selectedProduct.images.length > 0 && (
              <div className={styles.slider}>
                <div className={styles.sliderImageContainer}>
                  <Image
                  priority
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${selectedProduct.images[currentImageIndex].filePath}`}
                    alt={selectedProduct.images[currentImageIndex].originalName}
                    width={300}
                    height={300}
                    className={`${styles.sliderImage} ${
                      fade ? styles.fadeIn : styles.fadeOut
                    }`}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                {selectedProduct.images.length > 1 && (
                  <>
                    <button
                      className={styles.prevButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeSlide("prev");
                      }}
                    >
                      ‹
                    </button>
                    <button
                      className={styles.nextButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeSlide("next");
                      }}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            )}
            <div className={styles.modalProductName}>
              {lang === "tr"
                ? selectedProduct.name_tr
                : selectedProduct.name_en}
            </div>
            <div className={styles.modalProductPrice}>
              {selectedProduct.price.toFixed(2)}₺
            </div>
            <button
              className={styles.closeButton}
              onClick={() => {
                setSelectedProduct(null);
                document.body.style.overflow = "auto";
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ProductCard component with manual slider controls
function ProductCard({
  product,
  lang,
  onClick,
}: {
  product: Product;
  lang: string;
  onClick: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (product.images && product.images.length > 1 && !isHovering) {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentIndex((i) => (i + 1) % product.images!.length);
          setFade(true);
        }, 300); // Zamanı 300ms'ye çıkardık (150ms'den)
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [product, isHovering]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(
        (i) => (i - 1 + product.images!.length) % product.images!.length
      );
      setFade(true);
    }, 300); // Zamanı 300ms'ye çıkardık (150ms'den)
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % product.images!.length);
      setFade(true);
    }, 300); // Zamanı 300ms'ye çıkardık (150ms'den)
  };

  return (
    <div
      className={styles.productCard}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={styles.productImage}>
        {product.images && product.images.length > 0 ? (
          <>
            <div className={styles.productImageContainer}>
              <Image
                priority
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.images[currentIndex].filePath}`}
                alt={lang === "tr" ? product.name_tr : product.name_en}
                width={300}
                height={300}
                style={{ width: '100%', height: 'auto' }}
                className={`${styles.productImageMain} ${fade ? styles.fadeIn : styles.fadeOut}`}
              />
            </div>
            {product.images.length > 1 && (
              <div className={styles.thumbnailControls}>
                <button className={styles.thumbnailPrev} onClick={handlePrev}>
                  ‹
                </button>
                <div className={styles.thumbnailDots}>
                  {product.images.map((_, index) => (
                    <span
                      key={index}
                      className={`${styles.thumbnailDot} ${
                        index === currentIndex ? styles.activeDot : ""
                      }`}
                    />
                  ))}
                </div>
                <button className={styles.thumbnailNext} onClick={handleNext}>
                  ›
                </button>
              </div>
            )}
          </>
        ): null}
      </div>
      <div className={styles.productContent}>
        <div className={styles.productName}>
          {lang === "tr" ? product.name_tr : product.name_en}
        </div>
        <div className={styles.productPrice}>{product.price.toFixed(2)}₺</div>
      </div>
    </div>
  );
}