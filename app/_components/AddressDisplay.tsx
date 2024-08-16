import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { Address } from "../types/component-types/OrderFormData"
import { SxProps } from "@mui/material"

interface AddressDisplayProps {
  address: Address
  typographyStyle?: SxProps

}

export default function AddressDisplay(props: AddressDisplayProps) {

  const { address, typographyStyle } = props;

  return (
    <Box sx={{
      mb: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "end"
    }}>
      <Typography sx={typographyStyle}>{address.streetAddress1}</Typography>
      <Typography sx={typographyStyle}>{address.streetAddress2}</Typography>
      <Box display="flex">
        {!!address.townCity.length &&
          <>
            <Typography sx={{ ...typographyStyle, mx: 1 }}>{address.townCity}</Typography>
            <Typography sx={typographyStyle}>{address.state}</Typography>
          </>
        }
      </Box>
      <Typography sx={typographyStyle}>{address.zip}</Typography>
    </Box>
  )
}