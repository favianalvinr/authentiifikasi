import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { Form, Button, Card, Container } from 'react-bootstrap';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert('Nama, Email, dan Password wajib diisi');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', form);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      alert('Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card
        className="border-0 rounded-4 shadow" // Menghilangkan overflow-hidden karena tidak ada gambar di samping
        style={{
          width: '380px', // Mengurangi lebar Card agar sesuai gambar referensi
          padding: '2rem', // Menambah padding internal card
        }}
      >
        <div className="text-start mb-3">
          <h2 className="fw-bold mb-0">sign</h2> {/* Mengubah judul */}
          <p className="text-muted">daftarkan akunmu sekarang</p> {/* Menambahkan sub-judul */}
        </div>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              name="name"
              placeholder="Nama Lengkap"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Form.Group>
          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? 'Memproses...' : 'Register'}
          </Button>
        </Form>

        <p className="mt-4 text-center small">
          sudah punya akun?{' '}
          <Link
            to="/login"
            className="fw-semibold text-decoration-none"
            style={{ color: '#000' }} // Warna hitam
          >
            login di sini!
          </Link>
        </p>
      </Card>
    </Container>
  );
}

export default Register;
