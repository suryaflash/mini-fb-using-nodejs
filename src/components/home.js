import Cookies from 'universal-cookie';
import React from 'react';
import './home.css';
//import { Redirect } from 'react-router-dom';
 import './timeline';
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser } from '@fortawesome/free-solid-svg-icons'

import { Alert , Button ,Table } from 'reactstrap';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem , FormGroup , Label , Input } from 'reactstrap';
  import { Link} from 'react-router-dom';
const cookies = new Cookies();
export default class home extends React.Component
{
    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.state = {
          flag : false,
          uid:'',
          newfriends : [],
          isOpen: false,
          name:'',
          post:'',
          friendRequests : [],
          sentRequest : [],
          ourfriends : [],
          searchitem : '',
          searchresult : []
        };
        
      }
      toggle() {
        this.setState({
          isOpen: !this.state.isOpen
        });
      }

      componentWillMount()
      {
        if(cookies.get('name') == undefined)
        window.location.href="/login";
        this.findNewFriends();
        this.friendsList();
        this.friendRequests();
        this.sentRequests();   
      }

      findNewFriends=()=>
      {
        this.setState({name:cookies.get('name'),uid:parseInt(cookies.get('uid'))},()=>
      {
         // console.log("state la:",this.state);
      });
        const datas =
        {
          uid:cookies.get('uid'),
          mail:cookies.get('name')
        }

       // console.log("Data:",datas)
        fetch('http://localhost:8082/find', 
        {
          method: 'POST', 
          body: JSON.stringify(datas), 
          headers:{
            'Content-Type': 'application/json'
          }
        })
      .then(response => response.json())
      .then(datas => 
          {
              //console.log("response:",datas);
              this.setState({newfriends:datas});
          })
      .catch(err => console.log(err))
      }

      friendsList = () =>
      { 
        const value =
        {
          uid:cookies.get('uid'),
          mail:cookies.get('name')
        }
        fetch('http://localhost:8082/ourfriends', 
        {
          method: 'POST', 
          body: JSON.stringify(value), 
          headers:{
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => this.setState({ourfriends:data}))
        .catch(err => console.log(err))
       // console.log("friends:",this.state.ourfriends);
      }

      friendRequests = () =>
      {
        const data ={mail:cookies.get('name'),uid:parseInt(cookies.get('uid'))}
      fetch('http://localhost:8082/getfriendrequest', 
      {
        method: 'POST', 
        body: JSON.stringify(data), 
        headers:{
          'Content-Type': 'application/json'
        }
      })
     .then(response => response.json())
     .then(data =>
      {
        this.setState({friendRequests : data })
      })
     .catch(err => console.log(err))
      }

      sentRequests = () =>
      {
        const d ={
          mail:cookies.get('name')
        } 
      fetch('http://localhost:8082/sentrequest', 
      {
        method: 'POST',
        body: JSON.stringify(d), 
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data =>{this.setState({sentRequest : data })})
      .catch(err => console.log(err))

       }
      

    sessionDestroy = () =>
    {
    fetch('http://localhost:8082/logout')
    .then(response => response.json())
    .then(data => 
        {
            if(data.check===true)
                window.location.href="/login";
        })
    .catch(err => console.log(err))
        cookies.remove('uid');
        cookies.remove('name');
        window.location.href = "/"
    }


    sendRequest = (friend)  =>
    {
        const data=
        {
          from : cookies.get('name'),
          to : friend.mail_id,
          from_uid:parseInt(cookies.get('uid')),
          to_uid:friend.uid    
        }
      fetch('http://localhost:8082/friendRequest', 
      {
        method: 'POST', 
        body: JSON.stringify(data), 
        headers:{
          'Content-Type': 'application/json'
        }
      })
    .then(response => response.json())
    .then(response => {
      this.findNewFriends();
      this.sentRequests();
    })
    .catch(err => console.log(err))
    
    
    } 

    handleChange = (e) => {this.setState({ [e.target.name] : e.target.value});}

    postItem = () =>
    {
      const data =
      {
        postItem:this.state.post,
        uid:parseInt(cookies.get('uid')),
        name:cookies.get('name')
      }
      fetch('http://localhost:8082/postItem', 
      {
        method: 'POST', 
        body: JSON.stringify(data), 
        headers:{
          'Content-Type': 'application/json'
        }
      })
    .then(response => response.json())
    .catch(err => console.log(err))
    var poste = '';
    this.setState({post:poste});  
    }

    acceptFriend = (friend) =>
    {
      const val =
      {
        uid:parseInt(cookies.get('uid')),
        email:cookies.get('name'),
        accept_id:friend.from_uid,
        accept_email:friend.from_email
      }
      //console.log("accept la friend:",friend);
      fetch('http://localhost:8082/acceptFriend', 
      {
        method: 'POST', 
        body: JSON.stringify(val), 
        headers:{
          'Content-Type': 'application/json'
        }
      })
    .then(response => response.json())
    .then(response => 
      {       
        this.friendRequests();
        this.friendsList();
      })
    .catch(err => console.log(err))  
    }

    rejectFriend = (friend) =>
    {
      const val =
      {
        uid:parseInt(cookies.get('uid')),
        email:cookies.get('name'),
        accept_id:friend.from_uid,
        accept_email:friend.from_email
      }
      fetch('http://localhost:8082/rejectFriend', 
      {
        method: 'POST', 
        body: JSON.stringify(val), 
        headers:{
          'Content-Type': 'application/json'
        }
      })
    .then(response => response.json())
    .then(response =>
      {
        this.findNewFriends();
        this.friendRequests();
        
      })
    .catch(err => console.log(err))  
    }

    timeline = () =>  
    {
      window.location.href="/timeline";
    }

    

    searchFriend = () =>
    {
      const searchdata =
      {
        searchitem : this.state.searchitem
      }
      fetch('http://localhost:8082/searchFriend', 
      {
        method: 'POST', 
        body: JSON.stringify(searchdata), 
        headers:{
          'Content-Type': 'application/json'
        }
      })
    .then(response => response.json())
    .then(data => this.setState({searchresult : data}))
    .catch(err => console.log(err))  

  }
    
render()
{
  
  return(
    
        <div>
<Navbar color="link" light expand="md">
          <NavbarToggler onClick={this.toggle} />

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>

            <NavItem className="homee">
              <Link to ="/home" >HOME</Link>
            </NavItem>

            <NavItem className="sessionowner2">
                <Link to ="/wall" onClick={this.wall}>WALL</Link>
              </NavItem>

            <NavItem className="sessionowner">
                <Link to ="/timeline" onClick={this.timeline}>TIMELINE</Link>
              </NavItem>

              <NavItem className="sessionowner">
                Hi {cookies.get('name')} 
              </NavItem>

              <NavItem className="sessionowner">
                <Link to="/login" onClick={this.sessionDestroy}>LOGOUT</Link>
              </NavItem>

            </Nav>
          </Collapse>
        </Navbar>       

        <div className="homeDiv">

        <Alert color="warning" align="center" > FRIEND REQUESTS </Alert>
         
        {this.state.friendRequests.map((friend , index) => (
                <div key ={index}>
                  <div >
                  <FontAwesomeIcon className="icon" icon={faUser}></FontAwesomeIcon>
                  <h5 className ="mail">{friend.from_email}</h5>
                  </div>
                  <div >
                    <Button color="success" onClick={()=>this.acceptFriend(friend)}>ACCEPT</Button>
                    <Button style ={{marginLeft : "25px"}}color="danger" onClick={()=>this.rejectFriend(friend)}>REJECT</Button>
                  </div>
                  <hr/>
                </div>
                
            ))}

          <div className="sentrequests">
          <Alert color="warning" align="center" > SENT FRIEND REQUEST </Alert>
          {this.state.sentRequest.map((friend , index) => (
                <div key ={index}>
                  <div >
                  <FontAwesomeIcon className="icon" icon={faUser}></FontAwesomeIcon>
                  <h5 className ="mail">{friend.to_email}</h5>
                  </div>

                  <hr/>
                </div>
                
            ))}
          </div>
           
        </div>

<div className="homeDiv1">
<div>
<Alert color="warning" align="center" > !! WELCOME !!</Alert>
<Alert color="info" align="center" > UPDATE YOUR POST </Alert>

<FormGroup>
          <Label color ="info" for="exampleText">Update status of your post</Label>
          <Input type="textarea" name="post" id="postText" value={this.state.post} onChange={this.handleChange}/>
<Button className="buttonclass" color="success" onClick={this.postItem} > POST IT !</Button>
</FormGroup>
</div>
      <div className="search">
        <FormGroup>
          <Label for="exampleSearch">Search For New Friends</Label>
          <Input
            type="search"
            name="searchitem"
            id="exampleSearch"
            placeholder="Enter Name "
            onChange = {this.handleChange}
            value = {this.state.searchitem}
          />
          <Button className="searchbutton" color="success" onClick = {this.searchFriend} > SEARCH </Button>
          </FormGroup>  
            
            {/* <Alert color = "warning" >SEARCH RESULT </Alert> */}
            {this.state.searchresult.map((friend , index) => (
               
                <div key ={index}>
                  <div >
                  <FontAwesomeIcon className="icon" icon={faUser}></FontAwesomeIcon>
                  <h5 className ="mail">{friend.mail_id}</h5>
                  </div>
                  {/* <div >
                    <Button color="success" onClick={()=>this.acceptFriend(friend)}>ACCEPT</Button>
                    <Button style ={{marginLeft : "25px"}}color="danger" onClick={()=>this.rejectFriend(friend)}>REJECT</Button>
                  </div> */}
                  
                </div>
                
            ))}
            {/* {this.state.searchresult.map((result , index) => (
              <div key ={index}>
                <div >
                <FontAwesomeIcon className="icon" icon={faUser}></FontAwesomeIcon>
                <h5 className ="mail">{result.mail_id}</h5>
                
                </div>
                {/* <div >
                  <Button color="success" onClick={()=>this.acceptFriend(result)}>ACCEPT</Button>
                  <Button style ={{marginLeft : "25px"}}color="danger">REJECT</Button>
                </div>  */}
                <hr/>
              </div>
              
          
          </div>


<div className="homeDiv2">

<Alert color="warning" align="center" > CONNECT WITH NEW FRIENDS </Alert>
<Table >
<tbody>
{this.state.newfriends.map((friend , index) => 
  (
  <tr key ={index}>
                  <td>{friend.mail_id}</td>
                  <td><Button color="info" onClick={()=>this.sendRequest(friend)}>SEND REQUEST</Button></td>
                </tr>
            ))}
            </tbody>
  </Table>

   <div className="sentrequests">
          <Alert color="warning" align="center" > YOUR FRIENDS </Alert>
          <Table >
<tbody>
{this.state.ourfriends.map((friend , index) => 
  (
  <tr key ={index}>
                  <td><FontAwesomeIcon className="icon" icon={faUser}></FontAwesomeIcon></td>
                  <td><h5 className ="mail">{friend.email}</h5></td>
                </tr>
            ))}
            </tbody>
  </Table>
    </div>  
</div>
</div>
    )
}
}