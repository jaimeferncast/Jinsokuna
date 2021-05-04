import { Switch, Route, Redirect } from "react-router-dom"

import Login from "../pages/Login/Login"
import EditorIndex from "../pages/Editor/EditorIndex"
import EditMenu from "../pages/Editor/EditMenu/EditMenu"
import EditUser from "../pages/Editor/EditUser/EditUser"
import OrderApp from "../pages/OrderApp/OrderApp"
import Menu from "../pages/Menu/Menu"

const Routes = ({ storeUser, loggedUser }) => {
  return (
    <Switch>
      <Route path="/login" render={(props) => <Login storeUser={storeUser} {...props} />} />
      <Route
        path="/"
        exact
        render={() => (
          !loggedUser
            ? <Redirect to="/login" />
            : loggedUser.role === "EDITOR"
              ? <EditorIndex />
              : <OrderApp />
        )}
      />
      <Route path="/carta" render={() => (loggedUser?.role === "EDITOR" ? <EditMenu /> : <Menu />)} />
      <Route path="/usuario" render={() => (loggedUser?.role === "EDITOR" ? <EditUser /> : <Redirect to="/" />)} />
    </Switch>
  )
}

export default Routes
