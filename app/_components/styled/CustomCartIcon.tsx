import React from 'react';
import { styled } from '@mui/material';
import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Cart } from '../types/OrderFormData';

const CustomCartIconRoot = styled(Box, {
  name: "CustomCartIcon",
  slot: "root"
})(({ theme }) => ({
  position: "relative"
})) as typeof Box

const CartIcon = styled(ShoppingCartIcon, {
  name: "CustomCartIcon",
  slot: "icon"
})(({ theme }) => ({
  position: "relative",
  zIndex: -1
}))

const CounterDiv = styled("div", {
  name: "CustomCartIcon",
  slot: "counter"
})(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: 0,
  height: "0.75rem",
  width: "0.75rem",
  borderRadius: "50%",
  background: theme.palette.info.main
}))

const Count = styled(Typography, {
  name: "CustomCartIcon",
  slot: "count"
})(({ theme }) => ({
  fontSize: "0.6rem",
  zIndex: 10,
  paddingLeft: "1px",
  mx: "auto",
  my: "auto"
}))

interface CustomCartIconProps {
  cart: Cart
}

const CustomCartIcon = React.forwardRef(function CustomCartIcon(props: CustomCartIconProps) {

  const { cart, ...other } = props;

  const cartCount = cart.cartItems.length;

  return (
    <CustomCartIconRoot {...other}>
      {!!cartCount &&
        <CounterDiv >
          <Count>
            {cartCount === 0 ? "" : cartCount}
          </Count>
        </CounterDiv>
      }
      <CartIcon />
    </CustomCartIconRoot>
  )

})

export default CustomCartIcon