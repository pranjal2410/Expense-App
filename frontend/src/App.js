import React from 'react';
import Login from "./Components/Login/Login";
import {BrowserRouter} from "react-router-dom";
import {Route, Switch} from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import SignUp from "./Components/Signup/SignUp";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Route path='/' exact component={Login}/>
            <Route path='/Signup/' component={SignUp}/>
            <Route path='/Profile/' component={Navbar}/>
            <Route path='/Home/' component={Navbar}/>
            <Route path='/Income/' component={Navbar}/>
            <Route path='/Expense/' component={Navbar}/>
        </BrowserRouter>
    </div>
  );
}

export default App;
