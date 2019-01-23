import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer} from "react-toastify";
import Movies from "./components/movies";
import MovieForm from "./components/movieForm";
import NavBar from "./components/navbar";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import LoginForm from "./components/loginForm"
import RegisterForm from "./components/registerForm"
import Home from "./components/home";
import Logout from "./components/logout";
import ProtectedRoute from "./components/common/protectedRoute";
import auth from "./services/authService";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
    state = {};
  
    componentDidMount() {
      const user = auth.getCurrentUser();
      this.setState({user});
    }

  render() {
    const { user } = this.state;
    return (
      
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
      <main className="container">       
          <Switch>       
            <Route path="/login"  component={LoginForm} /> 
            <Route path="/logout"  component={Logout} /> 
            <ProtectedRoute path="/movies/:id"
              component={MovieForm} /> 
            <Route path="/movies" 
            render={props => <Movies {...props} user={user} />} />          
            <Route path="/rentals" exact component={Rentals} /> 
            <Route path="/customers" exact component={Customers} />
            <Route path="/not-found"  component={NotFound} /> 
            <Route path="/home"  component={Home} />
            <Route path="/register"  component={RegisterForm} />
            <Redirect from="/" exact to="/movies" />   
            <Redirect to="/not-found" />            
          </Switch>          
        </main>
      </React.Fragment>     
    );
  }
}

export default App;
