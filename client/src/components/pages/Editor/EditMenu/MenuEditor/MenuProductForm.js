import { useState } from "react"

import styled from "styled-components"

import { Grid, TextField } from "@material-ui/core"
import AddBoxIcon from "@material-ui/icons/AddBox"

import CustomButton from "../../../../shared/CustomButton"

const FormContainer = styled(Grid)`
  margin: 10px 0 5px -5px;
  & form {
    transform: scale(0.9);
  }
`

function MenuProductForm(props) {
  const { addMenuProduct } = props
  const [name, setName] = useState("")
  const handleChange = (e) => setName(e.target.value)
  const submit = (e, name) => {
    addMenuProduct(e, name)
    setName("")
  }

  return (
    <FormContainer container justify="flex-start" alignItems="center">
      <Grid item xs={6}>
        <form onSubmit={(e) => submit(e, name)} autoComplete="off">
          <TextField
            fullWidth
            autoFocus={false}
            variant="outlined"
            size="small"
            label="Nombre"
            type="text"
            value={name}
            onChange={handleChange}
          />
        </form>
      </Grid>
      <Grid item xs={6}>
        <Grid container justify="flex-start">
          <CustomButton
            size="small"
            color="primary"
            onClick={(e) => submit(e, name)}
            startIcon={<AddBoxIcon />}
          >Nuevo producto</CustomButton>
        </Grid>
      </Grid>
    </FormContainer>
  )
}

export default MenuProductForm