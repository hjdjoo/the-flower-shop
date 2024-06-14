import { styled } from "@mui/material";

import Image from "next/image";

// import { createTheme } from "@mui/material";
import { CssTransition } from "@mui/base/Transitions"
import ButtonBase from "@mui/material/Button";

import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material";


export const BannerButton = styled(ButtonBase)(({ theme }) => ({
  maxHeight: "6%",
  maxWidth: "60%",
  color: "white",
  marginBottom: "15px",
  position: "absolute",
  textTransform: "none",
  [theme.breakpoints.between("xs", "sm")]: {
    height: "5%",
    fontSize: "0.6rem"
  },
  [theme.breakpoints.between("sm", "md")]: {
    height: "6%",
    fontSize: "0.8rem"
  },
  [theme.breakpoints.between("md", "lg")]: {
    height: "8%",
    fontSize: "0.9rem"
  },
  [theme.breakpoints.up("lg")]: {
    height: "8%",
    fontSize: "1rem"
  },
}))

export const BannerStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`&.${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main
    }
  },
  [`&.${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.info.main
  },
}))

export const BannerStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
  color: theme.palette.info.main,
  height: 25,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ...(ownerState.active && {
    color: theme.palette.primary.main
  }),
  "& .BannerStepIcon-circle-active": {
    width: 12,
    height: 12,
    backgroundColor: theme.palette.info.main,
    borderRadius: "50%",
    [theme.breakpoints.between("xs", "md")]: {
      width: 8,
      height: 8,
    },
    [theme.breakpoints.between("md", "lg")]: {
      width: 10,
      height: 10,
    },
    [theme.breakpoints.up("lg")]: {
      width: 12,
      height: 12,
    },
  },
  "& .BannerStepIcon-circle": {

    backgroundColor: "#E8E8E8",
    borderRadius: "50%",
    [theme.breakpoints.between("xs", "md")]: {
      width: 5,
      height: 5,
    },
    [theme.breakpoints.between("md", "lg")]: {
      width: 6,
      height: 6,
    },
    [theme.breakpoints.up("lg")]: {
      width: 7,
      height: 7,
    },
  }
}))

export const BannerStepIcon = (props: StepIconProps) => {
  const { active, className } = props;

  return (
    <BannerStepIconRoot ownerState={{ active }} className={className}>
      {active ? (
        <div className="BannerStepIcon-circle-active"></div>
      ) : (
        <div className="BannerStepIcon-circle"></div>
      )
      }
    </BannerStepIconRoot>
  )

}
