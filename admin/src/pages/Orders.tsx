import { useEffect, useState } from 'react';
import { Table, message, Select } from 'antd';
import api from '../api/client';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/all');
      setOrders(res.data);
    } catch {
      message.error('Failed to load orders');
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      message.success('Status updated');
      fetchData();
    } catch {
      message.error('Update failed');
    }
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (val: number) => `$${val}` },
    { title: 'Payment', dataIndex: 'paymentMethod', key: 'paymentMethod' },
    { 
      title: 'Status', 
      key: 'status', 
      render: (_: any, record: any) => (
        <Select 
          value={record.status} 
          onChange={(val) => handleStatusChange(record.id, val)}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'packed', label: 'Packed' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          style={{ width: 120 }}
        />
      )
    },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (val: string) => new Date(val).toLocaleDateString() },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <h2>Orders</h2>
      </div>
      <Table 
        columns={columns} 
        dataSource={orders} 
        rowKey="id" 
        loading={loading} 
        expandable={{
          expandedRowRender: (record: any) => (
            <div style={{ padding: 16, background: '#fafafa' }}>
              <p>Mailing Address: {record.addressLine}, {record.city}, {record.district} {record.zipCode}</p>
              <h4>Ordered Items:</h4>
              <ul>
                {record.items.map((item: any) => (
                  <li key={item.id}>
                    {item.quantity}x {item.name} ({item.size} / {item.color}) - ${item.price} = ${item.quantity * item.price}
                  </li>
                ))}
              </ul>
            </div>
          )
        }}
      />
    </>
  );
}
