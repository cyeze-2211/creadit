import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Button, IconButton } from "@material-tailwind/react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import OrderBoxCreate from "./OrderBoxCreate";
import BoxEdit from "./OrderBoxEdit";
import BoxDelete from "./OrderBoxDelete";
import { NavLink } from "react-router-dom";
import axios from "axios";
import ReactLoading from 'react-loading';
import EmptyState from "../../../EmptyState";

export default function OrderBox() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/sells', {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    })
      .then(res => {
        if (res.data?.data) {
          setOrders(res.data.data);
        } else {
          setOrders([]);
        }
      })
      .catch(err => {
        setOrders([]);
        console.error("API xatosi:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = (order) => {
    setOrders(prev => [
      ...prev,
      { ...order, id: prev.length ? prev[prev.length - 1].id + 1 : 1 }
    ]);
    setOpenCreate(false);
  };

  const handleEdit = (order) => {
    setOrders(prev =>
      prev.map(item => (item.id === order.id ? order : item))
    );
    setOpenEdit(false);
    setEditOrder(null);
  };

  const handleEditOpen = (order) => {
    setEditOrder(order);
    setOpenEdit(true);
  };

  const handleDeleteOpen = (order) => {
    setDeleteOrder(order);
    setOpenDelete(true);
  };

  const handleDelete = (orderId) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
    setOpenDelete(false);
    setDeleteOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-[90px] mb-[20px] px-4">
           <div className="flex justify-center items-center h-64">
             <ReactLoading type="spin" color="#4CAF50" height={100} width={100} />
           </div>
         </div>
    );
  }

  return (
    <div className="min-h-screen mt-[90px]">
      <div className="flex justify-between items-center mb-8 mx-auto">
        <Typography variant="h3" className="text-gray-900 font-bold">
          Xaridlar ro'yxati
        </Typography>
        {/* <Button
          color="green"
          className="flex items-center gap-2"
          onClick={() => setOpenCreate(true)}
          size="sm"
        >
          <PlusIcon className="w-5 h-5" />
          Yangi buyurtma
        </Button> */}
      </div>
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 mx-auto">
  {orders.length > 0 ? (
    orders.map((order) => (
      <NavLink to={`/shop/detail/${order.id}`} key={order.id}>
        <Card className="w-full bg-white rounded-3xl shadow-xl border border-gray-200 flex flex-col">
          <CardBody className="flex flex-col items-start p-4">
            <div className="w-full mb-4 flex items-center gap-3">
              <img
                src={
                  order.product?.image
                    ? order.product.image.startsWith("http")
                      ? order.product.image.replace("http://localhost", "https://nasiyapos.uz")
                      : `https://nasiyapos.uz${order.product.image}`
                    : "https://via.placeholder.com/150x150?text=No+Image"
                }
                alt={order.product?.product_name || "Mahsulot"}
                className="w-16 h-16 rounded-xl bg-gray-100 border"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/150x150?text=No+Image";
                }}
              />
              <div>
                <Typography variant="h6" className="text-gray-900 font-bold mb-1">
                  {order.product?.product_name}
                </Typography>
                <div className="text-xs text-gray-500">
                  Buyurtma raqami: <span className="font-semibold">{order.id}</span>
                </div>
              </div>
            </div>
            <div className="mb-2 w-full">
              <div className="text-gray-800 text-sm">
                <span className="font-semibold">Egasining ismi:</span> {order.customer?.name}
              </div>
              <div className="text-gray-800 text-sm">
                <span className="font-semibold">Umumiy to'lov:</span> {order.price} USD
              </div>
              <div className="text-gray-800 text-sm">
                <span className="font-semibold">Buyurtma sanasi:</span> {order.created_at?.slice(0, 10)}
              </div>
            </div>
            <div className="flex gap-2 mt-auto ml-auto">
              <IconButton
                variant="text"
                color="blue"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEditOpen(order); }}
                size="sm"
              >
                <PencilIcon className="w-5 h-5" />
              </IconButton>
              <IconButton
                variant="text"
                color="red"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteOpen(order); }}
                size="sm"
              >
                <TrashIcon className="w-5 h-5" />
              </IconButton>
            </div>
          </CardBody>
        </Card>
      </NavLink>
    ))
  ) : (
      <div className="col-span-full">
          <EmptyState 
            title="Mahsulot topilmadi" 
            subtitle="Hozircha ro‘yxat bo‘sh" 
           
          />
        </div>
  )}
</div>

      {openCreate && (
        <OrderBoxCreate
          onCreate={handleCreate}
          onCancel={() => setOpenCreate(false)}
        />
      )}
      {openEdit && editOrder && (
        <BoxEdit
          product={editOrder}
          onEdit={handleEdit}
          onCancel={() => {
            setOpenEdit(false);
            setEditOrder(null);
          }}
        />
      )}
      {openDelete && deleteOrder && (
        <BoxDelete
          product={deleteOrder}
          onDelete={handleDelete}
          onCancel={() => {
            setOpenDelete(false);
            setDeleteOrder(null);
          }}
        />
      )}
    </div>
  );
}