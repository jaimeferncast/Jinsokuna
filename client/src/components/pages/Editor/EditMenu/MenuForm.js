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
  padding-top: ${props => 30 + extraMargin(props.menus, props.type) * 48}px;
  & form {
    margin-bottom: 10px;
  }
`
const StyledForm = styled.form`
  width: 65%;
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
      <StyledForm onSubmit={(e) => submit(e, name)} autoComplete="off">
        <TextField
          fullWidth
          autoFocus={false}
          variant="outlined"
          size="small"
          label={`Nombre de${props.type === "carta" ? " la nueva" : "l nuevo"} ${props.type}`}
          type="text"
          value={name}
          onChange={handleChange}
        />
      </StyledForm>
      <CustomButton
        color="primary"
        onClick={(e) => submit(e, name)}
        startIcon={<AddBoxIcon />}
      >agregar {props.type}</CustomButton>
    </Container>
  )
}

export default MenuForm