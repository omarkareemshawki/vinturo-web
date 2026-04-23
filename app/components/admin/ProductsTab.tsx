'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProductsTabProps {
  cardStyle: any;
}

type Product = {
  id: string;
  name: string;
  subtitle?: string;
  tagline?: string;
  description: string;
  price: number;
  stock_level: number;
  image_url: string;
  notes?: string[];
  created_at: string;
};

export function ProductsTab({ cardStyle }: ProductsTabProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_level: '',
    image_url: '',
    subtitle: '',
    tagline: '',
  });

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setUploadedImageUrl(dataUrl);
        setFormData({ ...formData, image_url: dataUrl });
        setMessage('Image uploaded (stored as data URL)');
        setTimeout(() => setMessage(''), 3000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setMessage('Failed to upload image');
      console.error('Upload error:', err);
    }
    setUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setMessage('Failed to load products');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const body = editingId
      ? { id: editingId, ...formData }
      : formData;

    try {
      const res = await fetch('/api/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage(editingId ? 'Product updated' : 'Product created');
        setFormData({ name: '', description: '', price: '', stock_level: '', image_url: '', subtitle: '', tagline: '' });
        setUploadedImageUrl('');
        setEditingId(null);
        setShowForm(false);
        fetchProducts();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Error saving product');
      console.error('Save error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product?')) {
      try {
        const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setMessage('Product deleted');
          fetchProducts();
          setTimeout(() => setMessage(''), 3000);
        }
      } catch (err) {
        setMessage('Error deleting product');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock_level: product.stock_level.toString(),
      image_url: product.image_url,
      subtitle: product.subtitle || '',
      tagline: product.tagline || '',
    });
    setUploadedImageUrl(product.image_url);
    setEditingId(product.id);
    setShowForm(true);
  };

  return (
    <div>
      {message && (
        <div style={{ padding: '1rem', textAlign: 'center', background: message.includes('Error') ? 'rgba(160, 68, 90, 0.1)' : 'rgba(201, 169, 110, 0.1)', borderBottom: `1px solid ${message.includes('Error') ? '#a0445a' : 'var(--gold)'}`, marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: message.includes('Error') ? '#a0445a' : 'var(--gold)', letterSpacing: '0.1em' }}>{message}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold)' }}>PRODUCTS</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', description: '', price: '', stock_level: '', image_url: '', subtitle: '', tagline: '' }); setUploadedImageUrl(''); }}
          style={{
            fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', padding: '0.6rem 1rem',
            background: 'var(--gold)', color: 'var(--black)', border: 'none',
            cursor: 'pointer', transition: 'all 0.3s ease'
          }}
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ ...cardStyle, marginBottom: '2rem' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.2)',
                padding: '0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.6rem',
                color: 'var(--cream)', outline: 'none'
              }}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price (EGP)"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
              required
              style={{
                background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.2)',
                padding: '0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.6rem',
                color: 'var(--cream)', outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Subtitle (optional)"
              value={formData.subtitle}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              style={{
                background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.2)',
                padding: '0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.6rem',
                color: 'var(--cream)', outline: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Tagline (optional)"
              value={formData.tagline}
              onChange={e => setFormData({ ...formData, tagline: e.target.value })}
              style={{
                background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.2)',
                padding: '0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.6rem',
                color: 'var(--cream)', outline: 'none'
              }}
            />
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            style={{
              width: '100%', background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.2)',
              padding: '0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.6rem',
              color: 'var(--cream)', outline: 'none', minHeight: '100px', marginBottom: '1rem'
            }}
          />

          <input
            type="number"
            placeholder="Stock Level"
            value={formData.stock_level}
            onChange={e => setFormData({ ...formData, stock_level: e.target.value })}
            style={{
              width: '100%', background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.2)',
              padding: '0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.6rem',
              color: 'var(--cream)', outline: 'none', marginBottom: '1rem'
            }}
          />

          {/* Drag-and-drop image upload */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? 'var(--gold)' : 'rgba(201,169,110,0.3)'}`,
              background: dragActive ? 'rgba(201,169,110,0.1)' : 'rgba(201,169,110,0.04)',
              padding: '2rem',
              textAlign: 'center',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '1rem'
            }}
          >
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Drag & drop image here
            </p>
            <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: 'var(--gold)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              or click to browse
              <input
                type="file"
                accept="image/*"
                onChange={e => e.target.files && handleImageUpload(e.target.files[0])}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </label>
            {uploadedImageUrl && (
              <img
                src={uploadedImageUrl}
                alt="Preview"
                style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '1rem', borderRadius: '4px' }}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={!formData.name || !formData.price}
            style={{
              width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.6rem',
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'var(--black)', background: 'var(--gold)',
              border: 'none', padding: '0.75rem', cursor: 'pointer',
              opacity: !formData.name || !formData.price ? 0.5 : 1
            }}
          >
            {editingId ? 'Update' : 'Create'} Product
          </button>
        </motion.form>
      )}

      {!loading && products.length === 0 && !showForm && (
        <button
          onClick={fetchProducts}
          style={{
            width: '100%', fontFamily: 'var(--font-body)', fontSize: '0.6rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '1rem', background: 'rgba(201,169,110,0.1)',
            border: '1px solid rgba(201,169,110,0.2)', color: 'var(--gold)',
            cursor: 'pointer', marginBottom: '2rem'
          }}
        >
          Load Products
        </button>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ ...cardStyle }}
          >
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                style={{ width: '100%', height: '180px', objectFit: 'cover', marginBottom: '1rem', borderRadius: '4px' }}
              />
            )}
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--gold)', marginBottom: '0.25rem' }}>
              {product.name}
            </h3>
            {product.subtitle && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                {product.subtitle}
              </p>
            )}
            {product.tagline && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', color: 'rgba(201,169,110,0.7)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                "{product.tagline}"
              </p>
            )}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: '1.4' }}>
              {product.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)' }}>
                {product.price} EGP
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: product.stock_level > 0 ? '#6BAF7A' : '#a0445a' }}>
                Stock: {product.stock_level}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleEdit(product)}
                style={{
                  flex: 1, fontFamily: 'var(--font-body)', fontSize: '0.5rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  padding: '0.5rem', background: 'rgba(201,169,110,0.1)',
                  border: '1px solid rgba(201,169,110,0.3)', color: 'var(--gold)',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                style={{
                  flex: 1, fontFamily: 'var(--font-body)', fontSize: '0.5rem',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  padding: '0.5rem', background: 'rgba(160,68,90,0.1)',
                  border: '1px solid rgba(160,68,90,0.3)', color: '#a0445a',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

