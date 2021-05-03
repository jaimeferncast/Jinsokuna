import { Switch, Route, Redirect } from "react-router-dom"

import Login from "../pages/Login/Login"
import EditMenu from "../pages/EditMenu/EditMenu"
import Orders from "../pages/Orders/Orders"
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
              ? <EditMenu />
              : <Orders />
        )}
      />
      {/* <Route
        path="/validar-reserva/:id"
        render={(props) => (loggedUser ? <OccupanciesCalendar resetInputData={resetInputData} {...props} /> : <Redirect to="/login" />)}
      />
      <Route
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
