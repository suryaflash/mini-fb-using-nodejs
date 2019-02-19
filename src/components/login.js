import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Form, FormGroup,  Label, Input } from 'reactstrap';
//import {Redirect} from 'react-router-dom';
import Example from './navbar';
import Cookies from 'universal-cookie';
//import { faWindowRestore } from '@fortawesome/free-solid-svg-icons';
 
const cookies = new Cookies();

class login extends React.Component
{
  constructor(props) {
    super(props);
    this.state =
      {
          email:'',
          password:'',
          isTrue: false,
          apiFlag : false,
      }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name] : e.target.value});
    }
    componentWillMount()
    {
    if(cookies.get('name') != undefined)
     window.location.href="/home";
    }

  onLogIn = (e) => 
  {
    const data=
    {
      email : this.state.email,
      password : this.state.password
    }
    console.log("login");
   e.preventDefault();  
    fetch('http://localhost:8082/login', 
    {
      method: 'POST', 
      body: JSON.stringify(data), 
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => 
        {
            if(data.check===true)
            {
                this.setState({apiFlag:true});
                cookies.set('uid', data.id, { path: '/' }); 
                cookies.set('name', data.name, { path: '/' });
                window.location.href="/home";
            }
            else
                window.alert("Bad Credentials");
})
    .catch(error => console.error('Error:', error));
}


    render()
    {
        return(
            <div>
            <div className="container">
                <Example />
            
              <div>
                <Alert color="secondary" align="center" >
                  !! LOGIN TO YOUR ACCOUNT !!
                </Alert>
                <Form>
                  <FormGroup>
                    <Label for="exampleEmail">Email</Label>
                    <Input type="text" name="email" id="exampleEmail" placeholder="Enter Email Address" value={this.state.email} onChange={this.handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="examplePassword">Password</Label>
                    <Input type="password" name="password" id="examplePassword" placeholder="Enter Password" value={this.state.password} onChange={this.handleChange} />
                  </FormGroup>
            
                </Form>
                <div style={{ textAlign: 'center' }}>
                  <Button outline color="success" align="center" onClick={this.onLogIn}>LOG IN</Button>
                </div>
               </div>
            </div>
          </div>
        )
    }
}

export default login;