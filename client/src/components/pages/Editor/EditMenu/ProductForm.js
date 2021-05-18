import { Component } from "react"

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
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"


const ProductModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`
const Form = styled.form`
  overflow-y: scroll;
  max-height: 98vh;
  background-color: white;
  border: 2px solid #000;
  box-shadow: 4px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%);
  padding: 24px 24px 0;
  max-width: 620px;
  width: 90%;
  display: flex;
  flex-direction: column;
  & > * {
    margin-bottom: 24px;
  }
`
const DeletePrice = styled(Grid)`
  height: 70px;
  display: flex;
  justify-content: center;
`

class ProductForm extends Component {
  constructor(props) {
    super()

    this.state = {
      product: props.product,
    }
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

  handlePriceChange = (e, index) => {
    const { name, value } = e.target
    const price = this.state.product.price ? [...this.state.product.price] : [{}]
    price[index][name] = value
    this.setState({ product: { ...this.state.product, price } })
  }

  addPrice = () => {
    const price = [...this.state.product.price]
    if (price[price.length - 1].subDescription) {
      price.push({ subDescription: "", subPrice: 0 })
      this.setState({ product: { ...this.state.product, price } })
    } else alert('Debes rellenar el campo descriptivo del precio existente antes de agregar otro precio.')
  }

  deletePrice = (i) => {
    const price = [...this.state.product.price]
    price.splice(i, 1)
    this.setState({ product: { ...this.state.product, price } })
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
            {this.state.product.price.map((price, index) => {
              return (
                <Grid
                  key={index}
                  container
                  justify="space-between"
                  alignItems="space-between"
                  style={{ margin: '12px 0 0' }}
                >
                  <Grid item xs={7}>
                    <TextField
                      fullWidth
                      name="subDescription"
                      label="Cantidad o ración"
                      type="text"
                      helperText="media ración o ración entera, copa de vino o botella, etc."
                      value={price.subDescription ? price.subDescription : ""}
                      onChange={(e) => this.handlePriceChange(e, index)}
                    />
                  </Grid>
                  <Grid item xs={3} style={{ margin: '5px 0 -5px 20px' }}>
                    <TextField
                      required
                      variant="outlined"
                      name="subPrice"
                      label="Precio"
                      type="number"
                      InputProps={{ startAdornment: <InputAdornment position="start">€</InputAdornment> }}
                      value={price.subPrice}
                      onChange={(e) => this.handlePriceChange(e, index)}
                    />
                  </Grid>
                  <DeletePrice item xs={1}>
                    <Button
                      style={{ minWidth: '0', padding: '5px 12px 5px 0' }}
                      onClick={() => this.deletePrice(index)}
                      color="secondary"
                      endIcon={<DeleteForeverIcon style={{ fontSize: '25px' }} />}
                    ></Button>
                  </DeletePrice>
                </Grid>
              )
            })}
            <Grid container justify="flex-start" style={{ margin: '12px 0 32px' }}>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={this.addPrice}
              >
                agregar precio
                </Button>
            </Grid>
            <FormControl component="fieldset">
              <FormLabel component="legend" style={{ fontSize: '0.8rem' }}>Contiene</FormLabel>
              <FormGroup row style={{ paddingLeft: '6px' }}>
                <Grid container justify="space-between">
                  <FormControlLabel
                    control={<Checkbox
                      size="small"
                      checked={this.state.product.allergies?.some(elm => elm === "Gluten")}
                      onChange={this.handleCheckboxChange}
                      name="Gluten" />}
                    label="Gluten"
                  />
                  <FormControlLabel
                    control={<Checkbox
                      size="small"
                      checked={this.state.product.allergies?.some(elm => elm === "Crustáceos")}
                      onChange={this.handleCheckboxChange}
                      name="Crustáceos" />}
                    label="Crustáceos"
                  />
                  <FormControlLabel
                    control={<Checkbox
                      size="small"
                      checked={this.state.product.allergies?.some(elm => elm === "Huevos")}
                      onChange={this.handleCheckboxChange}
                      name="Huevos" />}
                    label="Huevos"
                  />
                  <FormControlLabel
                    control={<Checkbox
                      size="small"
                      checked={this.state.product.allergies?.some(elm => elm === "Apio")}
                      onChange={this.handleCheckboxChange}
                      name="Apio" />}
                    label="Apio"
                  />
                  <FormControlLabel
                    control={<Checkbox
                      size="small"
                      checked={this.state.product.allergies?.some(elm => elm === "Sulfitos")}
                      onChange={this.handleCheckboxChange}
                      name="Sulfitos" />}
                    label="Sulfitos"
                  />
                </Grid>
                <Grid container justify="space-between">
                  <FormControlLabel
                    control={<Checkbox
                      size="small"
                      checked={this.state.product.allergies?.some(elm => elm === "Lácteos")}
                      onChange={this.handleCheckboxChange}
                      name="Lácteos" />}
                    label="Lácteos"
                  />
                  <FormControlLabel
                    control={<Checkbox
                      size="small"
                      checked={this.state.product.allergies?.some(elm => elm === "Cacahuetes")}
                      onChange={this.handleCheckboxChange}
                      name="Cacahuetes" />}
                    label="Cacahuetes"
                  />
                  <FormControlLabel
                    control={<Checkbox
                      size="small"
                      checked={this.state.product.allergies?.some(elm => elm === "Mostaza")}
                      onChange={this.handleCheckboxChange}
                      name="Mostaza" />}
                    label="Mostaza"
                  />
                  <FormControlLabel
                    control={<Checkbox
                      size="small"
                      checked={this.state.product.allergies?.some(elm => elm === "Frutos de cáscara")}
                      onChange={this.handleCheckboxChange}
                      name="Frutos de cáscara" />}
                    label="Frutos de cáscara"
                  />
                </Grid>
                <Grid container justify="space-between">
                  <FormControlLabel
                    control={<Checkbox
                      size="small"
                      checked={this.state.product.allergies?.some(elm => elm === "Granos de sésamo")}
                      onChange={this.handleCheckboxChange}
                      name="Granos de sésamo" />}
                    label="Granos de sésamo"
                  />
                  <FormControlLabel
                    control={<Checkbox
                      size="small"
                      checked={this.state.product.allergies?.some(elm => elm === "Soja")}
                      onChange={this.handleCheckboxChange}
                      name="Soja" />}
                    label="Soja"
                  />
                  <FormControlLabel
                    control={<Checkbox
                      size="small"
                      checked={this.state.product.allergies?.some(elm => elm === "Moluscos")}
                      onChange={this.handleCheckboxChange}
                      name="Moluscos" />}
                    label="Moluscos"
                  />
                  <FormControlLabel
                    control={<Checkbox
                      size="small"
                      checked={this.state.product.allergies?.some(elm => elm === "Altramuces")}
                      onChange={this.handleCheckboxChange}
                      name="Altramuces" />}
                    label="Altramuces"
                  />
                </Grid>
              </FormGroup>
            </FormControl>
            <Grid container justify="center">
              <Button
                variant="contained"
                color="primary"
                type="submit"
              >
                guardar
                </Button>
            </Grid>
          </Form>
        </Fade>
      </ProductModal>
    )
  }
}

export default ProductForm
