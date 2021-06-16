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
import AddBoxIcon from "@material-ui/icons/AddBox"

import ThemeContext from "../../../../../ThemeContext"
import DialogSelect from "../../../../shared/DialogSelect"
import Spinner from "../../../../shared/Spinner"

import { findCategoryIndex, filterMenusWithThisProduct } from "../../../../../utils"

const ProductModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`
const Form = styled.form`
  overflow-y: scroll;
  max-height: 85vh;
  background-color: ${props => props.palette.dark};
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
  .in-menu > span {
    font-size: 0.875rem;
  }
  .other-menus-label {
    font-size: 0.8rem;
    margin: 0 0 30px;
    text-align: center;
  }
  & label, input, span, button, p, legend {
    font-family: arial;
  }
`
const DeletePrice = styled(Grid)`
  height: 70px;
  display: flex;
  justify-content: center;
`
const PriceSubcontainer = styled(Grid)`
  @media (max-width: 599px) {
    margin: 10px 0 0 -20px;
  }

`
const MinPortions = styled(TextField)`
  width: 10em;
  margin-top: 1em;
  & input {
    padding-left: 3em;
    padding-top: 1em;
  }
`

class ProductForm extends Component {
  static contextType = ThemeContext

  constructor(props) {
    super()

    this.state = {
      product: props.product,
    }
  }

  componentDidMount = () => {
    this.setState({ showSpinner: false })
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
    } else this.props.showAlert("Debes rellenar el campo descriptivo del precio existente antes de agregar otro precio", "error", "bottom")
  }

  deletePrice = (i) => {
    const price = [...this.state.product.price]
    if (price.length > 1) {
      price.splice(i, 1)
      this.setState({ product: { ...this.state.product, price } })
    } else this.props.showAlert("Cada producto debe tener al menos un precio", "error", "bottom")
  }

  addCategory = async (id) => {
    const product = { ...this.state.product }
    const index = await findCategoryIndex(id)
    product.categories.push({ id, index })
    this.setState({ product })
  }

  changeIsMenuProduct = (e) => {
    const product = { ...this.state.product }
    product.isMenuProduct = e.target.checked
    this.setState({ product })
  }

  submitForm = (e, product) => {
    this.props.submitForm(e, product)
    this.setState({ showSpinner: true })
  }

  render() {
    const { palette } = this.context
    const otherMenus = filterMenusWithThisProduct(this.state.product, this.props.otherCategories, this.props.otherMenus)

    return (
      <ProductModal
        open={this.props.open}
        onClose={this.props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }
        }
      >
        <Fade in={this.props.open}>
          <Form
            palette={palette}
            autoComplete="off"
            onSubmit={(e) => this.submitForm(e, this.state.product)}
          >
            {this.state.showSpinner
              ? <Spinner margin="0" />
              : <>
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
                <MinPortions
                  size="small"
                  variant="outlined"
                  name="minPortions"
                  label="Raciones mínimas"
                  type="number"
                  value={this.state.product.minPortions}
                  onChange={(e) => this.handleInputChange(e)}
                />
                {this.state.product.price.map((price, index) => {
                  return (
                    <Grid
                      key={index}
                      container
                      justify="space-between"
                      style={{ margin: '12px 0 0' }}
                    >
                      <Grid item xs={12} sm={7}>
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
                      <Grid item xs={12} sm={5}>
                        <PriceSubcontainer container justify="space-between">
                          <Grid item xs={8} style={{ margin: '7px 0 -5px 30px' }}>
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
                              style={{ minWidth: '0', padding: '3px 18px 5px 0' }}
                              onClick={() => this.deletePrice(index)}
                              color="primary"
                              endIcon={<DeleteForeverIcon style={{ fontSize: '25px' }} />}
                            ></Button>
                          </DeletePrice>
                        </PriceSubcontainer>
                      </Grid>
                    </Grid>
                  )
                })}
                <Grid container justify="flex-start" style={{ margin: '12px 0 32px' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<AddBoxIcon />}
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
                          color="primary"
                          size="small"
                          checked={this.state.product.allergies?.some(elm => elm === "Gluten")}
                          onChange={this.handleCheckboxChange}
                          name="Gluten" />}
                        label="Gluten"
                      />
                      <FormControlLabel
                        control={<Checkbox
                          color="primary"
                          size="small"
                          checked={this.state.product.allergies?.some(elm => elm === "Crustáceos")}
                          onChange={this.handleCheckboxChange}
                          name="Crustáceos" />}
                        label="Crustáceos"
                      />
                      <FormControlLabel
                        control={<Checkbox
                          color="primary"
                          size="small"
                          checked={this.state.product.allergies?.some(elm => elm === "Huevos")}
                          onChange={this.handleCheckboxChange}
                          name="Huevos" />}
                        label="Huevos"
                      />
                      <FormControlLabel
                        control={<Checkbox
                          color="primary"
                          size="small"
                          checked={this.state.product.allergies?.some(elm => elm === "Apio")}
                          onChange={this.handleCheckboxChange}
                          name="Apio" />}
                        label="Apio"
                      />
                      <FormControlLabel
                        control={<Checkbox
                          color="primary"
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
                          color="primary"
                          size="small"
                          checked={this.state.product.allergies?.some(elm => elm === "Lácteos")}
                          onChange={this.handleCheckboxChange}
                          name="Lácteos" />}
                        label="Lácteos"
                      />
                      <FormControlLabel
                        control={<Checkbox
                          color="primary"
                          size="small"
                          checked={this.state.product.allergies?.some(elm => elm === "Cacahuetes")}
                          onChange={this.handleCheckboxChange}
                          name="Cacahuetes" />}
                        label="Cacahuetes"
                      />
                      <FormControlLabel
                        control={<Checkbox
                          color="primary"
                          size="small"
                          checked={this.state.product.allergies?.some(elm => elm === "Mostaza")}
                          onChange={this.handleCheckboxChange}
                          name="Mostaza" />}
                        label="Mostaza"
                      />
                      <FormControlLabel
                        control={<Checkbox
                          color="primary"
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
                          color="primary"
                          size="small"
                          checked={this.state.product.allergies?.some(elm => elm === "Granos de sésamo")}
                          onChange={this.handleCheckboxChange}
                          name="Granos de sésamo" />}
                        label="Granos de sésamo"
                      />
                      <FormControlLabel
                        control={<Checkbox
                          color="primary"
                          size="small"
                          checked={this.state.product.allergies?.some(elm => elm === "Soja")}
                          onChange={this.handleCheckboxChange}
                          name="Soja" />}
                        label="Soja"
                      />
                      <FormControlLabel
                        control={<Checkbox
                          color="primary"
                          size="small"
                          checked={this.state.product.allergies?.some(elm => elm === "Moluscos")}
                          onChange={this.handleCheckboxChange}
                          name="Moluscos" />}
                        label="Moluscos"
                      />
                      <FormControlLabel
                        control={<Checkbox
                          color="primary"
                          size="small"
                          checked={this.state.product.allergies?.some(elm => elm === "Altramuces")}
                          onChange={this.handleCheckboxChange}
                          name="Altramuces" />}
                        label="Altramuces"
                      />
                    </Grid>
                  </FormGroup>
                </FormControl>
                <Grid container justify="space-around" style={{ margin: '12px 0 0' }}>
                  <DialogSelect
                    addCategory={(id) => this.addCategory(id)}
                    otherMenus={otherMenus}
                    otherCategories={this.props.otherCategories}
                    product={this.state.product}
                    disabled={otherMenus.length ? false : true}
                  />
                  <FormControlLabel
                    disabled={this.state.product.isMenuProduct}
                    style={{ marginRight: "0" }}
                    className="in-menu"
                    label="DISPONIBLE EN MENÚS"
                    control={<Checkbox
                      size="small"
                      color="primary"
                      checked={this.state.product.isMenuProduct}
                      onChange={this.changeIsMenuProduct} />}
                  />
                </Grid>
                <FormLabel component="legend" className="other-menus-label">
                  {this.props.otherMenus &&
                    "Usa estas opciones para reusar este producto en otras cartas o menús"
                  }
                </FormLabel>
                <Grid container justify="center">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    guardar
                </Button>
                </Grid>
              </>
            }
          </Form>
        </Fade>
      </ProductModal >
    )
  }
}

export default ProductForm
