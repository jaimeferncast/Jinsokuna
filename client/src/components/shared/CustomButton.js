import { useContext } from "react"

import styled from "styled-components"

import { Button } from "@material-ui/core"

import ThemeContext from "../../ThemeContext"

const StyledButton = styled(Button)`
  border: 2px solid ${props => props.variant === "outlined"
    ? props.palette.primary.main
    : "rgba(0,0,0,0)"};
  padding: 5px 15px;
  ${props => props.width && "width: " + props.width + ";"};
  ${props => props.color && "color: " + props.color + ";"};
`

function CustomButton(props) {
  const { palette } = useContext(ThemeContext)

  return (
    <StyledButton palette={palette} {...props}>
      {props.children}
    </StyledButton>
  )
}

export default CustomButton