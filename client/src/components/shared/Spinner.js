import styled from "styled-components"

import { CircularProgress, Grid } from "@material-ui/core"

const CustomCircularProgress = styled(CircularProgress)`
  margin-top: 200px;
`

function Spinner(props) {
  return (
    <Grid container justify="center" alignItems="center">
      <CustomCircularProgress size={80} thickness={2.5} />
    </Grid>

  )
}

export default Spinner