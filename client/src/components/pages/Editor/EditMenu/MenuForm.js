import { useState } from "react"

import styled from "styled-components"

import { TextField } from "@material-ui/core"
import AddBoxIcon from "@material-ui/icons/AddBox"

import CustomButton from "../../../shared/CustomButton"

import { extraMargin } from "../../../../utils"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${props => 40 + extraMargin(props.menus, props.type) * 48}px;
  & form {
    margin-bottom: 10px;
  }
`

function MenuForm(props) {
  const [name, setName] = useState("")
  const handleChange = (e) => setName(e.target.value)
  const submit = (e, name) => {
    props.addMenu(e, { name })
    setName("")
  }

  return (
    <Container menus={props.menus} type={props.type}>
      <form onSubmit={(e) => submit(e, name)} autoComplete="off">
        <TextField
          fullWidth
          autoFocus={false}
          variant="outlined"
          size="small"
          label={`Nombre de nuev${props.type === "carta" ? "a" : "o"} ${props.type}`}
          type="text"
          value={name}
          onChange={handleChange}
        />
      </form>
      <CustomButton
        onClick={(e) => submit(e, name)}
        startIcon={<AddBoxIcon />}
      >agregar {props.type}</CustomButton>
    </Container>
  )
}

export default MenuForm