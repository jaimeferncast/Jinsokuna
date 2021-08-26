import { Typography } from "@material-ui/core"
import Button from "../../shared/CustomButton"

function Menu(props) {

  return (
    <div>
      {/* Menu para pedir desde mesa {props.location.search.slice(-2)} */}
      <Typography align="center" gutterBottom={true} variant="h5">Página en construcción</Typography>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={() => props.close()}>
          Volver
        </Button>
      </div>
    </div>
  )
}

export default Menu
