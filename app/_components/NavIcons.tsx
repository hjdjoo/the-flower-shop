import Link from 'next/link';

import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import signOut from "@/utils/supabase/signOut";

interface NavIconsProps {
  userRole: string
}

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  [theme.breakpoints.between('xs', 'md')]: {
    fontSize: "0.8rem"
  },
  [theme.breakpoints.up('md')]: {
    fontSize: "1rem"
  }
}))

export function NavIcons(props: NavIconsProps) {
  const { userRole } = props;
  return (
    <>
      {userRole === "admin" &&
        <StyledIconButton>
          <Link href={"/admin"}>
            <SettingsApplicationsIcon
              sx={{
                marginTop: "5px",
                color: "white",
              }}
            // onClick={ }
            >
            </SettingsApplicationsIcon>
          </Link>
        </StyledIconButton>
      }
      <StyledIconButton>
        <Link href={userRole !== "guest" ? '/account' : '/signin'}>
          <PersonIcon
            sx={{
              marginTop: "5px",
              color: "white",
            }}
          >
          </PersonIcon>
        </Link>
      </StyledIconButton>
      <StyledIconButton>
        <Link href={'/checkout'}>
          <ShoppingCartIcon
            sx={{
              color: "white"
            }} 
          />
        </Link>
      </StyledIconButton>
      <StyledIconButton
        onClick={() => signOut()}
      >
        <LogoutIcon
          sx={{
            color: "white"
          }}>
        </LogoutIcon>
      </StyledIconButton>

    </>
  )

}