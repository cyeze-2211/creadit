import React, { useState } from "react";
import { Card, CardBody, Typography, Button, IconButton } from "@material-tailwind/react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import BoxCreate from "./BoxCreate";
import BoxEdit from "./BoxEdit";
import BoxDelete from "./BoxDelete";

const initialProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-1-202309?wid=5120&hei=2880&fmt=jpeg&qlt=80&.v=1692923778669",
    price: 1200,
    months: 12,
    monthly: 110,
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    image: "https://images.samsung.com/is/image/samsung/p6pim/levant/2401/gallery/levant-galaxy-s24-s921-sm-s921bzadegy-thumb-539898429",
    price: 950,
    months: 10,
    monthly: 105,
  },
  {
    id: 3,
    name: "MacBook Air M2",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-13-midnight-gallery1-20220606?wid=4000&hei=3072&fmt=jpeg&qlt=80&.v=1654122880566",
    price: 1600,
    months: 18,
    monthly: 95,
  },
  {
    id: 4,
    name: "iPad Pro 12.9",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-12-11-select-202210?wid=470&hei=556&fmt=png-alpha&.v=1664411206422",
    price: 1300,
    months: 12,
    monthly: 115,
  },
  {
    id: 5,
    name: "PlayStation 5",
    image: "https://m.media-amazon.com/images/I/51QxA-98QzL._AC_UF894,1000_QL80_.jpg",
    price: 700,
    months: 6,
    monthly: 125,
  },
];

export default function Box() {
  const [products, setProducts] = useState(initialProducts);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  const handleCreate = (product) => {
    setProducts(prev => [
      ...prev,
      { ...product, id: prev.length ? prev[prev.length - 1].id + 1 : 1 }
    ]);
    setOpenCreate(false);
  };

  const handleEdit = (product) => {
    setProducts(prev =>
      prev.map(item => (item.id === product.id ? product : item))
    );
    setOpenEdit(false);
    setEditProduct(null);
  };

  const handleEditOpen = (product) => {
    setEditProduct(product);
    setOpenEdit(true);
  };

  const handleDeleteOpen = (product) => {
    setDeleteProduct(product);
    setOpenDelete(true);
  };

  const handleDelete = (productId) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    setOpenDelete(false);
    setDeleteProduct(null);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <Typography variant="h5" className="text-gray-900 font-bold">
          Mahsulotlar ro'yxati
        </Typography>
        <Button
          color="green"
          className="flex items-center gap-2"
          onClick={() => setOpenCreate(true)}
          size="sm"
        >
          <PlusIcon className="w-5 h-5" />
          Yangi Mahsulot
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 max-w-6xl mx-auto">
        {products.map((product) => (
          <Card key={product.id} className="w-full bg-white rounded-3xl shadow-xl border border-gray-200 flex flex-col">
            <CardBody className="flex flex-col items-center p-4">
              <div className="w-full mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-contain rounded-xl bg-gray-100"
                />
              </div>
              <Typography variant="h6" className="text-gray-900 font-bold mb-2 text-center">
                {product.name}
              </Typography>
              <div className="text-gray-800 text-sm mb-1">
                Narxi: <span className="font-semibold">{product.price} USD</span>
              </div>
              <div className="text-gray-800 text-sm mb-1">
                Bo'lib to'lash: <span className="font-semibold">{product.months} oy</span>
              </div>
              <div className="text-gray-800 text-sm mb-3">
                Oylik to'lov: <span className="font-semibold">{product.monthly} USD</span>
              </div>
              <div className="flex gap-2 mt-auto">
                <IconButton
                  variant="text"
                  color="blue"
                  onClick={() => handleEditOpen(product)}
                  size="sm"
                >
                  <PencilIcon className="w-5 h-5" />
                </IconButton>
                <IconButton
                  variant="text"
                  color="red"
                  onClick={() => handleDeleteOpen(product)}
                  size="sm"
                >
                  <TrashIcon className="w-5 h-5" />
                </IconButton>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      {openCreate && (
        <BoxCreate
          onCreate={handleCreate}
          onCancel={() => setOpenCreate(false)}
        />
      )}
      {openEdit && editProduct && (
        <BoxEdit
          product={editProduct}
          onEdit={handleEdit}
          onCancel={() => {
            setOpenEdit(false);
            setEditProduct(null);
          }}
        />
      )}
      {openDelete && deleteProduct && (
        <BoxDelete
          product={deleteProduct}
          onDelete={handleDelete}
          onCancel={() => {
            setOpenDelete(false);
            setDeleteProduct(null);
          }}
        />
      )}
    </div>
  );
}