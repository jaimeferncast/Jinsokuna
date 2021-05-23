import { useContext } from "react"

import styled from "styled-components"

import { Button } from "@material-ui/core"

import ThemeContext from "../../ThemeContext"

const StyledButton = styled(Button)`
  font-family: ${props => props.font};
  color: ${props => props.palette.light};
  border: 2px solid ${props => props.type === "outlined"
    ? props.palette.primary.main
    : "rgba(0,0,0,0)"};
  background-color: ${props => props.type === "filled" && props.palette.primary.main};
  &:hover {
    background-color: ${props => props.type === "filled" && props.palette.primaryLight};
  }
  padding: 5px 15px;
`

function CustomButton(props) {
  const { palette, font } = useContext(ThemeContext)

  return (
    <StyledButton palette={palette} font={font} {...props}>
      {props.children}
    </StyledButton>
  )
}

export default CustomButton