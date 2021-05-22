import styled from "styled-components"

import { Button } from "@material-ui/core"

const StyledButton = styled(Button)`
  color: ${props => props.theme.palette.sophisticated.light};
  border: 1px solid ${props => props.variant === "outlined"
    ? props.theme.palette.sophisticated.primary
    : "rgba(0,0,0,0)"};
  background-color: ${props => props.variant === "filled" && props.theme.palette.sophisticated.primary};
  &:hover {
    background-color: ${props => props.variant === "filled" && props.theme.palette.sophisticated.primaryLight};
  }
`

function CustomButton(props) {
  return (
    <StyledButton {...props}>
      {props.children}
    </StyledButton>
  )
}

export default CustomButton