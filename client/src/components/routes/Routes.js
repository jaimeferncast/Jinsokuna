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
        render={() => (
          !loggedUser
            ? <Redirect to="/login" />
            : loggedUser.role === "EDITOR"
              ? <EditorIndex />
              : <OrderApp />
        )}
      />
      <Route path="/carta" render={() => <Menu />} />
      {/* <Route
        path="/calendario"
        render={(props) => (loggedUser ? <Calendar storeUser={storeUser} {...props} /> : <Redirect to="/login" />)}
      />
      <Route
        path="/semana"
        render={(props) => (loggedUser ? <WeekPlan storeUser={storeUser} {...props} /> : <Redirect to="/login" />)}
      />
      <Route
        path="/clases"
        render={(props) => (loggedUser ? <Lessons storeUser={storeUser} {...props} /> : <Redirect to="/login" />)}
      />
      <Route
        path="/comidas"
        render={(props) => (loggedUser ? <Meals storeUser={storeUser} {...props} /> : <Redirect to="/login" />)}
      />
      <Route path="/reservar" render={() => <NewBooking />} /> */}
    </Switch>
  )
}

export default Routes
