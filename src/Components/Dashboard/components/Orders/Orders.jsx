import React, { useState, useEffect } from "react";
import ReactLoading from 'react-loading';

import {
  Card,
  CardBody,
  Typography,
  Button,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import axios from "axios";
import OrderCreate from "./OrderCreate";
import OrderEdit from "./OrderEdit";
import OrderDelete from "./OrderDelete";

function formatDate(date) {
  if (!date || date === "null" || date === null) return "-";
  const d = new Date(date);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("uz-UZ");
}

export default function ClientOrders() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 20;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOrderCreate, setShowOrderCreate] = useState(false);
  const [showOrderEdit, setShowOrderEdit] = useState(false);
  const [showOrderDelete, setShowOrderDelete] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get("/api/customers", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        if (res.data?.data) {
          setClients(res.data.data);
        } else {
          setClients([]);
          setError("Mijozlar topilmadi");
        }
      })
      .catch((err) => {
        setError(
          "Serverdan xatolik: " +
            (err.response?.data?.message || "Noma'lum xatolik")
        );
        setClients([]);
        console.error("API xatosi:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const lastIndex = currentPage * clientsPerPage;
  const firstIndex = lastIndex - clientsPerPage;
  const currentClients = filteredClients.slice(firstIndex, lastIndex);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading) {
    return (
       <div className="min-h-screen mt-[90px] mb-[20px] px-4">
          <div className="flex justify-center items-center mx-auto h-64">
            <ReactLoading type="spin" color="#4CAF50" height={100} width={100} />
          </div>
        </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="mt-[90px] pb-[20px]">
      <Card className="bg-white rounded-2xl shadow-xl">
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h5" className="text-gray-900 font-bold">
              Mijozlar ro'yxati
            </Typography>
            <Button
              color="green"
              className="flex items-center gap-2"
              size="sm"
              onClick={() => setShowOrderCreate(true)}
            >
              <PlusIcon className="w-5 h-5" />
              Yangi mijoz
            </Button>
          </div>

          <div className="mb-4">
            <Input
              label="Qidirish (Ism yoki telefon)"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    #
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    F.I.O
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Telefon
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Tug'ilgan sana
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Ro'yxatga olingan
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentClients.map((client, idx) => (
                  <tr key={client.id} className="hover:bg-gray-100 transition">
                    <td className="px-4 py-2 text-gray-900">
                      {firstIndex + idx + 1}
                    </td>
                    <td className="px-4 py-2 text-gray-900">
                      <NavLink
                        to={`/client/profil/${client.id}`}
                        className={`text-blue-500`}
                      >
                        {client.fullName || client.name}
                      </NavLink>
                    </td>
                    <td className="px-4 py-2 text-gray-900">{client.phone}</td>
                    <td className="px-4 py-2 text-gray-900">
                      {formatDate(client.data_of_birth)}
                    </td>
                    <td className="px-4 py-2 text-gray-900">
                      {formatDate(client.created_at)}
                    </td>
                    <td className="px-4 py-2 flex gap-1">
                      <IconButton
                        variant="text"
                        color="blue"
                        size="sm"
                        onClick={() => {
                          setSelectedClient(client);
                          setShowOrderEdit(true);
                        }}
                      >
                        <PencilIcon className="w-5 h-5" />
                      </IconButton>
                      <IconButton
                        variant="text"
                        color="red"
                        size="sm"
                        onClick={() => {
                          setSelectedClient(client);
                          setShowOrderDelete(true);
                        }}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <Typography variant="small" className="text-gray-600">
              Sahifa {currentPage} / {totalPages || 1}
            </Typography>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outlined"
                disabled={currentPage === 1}
                onClick={handlePrev}
                className="flex items-center gap-1"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Oldingi
              </Button>
              <Button
                size="sm"
                variant="outlined"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={handleNext}
                className="flex items-center gap-1"
              >
                Keyingi
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      {showOrderCreate && (
        <OrderCreate
          onCreate={() => setShowOrderCreate(false)}
          onCancel={() => setShowOrderCreate(false)}
        />
      )}
      {showOrderEdit && selectedClient && (
        <OrderEdit
          order={selectedClient}
          onEdit={() => {
            setShowOrderEdit(false);
            setSelectedClient(null);
          }}
          onCancel={() => {
            setShowOrderEdit(false);
            setSelectedClient(null);
          }}
        />
      )}
      {/* OrderDelete modal */}
      {showOrderDelete && selectedClient && (
        <OrderDelete
          order={selectedClient}
          onDelete={() => {
            setShowOrderDelete(false);
            setSelectedClient(null);
          }}
          onCancel={() => {
            setShowOrderDelete(false);
            setSelectedClient(null);
          }}
        />
      )}
    </div>
  );
}
