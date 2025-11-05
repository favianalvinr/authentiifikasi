import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Container, Spinner, Card } from 'react-bootstrap';
import api from '../api/api';
import AppNavbar from '../components/Navbar';
import FormModal from '../components/FormModal';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil data dari API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/items');
      setItems(res.data);
    } catch (err) {
      alert('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Simpan data baru atau edit
  const handleSave = async () => {
    if (!form.title || !form.description) {
      alert('Judul dan Deskripsi wajib diisi');
      return;
    }

    try {
      if (editId) {
        await api.put(`/items/${editId}`, form);
      } else {
        await api.post('/items', form);
      }

      setForm({ title: '', description: '' });
      setEditId(null);
      setShow(false);
      fetchData();
    } catch (err) {
      alert('Gagal menyimpan data');
    }
  };

  // Hapus data
  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      fetchData();
    } catch (err) {
      alert('Gagal menghapus data');
    }
  };

  // Edit data
  const handleEdit = (item) => {
    setForm({ title: item.title, description: item.description });
    setEditId(item.id);
    setShow(true);
  };

  // Reset form saat modal ditutup
  const handleCloseModal = () => {
    setShow(false);
    setForm({ title: '', description: '' });
    setEditId(null);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <AppNavbar />
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Dashboard</h3>
          {/* PERUBAHAN: Tombol dibuat rounded-pill untuk gaya modern */}
          <Button onClick={() => setShow(true)} className="rounded-pill">
            Tambah Data <span className="ms-1 fw-bold">+</span>
          </Button>
        </div>

        {loading ? (
          // PERUBAHAN: Loading state dibungkus Card agar konsisten
          <Card className="shadow-sm border-0 text-center py-5">
            <Card.Body>
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 mb-0 text-muted">Memuat data...</p>
            </Card.Body>
          </Card>
        ) : (
          // PERUBAHAN: Tabel dibungkus dengan Card
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Table 
                striped 
                hover 
                responsive // Tambah 'responsive' untuk mobile
                className="align-middle mb-0" // 'align-middle' untuk vert-center
                // 'bordered' dihapus
              >
                {/* PERUBAHAN: Header tabel diberi class 'table-light' */}
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Judul</th>
                    <th>Deskripsi</th>
                    <th className="text-center">Aksi</th> {/* Aksi di-tengah */}
                  </tr>
                </thead>
                <tbody>
                  {items.length > 0 ? (
                    items.map((item, i) => (
                      <tr key={item.id}>
                        <td>{i + 1}</td>
                        <td>{item.title}</td>
                        <td>{item.description}</td>
                        {/* PERUBAHAN: Tombol di-tengah dan diubah stylenya */}
                        <td className="text-center"> 
                          <Button
                            size="sm"
                            variant="outline-primary" // Ubah ke 'outline-primary'
                            className="me-2"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger" // Ubah ke 'outline-danger'
                            onClick={() => handleDelete(item.id)}
                          >
                            Hapus
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Tampilan jika tidak ada data
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
                        Belum ada data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        <FormModal
          show={show}
          onHide={handleCloseModal}
          onSave={handleSave}
          form={form}
          setForm={setForm}
          editId={editId}
        />
      </Container>
    </>
  );
}

export default Dashboard;