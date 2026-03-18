import { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Switch, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data.data);
      setCategories(catRes.data);
    } catch {
      message.error('Failed to load data');
    }
    setLoading(false);
  };

  const handleOpenModal = (record?: any) => {
    setEditingId(record?.id || null);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      message.success('Deleted');
      fetchData();
    } catch {
      message.error('Delete failed');
    }
  };

  const onFinish = async (values: any) => {
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, values);
        message.success('Updated');
      } else {
        await api.post('/products', values);
        message.success('Created');
      }
      setModalOpen(false);
      fetchData();
    } catch {
      message.error('Save failed');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (v: number) => `$${v}` },
    { title: 'Category', key: 'category', render: (_: any, record: any) => record.category?.name },
    { title: 'Published', dataIndex: 'isPublished', key: 'isPublished', render: (v: boolean) => <Switch checked={v} disabled /> },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Products</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Add Product</Button>
      </div>

      <Table columns={columns} dataSource={products} rowKey="id" loading={loading} />

      <Modal
        title={editingId ? 'Edit Product' : 'Add Product'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
            <Select options={categories.map((c: any) => ({ label: c.name, value: c.id }))} />
          </Form.Item>
          <Space>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}><InputNumber min={0} /></Form.Item>
            <Form.Item name="salePrice" label="Sale Price"><InputNumber min={0} /></Form.Item>
          </Space>
          <Form.Item name="description" label="Description"><Input.TextArea rows={4} /></Form.Item>
          <Form.Item name="shortDescription" label="Short Description"><Input /></Form.Item>
          <Form.Item name="coverImage" label="Cover Image URL"><Input /></Form.Item>
          <Space>
            <Form.Item name="isFeatured" label="Featured" valuePropName="checked"><Switch /></Form.Item>
            <Form.Item name="isNewArrival" label="New Arrival" valuePropName="checked"><Switch /></Form.Item>
            <Form.Item name="isPublished" label="Published" valuePropName="checked"><Switch /></Form.Item>
          </Space>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%', marginTop: 16 }}>Save Product</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
