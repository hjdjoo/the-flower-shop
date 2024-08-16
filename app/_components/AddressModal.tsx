import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import AddressDisplay from "./AddressDisplay";
import { Address, OrderItem } from "../types/component-types/OrderFormData";
import { Dispatch, SetStateAction } from "react";

interface AddressModalProps {
  orderItem: OrderItem
  setOrderItem: Dispatch<SetStateAction<OrderItem>>
  modalOpen: boolean
  setModalOpen: Dispatch<SetStateAction<boolean>>
  newAddress: Address
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const typographyStyle = {

}

export default function AddressModal(props: AddressModalProps) {

  const { orderItem, setOrderItem, modalOpen, setModalOpen, newAddress } = props;

  return (
    <Modal open={modalOpen} onClose={() => { setModalOpen(false) }}>
      <Box sx={modalStyle}>
        <Box sx={{
          mb: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <Typography sx={{
            fontWeight: "650",
            mb: 2
          }}>We found the following address:</Typography>
          <AddressDisplay address={newAddress} />
        </Box>
        <Button
          variant="outlined"
          onClick={() => {
            setOrderItem({ ...orderItem, recipAddress: newAddress });
            setModalOpen(false);
          }}
        >Use Validated Address
        </Button>
        <Typography sx={{ my: 1 }}>or</Typography>
        <Button
          variant="outlined"
          onClick={() => { setModalOpen(false); }}
        >Use Original Address
        </Button>
      </Box>
    </Modal>
  )
}