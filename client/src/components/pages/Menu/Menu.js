
function Menu(props) {

  return (
    <div>
      {/* Menu para pedir desde mesa {props.location.search.slice(-2)} */}
      <button onClick={() => console.log(document.headers)}>
        referer
      </button>
      <button onClick={() => alert(new Date().toLocaleString().substr(0, 15))}>
        fecha
      </button>
    </div>
  )
}

export default Menu
