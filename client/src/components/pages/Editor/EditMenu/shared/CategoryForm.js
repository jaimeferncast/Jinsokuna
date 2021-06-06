import { useState } from "react"

import styled from "styled-components"

import { Grid, TextField } from "@material-ui/core"
import AddBoxIcon from "@material-ui/icons/AddBox"

import CustomButton from "../../../../shared/CustomButton"

const CategoryContainer = styled.div`
  margin: 28px 0 35px;
  width: 100%;
  max-width: 548px;
`

function CategoryForm(props) {
  const { addCategory } = props
  const [name, setName] = useState("")
  const handleChange = (e) => setName(e.target.value)
  const submit = (e, name) => {
    addCategory(e, name)
    setName("")
  }

  return (
    <CategoryContainer>
      <Grid container justify="space-between" alignItems="center" spacing={3}>
        <Grid item xs={12} sm={6}>
          <form onSubmit={(e) => submit(e, name)} autoComplete="off">
            <TextField
              fullWidth
              autoFocus={false}
              variant="outlined"
              size="small"
              label="Nombre de nueva categoría"
              type="text"
              value={name}
              onChange={handleChange}
            />
          </form>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container justify="flex-end">
            <CustomButton
              onClick={(e) => submit(e, name)}
              startIcon={<AddBoxIcon />}
            >agregar categoría</CustomButton>
          </Grid>
        </Grid>
      </Grid>
    </CategoryContainer>
  )
}

export default CategoryForm