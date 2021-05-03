import { Switch, Route, Redirect } from "react-router-dom"

import Login from "../pages/Login/Login"
import EditableMenu from "../pages/EditableMenu/EditableMenu"

const Routes = ({ storeUser, loggedUser }) => {
  return (
    <Switch>
      <Route path="/login" render={(props) => <Login storeUser={storeUser} {...props} />} />
      <Route
        path="/"
        exact
        render={() => (
          loggedUser
            ? <EditableMenu />
            : <Redirect to="/login" />
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
