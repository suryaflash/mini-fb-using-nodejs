import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Button, Form, FormGroup,  Label, Input } from 'reactstrap';
import Example from './navbar';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default class signup extends React.Component {

  constructor(props) {
    super(props);
    this.state =
      {
          email:'',
          password:'',
          showme:false
      }
  }
 
  handleChange = (e) => {
    this.setState({ [e.target.name] : e.target.value});
    }

  componentWillMount () 
  {
    if(cookies.get('name') != undefined)
     window.location.href="/home";
  }
  addPeople = (e) => 
  {
      console.log(this.state);
      let data = 
      {
         email : this.state.email,
         password :this.state.password,
         showme : this.state.showme
      }
    e.preventDefault();  
    fetch('http://localhost:8082/signup', 
    {
      method: 'POST', 
      body: JSON.stringify(data), 
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json()) 
    .catch(error => console.error('Error:', error));

    const email1 = '';
      const password1 ='';
      const showme1 = false;    

    this.setState({ email:email1,password:password1,showme:showme1});
}
  

  toggleChange = () =>  {this.setState({showme: !this.state.showme })}

  render() 
  {
    return (
        <div className="container">
           <Example />
          <div>
            <Alert color="info" align="center" >
              !! WELCOME !!
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
              <FormGroup>
                <Label style ={{paddingRight:"30px"}}for="exampleShow">Show Me In Search</Label>
                <Input type="checkbox" name="show" id="exampleShow" checked={this.state.showme} onChange={this.toggleChange}  />
              </FormGroup>
        
            </Form>
            <div style={{ textAlign: 'center' }}>
              <Button outline color="success" align="center" onClick={this.addPeople}>SIGN UP</Button>
            </div>
           
          </div>

        </div>
    );
  }
}

