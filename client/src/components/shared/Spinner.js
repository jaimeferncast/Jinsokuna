import styled from "styled-components"

import { CircularProgress, Grid } from "@material-ui/core"

const CustomCircularProgress = styled(CircularProgress)`
  margin-top: 50px;
`

function Spinner(props) {
  return (
    <Grid container justify="center">
      <CustomCircularProgress size={80} thickness={3} />
    </Grid>

  )
}

export default Spinner