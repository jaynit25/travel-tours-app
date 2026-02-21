import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from "@mui/material";
import { useEffect, useState } from "react";

const categories = [
  { label: "Char Dham", value: "char_dham" },
  { label: "Amazing Weekend Getaways", value: "weekend" },
  { label: "Top Trending Trips", value: "trending" },
  { label: "Destinations", value: "destination" },
  { label: "Exclusive Offers", value: "exclusive" },
];

export default function TourModal({ open, handleClose, handleSave, selectedTour }) {
  const [form, setForm] = useState({
    title: "",
    location: "",
    category: "",
    actualPrice: "",
    discountPrice: "",
    imageFile: null,
    description: "",
    date: "",
    days: "",
    person: "",
  });

  // Load existing tour data for editing
  useEffect(() => {
    if (selectedTour) {
      setForm({
        ...selectedTour,
        imageFile: null, // keep current image path separate from new file
      });
    } else {
      setForm({
        title: "",
        location: "",
        category: "",
        actualPrice: "",
        discountPrice: "",
        imageFile: null,
        description: "",
        date: "",
        days: "",
        person: "",
      });
    }
  }, [selectedTour]);

  const submit = () => {
    const formData = new FormData();

   formData.append("title", form.title || "New Unnamed Tour");
    formData.append("location", form.location || "India");
    formData.append("category", form.category || "trending");
    
    // Default prices to "0" to avoid backend calculation errors
    formData.append("actualPrice", form.actualPrice || "0");
    formData.append("discountPrice", form.discountPrice || "0");
    
    formData.append("description", form.description || "No description provided.");
    
    // Default to today's date if empty
    const today = new Date().toISOString().split('T')[0];
    formData.append("date", form.date || today);

    // Default numeric values to "1"
    formData.append("days", form.days || "1");
    formData.append("person", form.person || "1");

    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }

    handleSave(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{selectedTour ? "Edit Tour" : "Add Tour"}</DialogTitle>

      <DialogContent sx={{ '& .MuiTextField-root': { mb: 2 } }}>

        <TextField
          label="Title"
          fullWidth
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <TextField
          label="Location"
          fullWidth
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <TextField
          label="Category"
          select
          fullWidth
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.value} value={cat.value}>
              {cat.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Actual Price"
          fullWidth
          type="number"
          value={form.actualPrice}
          onChange={(e) => setForm({ ...form, actualPrice: e.target.value })}
        />

        <TextField
          label="Discount Price"
          fullWidth
          type="number"
          value={form.discountPrice}
          onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
        />

        <TextField
          label="Days"
          fullWidth
          type="number"
          value={form.days}
          onChange={(e) => setForm({ ...form, days: e.target.value })}
        />

        <TextField
          label="Person"
          fullWidth
          type="number"
          value={form.person}
          onChange={(e) => setForm({ ...form, person: e.target.value })}
        />

        <TextField
          label="Upload Image"
          fullWidth
          type="file"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <TextField
          label="Date"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
