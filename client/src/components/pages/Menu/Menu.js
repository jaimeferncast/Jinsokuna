import { useEffect } from "react"

import { isMobileDevice } from "../../../utils"

function Menu(props) {


  return (
    <div>
      {/* Menu para pedir desde mesa {props.location.search.slice(-2)} */}
      <button onClick={() => isMobileDevice(navigator.userAgent) ? alert("eres móvil") : alert("no eres móvil")}>
        user agent
      </button>
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