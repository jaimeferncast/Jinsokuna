
function Menu(props) {
  return (
    <div>
      Menu para pedir desde mesa {props.location.search.slice(-2)}
    </div>
  )
}

export default Menu