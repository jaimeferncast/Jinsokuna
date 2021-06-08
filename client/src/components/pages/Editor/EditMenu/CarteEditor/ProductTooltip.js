import { useContext } from "react"

import styled from "styled-components"

import { Typography, Divider } from "@material-ui/core"

import ThemeContext from "../../../../../ThemeContext"

import { capitalizeTheFirstLetterOfEachWord } from "../../../../../utils"

export const Tooltip = styled.div`
  border: 2px solid ${props => props.product ? props.palette.primary.main : "#ffffff00"};
  border-radius: 5px;
  position: fixed;
  left: calc(50% + 54px);
  top: ${props => props.menuDescription ? "195px" : "167px"};
  background-color: ${props => props.palette.dark};
  width: 450px;
  padding: ${props => props.padding || "0 0 12px 0"};
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
  const { palette } = useContext(ThemeContext)

  return (
    <Tooltip palette={palette} menuDescription={props.menuDescription} product={true}>
      <Title variant="h6">
        {capitalizeTheFirstLetterOfEachWord(props.product.name)}
      </Title>
      {props.product.description &&
        <>
          <Divider />
          <Text variant="body1">
            {props.product.description.slice(0, 1).toUpperCase() + props.product.description.slice(1)}
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