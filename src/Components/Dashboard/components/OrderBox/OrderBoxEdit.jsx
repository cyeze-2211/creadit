import React, { useState, useEffect } from "react";
import { Dialog, DialogBody, DialogHeader, DialogFooter, Button, Input, Select, Option } from "@material-tailwind/react";
import axios from "axios";

export default function OrderBoxEdit({ product, onEdit, onCancel }) {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productId, setProductId] = useState(product.product?.id ? String(product.product.id) : "");
  const [customerId, setCustomerId] = useState(product.customer?.id ? String(product.customer.id) : "");
  const [price, setPrice] = useState(product.price || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/products', {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    }).then(res => {
      setProducts(res.data?.data || []);
    });
    axios.get('/api/customers', {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    }).then(res => {
      setCustomers(res.data?.data || []);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !customerId || !price) return;
    setLoading(true);
    try {
      const response = await axios.put(`/api/sells/${product.id}`, {
        product_id: Number(productId),
        customer_id: Number(customerId),
        price: Number(price)
      }, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      if (response.data?.data) {
        onEdit(response.data.data);
      } else {
        alert("Buyurtma tahrirlanmadi");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Xatolik yuz berdi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} handler={onCancel} size="sm">
      <DialogHeader>Buyurtmani tahrirlash</DialogHeader>
      <form onSubmit={handleSubmit}>
        <DialogBody className="flex flex-col gap-4">
          <Select
            label="Mahsulot tanlang"
            value={productId}
            onChange={val => setProductId(val)}
            required
            disabled={loading}
          >
            {products.map(product => (
              <Option key={product.id} value={String(product.id)}>
                {product.product_name}
              </Option>
            ))}
          </Select>
          <Select
            label="Mijoz tanlang"
            value={customerId}
            onChange={val => setCustomerId(val)}
            required
            disabled={loading}
          >
            {customers.map(customer => (
              <Option key={customer.id} value={String(customer.id)}>
                {customer.name} ({customer.phone})
              </Option>
            ))}
          </Select>
          <Input
            label="Narx (so'm)"
            type="number"
            min={1}
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            disabled={loading}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={onCancel} className="mr-2" disabled={loading}>
            Bekor qilish
          </Button>
          <Button color="green" type="submit" disabled={loading}>
            Saqlash
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}