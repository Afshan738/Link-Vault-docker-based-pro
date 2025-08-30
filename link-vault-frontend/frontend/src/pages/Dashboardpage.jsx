import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function LinkFormModal({ initialData, onSubmit, onCancel, message }) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const categories = e.target.value.split(',').map(cat => cat.trim().toLowerCase());
    setFormData(prev => ({ ...prev, categories }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'grid', placeItems: 'center', zIndex: 100 }}>
      <div className="dashboard-content" style={{ margin: 0, maxWidth: '500px' }}>
        <form onSubmit={handleSubmit}>
          <h2 className="title">{formData.id ? 'Edit Link' : 'Add a New Link'}</h2>
          <div><label htmlFor="url">URL</label><input type="text" id="url" name="url" value={formData.url} onChange={handleChange} required /></div>
          <div><label htmlFor="title">Title</label><input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required /></div>
          <div><label htmlFor="description">Description</label><textarea id="description" name="description" value={formData.description} onChange={handleChange} /></div>
          <div><label htmlFor="categories">Categories (comma-separated)</label><input type="text" id="categories" name="categories" value={formData.categories.join(', ')} onChange={handleCategoryChange} /></div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onCancel} style={{ backgroundColor: '#475569', color: 'var(--color-text)'}}>Cancel</button>
            <button type="submit">{formData.id ? 'Update Link' : 'Save Link'}</button>
          </div>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const fetchLinks = async (token) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/links', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch links.');
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchLinks(token);
    }
  }, [navigate]);

  const handleFormSubmit = async (formData) => {
    const token = localStorage.getItem('userToken');
    const isUpdating = !!formData.id;
    const url = isUpdating ? `/api/links/${formData.id}` : '/api/links';
    const method = isUpdating ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          url: formData.url,
          title: formData.title,
          description: formData.description,
          categories: formData.categories,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Operation failed');
      
      setMessage(`Link successfully ${isUpdating ? 'updated' : 'saved'}!`);
      setIsFormOpen(false);
      fetchLinks(token);
    } catch (error) {
      setMessage(error.message);
    }
  };
  
  const handleDelete = async (linkId) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;
    
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete link');
      
      setMessage(data.msg);
      fetchLinks(token);
    } catch (error) {
      setMessage(error.message);
    }
  };
  
  const handleEdit = (link) => {
    setEditingLink(link);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingLink(null);
    setIsFormOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const initialFormData = editingLink 
    ? { id: editingLink._id, url: editingLink.url, title: editingLink.title, description: editingLink.description || '', categories: editingLink.categories || [] }
    : { id: null, url: '', title: '', description: '', categories: [] };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', color: 'var(--color-text)' }}>
      <header style={{ padding: '1rem 2rem', backgroundColor: 'var(--color-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0, fontFamily: 'var(--font-heading)' }}>Link Vault</h1>
        <div>
          <button onClick={handleLogout} style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem', backgroundColor: '#475569' }}>Logout</button>
        </div>
      </header>

      <main style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 className="title" style={{ fontSize: '2rem', textAlign: 'left', margin: 0 }}>Your Saved Links</h2>
            <button onClick={handleAddNew} style={{ width: 'auto' }}>+ Add New Link</button>
          </div>
          {message && <p>{message}</p>}

          {isLoading ? <p>Loading links...</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {links.map(link => (
                <div key={link._id} className="link-card">
                  <div className="link-card-content">
                    <h3>{link.title}</h3>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                    <p className="description">{link.description}</p>
                    <div className="categories">
                      {link.categories.map(cat => <span key={cat} className="category-tag">{cat}</span>)}
                    </div>
                  </div>
                  <div className="link-card-actions">
                    <button onClick={() => handleEdit(link)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(link._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {isFormOpen && (
        <LinkFormModal 
          initialData={initialFormData}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          message={message}
        />
      )}
    </div>
  );
}

export default DashboardPage;