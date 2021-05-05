import { Switch, Route, Redirect } from "react-router-dom"

import Login from "../pages/Login/Login"
import EditorIndex from "../pages/Editor/EditorIndex"
import OrderApp from "../pages/OrderApp/OrderApp"
import Menu from "../pages/Menu/Menu"

const Routes = ({ storeUser, loggedUser }) => {
  return (
    <Switch>
      <Route path="/login" render={(props) => <Login storeUser={storeUser} {...props} />} />
      <Route
        path="/"
        exact
        render={(props) => !loggedUser
          ? <Redirect to="/login" />
          : loggedUser.role === "EDITOR"
            ? <EditorIndex storeUser={storeUser} {...props} />
            : <OrderApp />
        }
      />
      <Route
        path="/carta"
        render={(props) => loggedUser?.role === "EDITOR" ? <EditorIndex {...props} /> : <Menu />}
      />
      <Route
        path="/usuario"
        render={(props) => loggedUser?.role === "EDITOR" ? <EditorIndex {...props} /> : <Redirect to="/" />}
      />
    </Switch>
  )
}

export default Routes
