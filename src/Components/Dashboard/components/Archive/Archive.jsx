import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';


export default function Archive() {
  const [status, setStatus] = useState('archive');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)

  const getOrders = async () => {
    setLoading(true)
    try {
      const response = await $api.get(`${status}`);
      setData(response?.data?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getOrders();
  }, []);



  if (loading) {
    return (
      <div className="mx-auto  pb-24 min-h-screen p-4">
        <div className="mb-6 p-4 bg-white h-[100%] rounded-lg shadow  ">
          <div className="flex items-center justify-center h-screen ">
            <ReactLoading type="spinningBubbles" color="black" height={80} width={80} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[100%] mt-[60px] pb-24 min-h-screen p-4">
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{ mt: 2, mb: 3, fontWeight: 'bold' }}
      >
        Buyurtmalar Arxiv
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        {data?.length <= 0 ? (
          <>
            <div className="mx-auto min-h-screen mt-4">
              <div className="mb-6 p-4 h-[100%] rounded-lg   ">
                <div className="flex flex-col items-center justify-center h-screen text-center px-4">
                  <div className="text-gray-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2"> Ma'lumot topilmadi</h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Hozircha hali ma'lumot yo‘q, iltimos, keyinroq urinib korishni so‘raymiz.
                  </p>
                </div>
              </div>
            </div >
          </>
        ) : (
          <Table sx={{ minWidth: 550 }} aria-label="archive table">
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Mijoz Ismi</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Telefon</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Xizmat</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Narxi</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Sana</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((order, index) => {
                const user = order?.data;
                const service = user?.services?.[0];
                return (
                  <TableRow key={order.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user?.user_name || '-'}</TableCell>
                    <TableCell>{user?.user_phone || '-'}</TableCell>
                    <TableCell>{service?.name_uz || '-'}</TableCell>
                    <TableCell>
                      {service?.price
                        ? `${Number(service.price).toLocaleString()} so'm`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {user?.booking_time
                        ? new Date(user.booking_time).toLocaleString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </div>
  );
}
