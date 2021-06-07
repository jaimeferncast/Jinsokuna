import styled from "styled-components"

import { CircularProgress, Grid } from "@material-ui/core"

const CustomCircularProgress = styled(CircularProgress)`
  margin: ${props => props.margin ? props.margin : "200px 0 0"};
`

function Spinner(props) {
  return (
    <Grid container justify="center" alignItems="center">
      <CustomCircularProgress size={80} thickness={2.5} margin={props.margin} />
    </Grid>

  )
}

export default Spinner