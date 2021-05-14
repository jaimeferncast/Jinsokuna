import styled from "styled-components"

import { Typography, Divider } from "@material-ui/core"

const Tooltip = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  position: fixed;
  left: calc(50% + 308px);
  top: 88px;
  background-color: white;
  width: 400px;
  padding-bottom: 8px;
  @media (max-width: 1440px) {
    display: none;
  }
`
const Title = styled(Typography)`
  padding: 15px 15px 10px;
`
const Text = styled(Typography)`
  padding: 10px 15px;
  font-weight: 400;
`

function ProductTooltip(props) {
  return (
    <Tooltip>
      <Title variant="h6">
        {props.product?.name} - {props.product?.price}€
      </Title>
      {props.product.description &&
        <>
          <Divider />
          <Text variant="body1">
            {props.product.description}
          </Text>
        </>
      }
      {props.product.allergies.length
        ? <>
          <Divider />
          <Text variant="body1">
            <strong>Contiene:</strong>
            <br />
            {props.product.allergies.map((elm, i, arr) => {
              if (i === arr.length - 1) {
                return <span> {elm}</span>
              } else {
                return <span> {elm} -</span>
              }
            })}
          </Text>
        </>
        : null
      }
    </Tooltip>
  )
}

export default ProductTooltip