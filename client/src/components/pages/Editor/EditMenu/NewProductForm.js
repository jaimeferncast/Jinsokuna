import styled from "styled-components"

import { Modal, Backdrop, Fade } from "@material-ui/core"

const NewProductModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: cener;
`

const Paper = styled(Fade)`
  background-color: green;
  border: 2px solid #000;
  boxShadow: 4px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%);
  padding: 16px 32px 24px;
`

function NewProductForm(props) {
  return (
    <NewProductModal
      open={props.open}
      onClose={props.handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Paper in={props.open}>
        <div>
          <h2 id="transition-modal-title">Transition modal</h2>
          <p id="transition-modal-description">react-transition-group animates me.</p>
        </div>
      </Paper>
    </NewProductModal>
  )
}

export default NewProductForm
