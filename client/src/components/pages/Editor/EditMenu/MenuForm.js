import { useState } from "react"

import styled from "styled-components"

import { TextField } from "@material-ui/core"
import AddBoxIcon from "@material-ui/icons/AddBox"

import CustomButton from "../../../shared/CustomButton"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
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
    <Container>
      <form onSubmit={(e) => submit(e, name)} autoComplete="off">
        <TextField
          fullWidth
          autoFocus={false}
          variant="outlined"
          size="small"
          label="Nombre de nueva carta"
          type="text"
          value={name}
          onChange={handleChange}
        />
      </form>
      <CustomButton
        onClick={(e) => submit(e, name)}
        startIcon={<AddBoxIcon />}
      >agregar carta</CustomButton>
    </Container>
  )
}

export default MenuForm