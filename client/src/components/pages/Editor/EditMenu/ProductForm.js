import { Component } from 'react'

import styled from "styled-components"

import { Modal, Backdrop, Fade, Grid, TextField, Button } from "@material-ui/core"

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
  width: 500px;
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
      : this.setState({ product: { category: this.props.category } })
  }

  handleInputChange = (e) => {
    const { name, value } = e.target
    this.setState({ product: { ...this.state.product, [name]: value } })
  }

  handleCheckboxChange = (e) => {
    this.setState({ booking: { ...this.state.booking, [e.target.name]: !e.target.checked } })
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
                <Grid container justify="space-between" alignItems="flex-end">
                  <TextField
                    required
                    name="price"
                    label="Precio"
                    type="number"
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
