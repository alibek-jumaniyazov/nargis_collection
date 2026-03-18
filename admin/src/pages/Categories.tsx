import { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function Categories() {
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
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch {
      message.error('Failed to load categories');
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
      await api.delete(`/categories/${id}`);
      message.success('Deleted');
      fetchData();
    } catch {
      message.error('Delete failed');
    }
  };

  const onFinish = async (values: any) => {
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, values);
        message.success('Updated');
      } else {
        await api.post('/categories', values);
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
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: 'Gender', dataIndex: 'gender', key: 'gender' },
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
        <h2>Categories</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Add Category</Button>
      </div>
      <Table columns={columns} dataSource={categories} rowKey="id" loading={loading} />
      <Modal
        title={editingId ? 'Edit Category' : 'Add Category'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select options={[{ value: 'women', label: 'Women' }, { value: 'men', label: 'Men' }, { value: 'unisex', label: 'Unisex' }]} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%', marginTop: 16 }}>Save Category</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
