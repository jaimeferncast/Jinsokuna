import styled from "styled-components"

import { Typography, Divider } from "@material-ui/core"

const Tooltip = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  position: fixed;
  left: calc(50% + 104px);
  top: 84px;
  background-color: white;
  width: 400px;
  padding-bottom: 12px;
  @media (max-width: 1067px) {
    display: none;
  }
`
const Title = styled(Typography)`
  padding: 15px 15px 10px;
  font-weight: 200;
`
const Text = styled(Typography)`
  padding: 10px 15px;
  font-weight: 400;
`

function ProductTooltip(props) {
  return (
    <Tooltip>
      <Title variant="h5">
        {props.product?.name}
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
                return <i key={elm}> {elm}</i>
              } else {
                return <i key={elm}> {elm} -</i>
              }
            })}
          </Text>
        </>
        : null
      }
      <Divider />
      {props.product.price.map((elm, i) => {
        return (
          <Text key={i} style={{ marginBottom: '-10px', fontSize: '1.1rem', fontWeight: '200' }}>
            {elm.subDescription && elm.subDescription.slice(0, 1).toUpperCase() + elm.subDescription.slice(1) + " - "}{elm.subPrice}€
          </Text>
        )
      })}
    </Tooltip>
  )
}

export default ProductTooltip