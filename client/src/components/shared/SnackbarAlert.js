import styled from "styled-components"

import { Snackbar, Button } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

const Veil = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: #0000008a;
  z-index: 1399;
`

function SnackbarAlert(props) {
  return (
    <>
      {props.open && <Veil />}
      <Snackbar
        anchorOrigin={props.anchorOrigin}
        open={props.open}
        onClose={() => props.closeAlert(props.message, props.severity)}
      >
        <Alert
          severity={props.severity}
          variant="filled"
          action={props.severity === "warning"
            && <Button
              color="inherit"
              size="small"
              onClick={() => {
                props.category
                  ? props.deleteProduct(props.i, props.category, props.id)
                  : props.deleteCategory(props.i, props.id)
              }}
            >
              aceptar
              </Button>}
        >
          {props.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default SnackbarAlert