import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { Form, Button, Card, Container, Modal, } from "react-bootstrap";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setModalMessage("Email dan Password wajib diisi");
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setModalMessage("Login berhasil!");
        setShowModal(true);
      } else {
        setModalMessage("Token tidak ditemukan");
        setShowModal(true);
      }
    } catch (err) {
      setModalMessage("Email atau password salah");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    if (modalMessage === "Login berhasil!") {
      navigate("/dashboard");
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
          <h2 className="fw-bold mb-0">Log in</h2> {/* Mengubah judul */}
          <p className="text-muted">selamat datang kembali</p> {/* Menambahkan sub-judul */}
        </div>

          <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </Form.Group>

          {/* Tombol Log In */}
          <Button
            type="submit"
            className="w-100 py-2 d-flex justify-content-center align-items-center" // Tambah d-flex untuk menengahkan ikon
            disabled={loading}
            style={{
              backgroundColor: '#0D6EFD', // Warna biru terang
              border: 'none',
              fontSize: '1.1rem', // Ukuran font tombol lebih besar
            }}
          >
            {loading ? 'Logging in...' : (
              <>
                Log In
                <span className="ms-2">→</span> {/* Ikon panah */}
              </>
            )}
          </Button>
        </Form>

        {/* Link Don't have an account? Sign up now! */}
        <p className="mt-4 text-center small">
          Belum punya akun?{' '}
          <Link
            to="/register"
            className="fw-semibold text-decoration-none"
            style={{ color: '#000' }} // Warna hitam
          >
            Sign up disini!
          </Link>
        </p>
      </Card>

      {/* Modal tetap sama */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Body className="text-center">
          <p className="mb-3">{modalMessage}</p>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Login;
