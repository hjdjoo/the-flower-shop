import SenderInfo from "@/app/_components/SenderInfo";

import RecipientInfo from "@/app/_components/RecipientInfo";
import { Dispatch, SetStateAction } from "react";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";

import Typography from "@mui/material/Typography";

import { InputField } from "@/app/_components/styled/InputField";

import { OrderFormData } from "@/app/_components/types/OrderFormData";

interface CustomerOrderFormProps {
  setOrderInfo: Dispatch<SetStateAction<OrderFormData>>
}

export default function CustomerOrderForm(props: CustomerOrderFormProps) {

  const { setOrderInfo } = props;



  return (
    <Box>
      <Collapse>
        <Box>
          <Typography>{"When would you like them delivered?"}</Typography>
          <InputField
            id="delivery-date-input"
          />
        </Box>
      </Collapse>
      <Collapse>
        <Box>
          <Typography>{"Where's this going?"}</Typography>
          <InputField
            id="delivery-address-input"
          />
        </Box>
      </Collapse>
      <Collapse>
        <Box>
          <Typography>{"What would you like to say?"}</Typography>
          <InputField
            id=""
          />
        </Box>
      </Collapse>
    </Box>
  )

}