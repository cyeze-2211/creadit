import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactLoading from 'react-loading';
import {
  Card,
  CardBody,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import BoxCreate from "./BoxCreate";
import BoxEdit from "./BoxEdit";
import BoxDelete from "./BoxDelete";
import { NavLink } from "react-router-dom";
import EmptyState from "../../../EmptyState";

export default function Box() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products', {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
  
      const formattedProducts = response.data.data.map(product => {
  let fixedImage = product.image;

  // Agar localhost bo‘lsa nasiyapos.uz ga o‘zgartiramiz
  if (fixedImage?.includes("http://localhost")) {
    fixedImage = fixedImage.replace(
      "http://localhost",
      "https://nasiyapos.uz"
    );
  }

  return {
    id: product.id,
    name: product.product_name,
    image: fixedImage, // ✅ tozalangan rasm url
    price: parseFloat(product.price),
    months: parseInt(product.monthly_payment.replace('-oy', '')) || 12,
    monthly: parseFloat(product.Installment.replace('$', '')) || 0,
  };
});

        
        setProducts(formattedProducts);
        setError(null);
      } catch (err) {
        console.error('Mahsulotlarni olishda xatolik:', err);
        setError('Mahsulotlarni yuklab olishda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCreate = (product) => {
    setProducts((prev) => [
      ...prev,
      { ...product, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
    ]);
    setOpenCreate(false);
  };

  const handleEdit = (product) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === product.id ? product : item))
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
       <div className="min-h-screen mt-[90px] mb-[20px] px-4">
      <div className="flex justify-center items-center h-64">
        <ReactLoading type="spin" color="#4CAF50" height={100} width={100} />
      </div>
    </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mt-[90px] mb-[20px] px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Typography variant="h5" className="text-red-500 mb-4">
              Xatolik
            </Typography>
            <Typography className="text-gray-600">
              {error}
            </Typography>
            <Button 
              color="green" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Qayta yuklash
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[90px] mb-[20px] px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Typography variant="h3" className="text-gray-900 font-bold">
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
      <div className="w-full mt-[20px] mb-[30px]">
        <input
          type="text"
          placeholder="Qidirish (nomi bo'yicha)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product) => (
      <NavLink to={`/product/${product.id}`} key={product.id}>
        <Card className="w-full bg-white rounded-3xl shadow-xl border border-gray-200 flex flex-col hover:shadow-2xl transition">
          <CardBody className="flex flex-col items-center p-4">
            <div className="w-full mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
            </div>
            <Typography
              variant="h6"
              className="text-gray-900 font-bold mb-2 text-center"
            >
              {product.name}
            </Typography>
            <div className="text-gray-800 text-sm mb-1">
              Narxi: <span className="font-semibold">{product.price} USD</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <IconButton
                variant="text"
                color="blue"
                onClick={(e) => { e.preventDefault(); handleEditOpen(product); }}
                size="sm"
              >
                <PencilIcon className="w-5 h-5" />
              </IconButton>
              <IconButton
                variant="text"
                color="red"
                onClick={(e) => { e.preventDefault(); handleDeleteOpen(product); }}
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