import { useState, useEffect, useMemo } from 'react';
import { productsAPI } from '../api/apiClient';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        productsAPI.getAll()
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data.products || [];
                setProducts(data);
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    const categories = useMemo(() => {
        const cats = [...new Set(products.map(p => p.categoria).filter(Boolean))];
        return cats.sort();
    }, [products]);

    const filtered = useMemo(() => {
        return products.filter(p => {
            const matchSearch = !search ||
                p.nombre.toLowerCase().includes(search.toLowerCase()) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(search.toLowerCase()));
            const matchCategory = !category || p.categoria === category;
            return matchSearch && matchCategory;
        });
    }, [products, search, category]);

    return (
        <div className="page">
            <div className="container">
                <h1 className="section-title fade-in">Nuestros Productos</h1>
                <p className="section-subtitle fade-in">
                    Encuentra exactamente lo que necesitas
                </p>

                {/* Filters */}
                <div className="filters-bar fade-in">
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Buscar productos..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <button
                        className={`filter-chip ${!category ? 'active' : ''}`}
                        onClick={() => setCategory('')}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-chip ${category === cat ? 'active' : ''}`}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <LoadingSpinner />
                ) : filtered.length > 0 ? (
                    <div className="product-grid fade-in">
                        {filtered.map(product => (
                            <ProductCard key={product.id_producto} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="icon">🔍</div>
                        <h3>No se encontraron productos</h3>
                        <p>Intenta con otra búsqueda o categoría</p>
                        {(search || category) && (
                            <button
                                className="btn btn-secondary"
                                onClick={() => { setSearch(''); setCategory(''); }}
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
