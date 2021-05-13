import { Component } from 'react'

import styled from "styled-components"

import {
  Modal,
  Backdrop,
  Fade,
  Grid,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from "@material-ui/core"

const ProductModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`
const Form = styled.form`
  background-color: white;
  border: 2px solid #000;
  box-shadow: 4px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%);
  padding: 24px 24px 0;
  max-width: 580px;
  width: 90%;
  display: flex;
  flex-direction: column;
  & > * {
    margin-bottom: 24px;
  }
`

class ProductForm extends Component {
  constructor(props) {
    super()
  }

  componentDidMount = () => {
    this.props.product
      ? this.setState({ product: this.props.product })
      : this.setState({ product: { category: this.props.category, allergies: [] } })
  }

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState({ product: { ...this.state.product, [name]: value } })
  }

  handleCheckboxChange = (e) => {
    const allergies = this.state.product.allergies ? [...this.state.product.allergies] : []
    e.target.checked
      ? allergies.push(e.target.name)
      : allergies.splice(allergies.findIndex(elm => elm === e.target.name), 1)
    this.setState({ product: { ...this.state.product, allergies } })
  }

  render() {
    return (
      <ProductModal
        open={this.props.open}
        onClose={this.props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={this.props.open}>
          <Form autoComplete="off" onSubmit={(e) => this.props.submitForm(e, this.state.product)}>
            {this.state &&
              <>
                <TextField
                  required
                  autoFocus
                  variant="outlined"
                  name="name"
                  label="Nombre del producto"
                  type="text"
                  value={this.state.product.name ? this.state.product.name : ""}
                  onChange={this.handleInputChange}
                />
                <TextField
                  name="description"
                  label="Descripción"
                  type="text"
                  multiline
                  value={this.state.product.description ? this.state.product.description : ""}
                  onChange={this.handleInputChange}
                />
                <FormControl component="fieldset" margin="normal">
                  <FormLabel component="legend">Alérgenos</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={<Checkbox
                        checked={this.state.product.allergies?.some(elm => elm === "Gluten")}
                        onChange={this.handleCheckboxChange}
                        name="Gluten" />}
                      label="Gluten"
                    />
                    <FormControlLabel
                      control={<Checkbox
                        checked={this.state.product.allergies?.some(elm => elm === "Crustáceos")}
                        onChange={this.handleCheckboxChange}
                        name="Crustáceos" />}
                      label="Crustáceos"
                    />
                    <FormControlLabel
                      control={<Checkbox
                        checked={this.state.product.allergies?.some(elm => elm === "Huevos")}
                        onChange={this.handleCheckboxChange}
                        name="Huevos" />}
                      label="Huevos"
                    />
                    <FormControlLabel
                      control={<Checkbox
                        checked={this.state.product.allergies?.some(elm => elm === "Apio")}
                        onChange={this.handleCheckboxChange}
                        name="Apio" />}
                      label="Apio"
                    />
                    <FormControlLabel
                      control={<Checkbox
                        checked={this.state.product.allergies?.some(elm => elm === "Sulfitos")}
                        onChange={this.handleCheckboxChange}
                        name="Sulfitos" />}
                      label="Sulfitos"
                    />
                    <FormControlLabel
                      control={<Checkbox
                        checked={this.state.product.allergies?.some(elm => elm === "Lácteos")}
                        onChange={this.handleCheckboxChange}
                        name="Lácteos" />}
                      label="Lácteos"
                    />
                    <FormControlLabel
                      control={<Checkbox
                        checked={this.state.product.allergies?.some(elm => elm === "Cacahuetes")}
                        onChange={this.handleCheckboxChange}
                        name="Cacahuetes" />}
                      label="Cacahuetes"
                    />
                    <FormControlLabel
                      control={<Checkbox
                        checked={this.state.product.allergies?.some(elm => elm === "Mostaza")}
                        onChange={this.handleCheckboxChange}
                        name="Mostaza" />}
                      label="Mostaza"
                    />
                    <FormControlLabel
                      control={<Checkbox
                        checked={this.state.product.allergies?.some(elm => elm === "Frutos de cáscara")}
                        onChange={this.handleCheckboxChange}
                        name="Frutos de cáscara" />}
                      label="Frutos de cáscara"
                    />
                    <FormControlLabel
                      control={<Checkbox
                        checked={this.state.product.allergies?.some(elm => elm === "Granos de sésamo")}
                        onChange={this.handleCheckboxChange}
                        name="Granos de sésamo" />}
                      label="Granos de sésamo"
                    />
                    <FormControlLabel
                      control={<Checkbox
                        checked={this.state.product.allergies?.some(elm => elm === "Soja")}
                        onChange={this.handleCheckboxChange}
                        name="Soja" />}
                      label="Soja"
                    />
                    <FormControlLabel
                      control={<Checkbox
                        checked={this.state.product.allergies?.some(elm => elm === "Moluscos")}
                        onChange={this.handleCheckboxChange}
                        name="Moluscos" />}
                      label="Moluscos"
                    />
                    <FormControlLabel
                      control={<Checkbox
                        checked={this.state.product.allergies?.some(elm => elm === "Altramuces")}
                        onChange={this.handleCheckboxChange}
                        name="Altramuces" />}
                      label="Altramuces"
                    />
                  </FormGroup>
                </FormControl>
                <Grid container justify="space-between" alignItems="flex-end">
                  <TextField
                    required
                    variant="outlined"
                    name="price"
                    label="Precio"
                    type="number"
                    InputProps={{ startAdornment: <InputAdornment position="start">€</InputAdornment> }}
                    value={this.state.product.price ? this.state.product.price : ""}
                    onChange={this.handleInputChange}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    guardar cambios
                </Button>
                </Grid>
              </>
            }
          </Form>
        </Fade>
      </ProductModal>
    )
  }
}

export default ProductForm
