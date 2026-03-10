import { useState, useEffect } from 'react';
import { productsAPI } from '../../api/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        nombre: '', descripcion: '', precio: '', stock: '', categoria: ''
    });

    const fetchProducts = () => {
        productsAPI.getAll()
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data.products || [];
                setProducts(data);
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchProducts(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({ nombre: '', descripcion: '', precio: '', stock: '', categoria: '' });
        setShowModal(true);
    };

    const openEdit = (product) => {
        setEditing(product);
        setForm({
            nombre: product.nombre || '',
            descripcion: product.descripcion || '',
            precio: product.precio?.toString() || '',
            stock: product.stock?.toString() || '',
            categoria: product.categoria || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = {
                nombre: form.nombre,
                descripcion: form.descripcion,
                precio: parseFloat(form.precio),
                stock: parseInt(form.stock),
                categoria: form.categoria || null
            };

            if (editing) {
                await productsAPI.update(editing.id_producto, data);
            } else {
                await productsAPI.create(data);
            }

            setShowModal(false);
            setLoading(true);
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.error || 'Error al guardar producto');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (product) => {
        if (!confirm(`¿Eliminar "${product.nombre}"?`)) return;
        try {
            await productsAPI.delete(product.id_producto);
            setLoading(true);
            fetchProducts();
        } catch {
            alert('Error al eliminar producto');
        }
    };

    const handleImageUpload = async (productId, file) => {
        const formData = new FormData();
        formData.append('productImage', file);
        try {
            await productsAPI.uploadImage(productId, formData);
            fetchProducts();
        } catch {
            alert('Error al subir imagen');
        }
    };

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    if (loading) return <div className="page"><div className="container"><LoadingSpinner /></div></div>;

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <div>
                        <h1 className="section-title">Gestión de Productos</h1>
                        <p className="section-subtitle" style={{ marginBottom: 0 }}>
                            {products.length} productos registrados
                        </p>
                    </div>
                    <button className="btn btn-primary" onClick={openCreate}>
                        + Nuevo Producto
                    </button>
                </div>

                {/* Products Table */}
                <div className="card fade-in" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id_producto}>
                                        <td>
                                            <div style={{
                                                width: 48, height: 48, borderRadius: 8,
                                                background: 'var(--color-bg-tertiary)',
                                                overflow: 'hidden', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {p.imagen ? (
                                                    <img src={p.imagen} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <span style={{ fontSize: '1.2rem' }}>📦</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600 }}>{p.nombre}</td>
                                        <td>{p.categoria || '—'}</td>
                                        <td>${parseFloat(p.precio).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</td>
                                        <td>
                                            <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                                                {p.stock}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${p.activo ? 'badge-success' : 'badge-error'}`}>
                                                {p.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏️</button>
                                                <label className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
                                                    📷
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => {
                                                            if (e.target.files[0]) handleImageUpload(p.id_producto, e.target.files[0]);
                                                        }}
                                                    />
                                                </label>
                                                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(p)}>🗑</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Nombre</label>
                                    <input className="form-input" value={form.nombre} onChange={update('nombre')} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Descripción</label>
                                    <textarea className="form-input" rows="3" value={form.descripcion} onChange={update('descripcion')} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Precio</label>
                                        <input className="form-input" type="number" step="0.01" min="0" value={form.precio} onChange={update('precio')} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Stock</label>
                                        <input className="form-input" type="number" min="0" value={form.stock} onChange={update('stock')} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Categoría</label>
                                    <input className="form-input" value={form.categoria} onChange={update('categoria')} placeholder="Ej: Electrónica" />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
                                        {saving ? 'Guardando...' : editing ? 'Actualizar' : 'Crear Producto'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
