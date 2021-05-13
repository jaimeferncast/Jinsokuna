import { useState } from "react"

import styled from "styled-components"

import { Button, Grid, TextField } from "@material-ui/core"
import AddBoxIcon from "@material-ui/icons/AddBox"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const CategoryContainer = styled.div`
  margin: 28px;
  width: 90%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
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
    <Container>
      <CategoryContainer>
        <Grid container justify="space-between" alignItems="center">
          <form onSubmit={(e) => submit(e, name)} style={{ width: '50%' }} autoComplete="off">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              label="Categoría nueva"
              type="text"
              value={name}
              onChange={handleChange}
            />
          </form>
          <Button
            variant="contained"
            onClick={(e) => submit(e, name)}
            color="primary"
            startIcon={<AddBoxIcon />}
          >agregar categoría</Button>
        </Grid>
      </CategoryContainer>
    </Container>
  )
}

export default CategoryForm