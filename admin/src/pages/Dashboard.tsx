import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { ShoppingOutlined, DollarOutlined, UserOutlined, AppstoreOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function Dashboard() {
  const [data, setData] = useState<{
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
    recentOrders: any[];
    lowStockVariants: any[];
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/orders/analytics');
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) return <div>Loading...</div>;

  const orderCols = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (val: number) => `$${val}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === 'delivered' ? 'green' : 'blue'}>{status.toUpperCase()}</Tag> },
  ];

  const stockCols = [
    { title: 'Product', key: 'product', render: (_: any, record: any) => record.product.name },
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Size/Color', key: 'variant', render: (_: any, record: any) => `${record.size} / ${record.color}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock', render: (val: number) => <Tag color="red">{val}</Tag> },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Revenue" value={data.totalRevenue} prefix={<DollarOutlined />} precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Orders" value={data.totalOrders} prefix={<ShoppingOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Customers" value={data.totalCustomers} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Products" value={data.totalProducts} prefix={<AppstoreOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Recent Orders">
            <Table dataSource={data.recentOrders} columns={orderCols} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Low Stock Alerts">
            <Table dataSource={data.lowStockVariants} columns={stockCols} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
