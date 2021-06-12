import { useState } from "react"

import styled from "styled-components"

import { TextField } from "@material-ui/core"
import AddBoxIcon from "@material-ui/icons/AddBox"

import CustomButton from "../../../shared/CustomButton"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
  & form {
    margin-bottom: 10px;
  }
`
const StyledForm = styled.form`
  width: 100%;
`
const Button = styled(CustomButton)`
  padding: 5px 10px;
  font-size: 0.8rem;
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
      <StyledForm onSubmit={(e) => submit(e, name)} autoComplete="off">
        <TextField
          fullWidth
          autoFocus={false}
          variant="outlined"
          size="small"
          label={`Nombre`}
          type="text"
          value={name}
          onChange={handleChange}
        />
      </StyledForm>
      <Button
        color="primary"
        onClick={(e) => submit(e, name)}
        startIcon={<AddBoxIcon />}
      >{props.type === "carta" ? "nueva carta" : "nuevo menú"}</Button>
    </Container>
  )
}

export default MenuForm