import { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function Banners() {
  const [banners, setBanners] = useState([]);
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
      const res = await api.get('/banners');
      setBanners(res.data);
    } catch {
      message.error('Failed to load banners');
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
      await api.delete(`/banners/${id}`);
      message.success('Deleted');
      fetchData();
    } catch {
      message.error('Delete failed');
    }
  };

  const onFinish = async (values: any) => {
    try {
      if (editingId) {
        await api.put(`/banners/${editingId}`, values);
        message.success('Updated');
      } else {
        await api.post('/banners', values);
        message.success('Created');
      }
      setModalOpen(false);
      fetchData();
    } catch {
      message.error('Save failed');
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Link', dataIndex: 'buttonLink', key: 'buttonLink' },
    { title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (v: boolean) => <Switch checked={v} disabled /> },
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
        <h2>Banners</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Add Banner</Button>
      </div>
      <Table columns={columns} dataSource={banners} rowKey="id" loading={loading} />
      <Modal
        title={editingId ? 'Edit Banner' : 'Add Banner'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="subtitle" label="Subtitle"><Input /></Form.Item>
          <Form.Item name="image" label="Image URL" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="buttonText" label="Button Text"><Input /></Form.Item>
          <Form.Item name="buttonLink" label="Button Link"><Input /></Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%', marginTop: 16 }}>Save Banner</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
