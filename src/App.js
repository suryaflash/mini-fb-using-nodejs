import React from 'react';
import './App.css';
import signup from './components/signup';
import login from './components/login';
import timeline from './components/timeline';
import { BrowserRouter , Route} from "react-router-dom";
import home from "./components/home";
import wall from "./components/wall";
//import Auth from "./auth/requireAuth";
export default class App extends React.Component
{
  render() {
    return (
         <BrowserRouter>
            <div>
              <Route exact path="/" component={signup}/>
              <Route exact path="/login" component={login}/>
              <Route exact path="/home" component={home}/>
              <Route exact path="/timeline" component={timeline}/>
              <Route exact path="/wall" component={wall}/>
            </div>
          </BrowserRouter>  
    ); 
  }
}

