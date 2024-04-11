import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 8,
  p: 4,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  borderRadius: "8px",
};

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InfoModal({ open, setOpen }: Props) {
  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("modal", "modal");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h4"
          component="h2"
          sx={{ fontWeight: 600 }}
        >
          Welcome!!
        </Typography>
        <Typography
          id="modal-modal-description"
          sx={{ m: 2, textAlign: "center" }}
        >
          Search for your city using the search bar at the top, clicking on the
          name of the city will take you to weather summary page for that
          city.Right Clicking the name will open up a new tab.
        </Typography>
        <Button variant="contained" onClick={handleClose}>
          Continue
        </Button>
      </Box>
    </Modal>
  );
}
