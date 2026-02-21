import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box
} from "@mui/material";
import { useEffect, useState } from "react";
import API from "../api";
import TourModal from "../components/TourModal";

export default function ManageTours() {
  const [tours, setTours] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  const fetchTours = () => {
    API.get("/tours").then(res => setTours(res.data));
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const deleteTour = async (id) => {
    if (!window.confirm("Delete this tour?")) return;
    await API.delete(`/tours/${id}`);
    fetchTours();
  };

  const openAdd = () => {
    setSelectedTour(null);
    setModalOpen(true);
  };

  const openEdit = (tour) => {
    setSelectedTour(tour);
    setModalOpen(true);
  };

  const saveTour = async (formData) => {
    try {
      if (selectedTour) {
        await API.put(`/tours/${selectedTour._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await API.post("/tours", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setModalOpen(false);
      fetchTours();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving tour");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
	  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Manage Tours</Typography>
        <Button variant="contained" onClick={openAdd}>Add New Tour</Button>
      </Box>
      <Box sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Person</TableCell>
              <TableCell sx={{ textDecoration: "line-through", color: "gray" }}>Actual Price</TableCell>
              <TableCell sx={{ color: "red", fontWeight: "bold" }}>Discount Price</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tours.map((t) => (
              <TableRow key={t._id}>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.location}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>{t.days}</TableCell>
                <TableCell>{t.person}</TableCell>
                <TableCell sx={{ textDecoration: "line-through", color: "gray" }}>₹{t.actualPrice}</TableCell>
                <TableCell sx={{ color: "red", fontWeight: "bold" }}>₹{t.discountPrice}</TableCell>
                <TableCell>{t.date}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1, flexDirection: { xs: "column", sm: "row" } }}>
                    <Button color="primary" onClick={() => openEdit(t)}>Edit</Button>
                    <Button color="error" onClick={() => deleteTour(t._id)}>Delete</Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <TourModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        handleSave={saveTour}
        selectedTour={selectedTour}
      />
    </Container>
  );
}
