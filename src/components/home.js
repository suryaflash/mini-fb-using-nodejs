import React from 'react';
import './home.css';
import './timeline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'

import { Alert, Button, Table } from 'reactstrap';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem, FormGroup, Label, Input
} from 'reactstrap';
import { Link } from 'react-router-dom';
export default class home extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      flag: false,
      uid: '',
      newfriends: [],
      isOpen: false,
      name: '',
      post: '',
      friendRequests: [],
      sentRequest: [],
      ourfriends: [],
      searchitem: '',
      searchresult: [],
      postPicture : ''
    };

  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  componentWillMount() {
    if (localStorage.getItem('token') == null)
      window.location.href = "/login";
    this.findNewFriends();
    this.friendsList();
    this.friendRequests();
    this.sentRequests();
    this.getImage();
  }

  findNewFriends = () => {
    const token=localStorage.getItem('token');
    fetch('http://localhost:8082/find',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Auth': `bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(datas => {
        this.setState({ newfriends: datas });
      })
      .catch(err => console.log(err))
  }

  friendsList = () => {
    fetch('http://localhost:8082/ourfriends',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Auth': `bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => response.json())
      .then(data => this.setState({ ourfriends: data }))
      .catch(err => console.log(err))
  }

  friendRequests = () => {
    fetch('http://localhost:8082/getfriendrequest',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Auth': `bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => response.json())
      .then(data => {
        this.setState({ friendRequests: data })
      })
      .catch(err => console.log(err))
  }

  sentRequests = () => {
    fetch('http://localhost:8082/sentrequest',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Auth': `bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => response.json())
      .then(data => { this.setState({ sentRequest: data }) })
      .catch(err => console.log(err))

  }



  sessionDestroy = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('url');
    localStorage.removeItem('name');
    localStorage.removeItem('uid');
    fetch('http://localhost:8082/logout')
      .then(response => response.json())
      .then(data => {
        if (data.check === true)
          window.location.href = "/login";
      })
      .catch(err => console.log(err))
    window.location.href = "/"
  }


  sendRequest = (friend) => {
    const data =
    {
      to: friend.mail_id,
      to_uid: friend.uid
    }
    fetch('http://localhost:8082/friendRequest',
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Auth': `bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => response.json())
      .then(response => {
        this.findNewFriends();
        this.sentRequests();
      })
      .catch(err => console.log(err))


  }

  handleChange = (e) => { this.setState({ [e.target.name]: e.target.value }); }

  postItem = () => {
    const data =
    {
      postItem: this.state.post,
      postPicture: this.state.postPicture
    }
    fetch('http://localhost:8082/postItem',
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Auth': `bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => response.json())
      .catch(err => console.log(err))
    var poste = '';
    this.setState({ post: poste });
  }

  acceptFriend = (friend) => {
    const val =
    {
      accept_id: friend.from_uid,
      accept_email: friend.from_email
    }
    fetch('http://localhost:8082/acceptFriend',
      {
        method: 'POST',
        body: JSON.stringify(val),
        headers: {
          'Content-Type': 'application/json',
          'Auth': `bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => response.json())
      .then(response => {
        this.friendRequests();
        this.friendsList();
      })
      .catch(err => console.log(err))
  }

  rejectFriend = (friend) => {
    const val =
    {
      accept_id: friend.from_uid,
      accept_email: friend.from_email
    }
    fetch('http://localhost:8082/rejectFriend',
      {
        method: 'POST',
        body: JSON.stringify(val),
        headers: {
          'Content-Type': 'application/json',
          'Auth': `bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => response.json())
      .then(response => {
        this.findNewFriends();
        this.friendRequests();

      })
      .catch(err => console.log(err))
  }

  timeline = () => {
    window.location.href = "/timeline";
  }

  getImage = () =>
  {
      fetch('http://localhost:8082/getImage',
              { headers: { 'Auth': `bearer ${localStorage.getItem('token')}` } })
              .then(response => response.json())
              .then(response =>
                  {
                      if(response[0].profile_pic === null)
                       localStorage.setItem('url','https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png')
                      else
                       localStorage.setItem('url',response[0].profile_pic)
                  }
                  )
              .catch(error => { if (error) throw error; } )
   }

   onImageUpload = (e) =>
   {
       const reader=new FileReader();
       const self = this;
       console.log("reader:",reader);
       reader.onload=function()
       {
           localStorage.setItem('url',reader.result);
           self.setState({postPicture:reader.result})
       }
       reader.readAsDataURL(e.target.files[0]);
   }


  searchFriend = () => {
    const searchdata =
    {
      searchitem: this.state.searchitem
    }
    fetch('http://localhost:8082/searchFriend',
      {
        method: 'POST',
        body: JSON.stringify(searchdata),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => this.setState({ searchresult: data }))
      .catch(err => console.log(err))

  }

  render() {

    return (

      <div>
        <Navbar  light expand="md">
          <NavbarToggler onClick={this.toggle} />

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>

              <NavItem className="homee">
                <Link to="/home" >HOME</Link>
              </NavItem>

              <NavItem className="sessionowner2">
                <Link to="/wall" onClick={this.wall}>WALL</Link>
              </NavItem>

              <NavItem className="sessionowner">
                <Link to="/timeline" onClick={this.timeline}>TIMELINE</Link>
              </NavItem>

              <NavItem className="sessionowner">
                Hi {(localStorage.getItem('name'))}
              </NavItem>

              <NavItem className="sessionowner">
                  <img src={localStorage.getItem('url')} alt="" width="50px" ></img>
               </NavItem>

              <NavItem className="sessionowner">
                <Link to="/login" onClick={this.sessionDestroy}>LOGOUT</Link>
              </NavItem>

            </Nav>
          </Collapse>
        </Navbar>

        <div className="homeDiv">

          <Alert color="warning" align="center" > FRIEND REQUESTS </Alert>

          {this.state.friendRequests.map((friend, index) => (
            <div key={index}>
              <div >
                <FontAwesomeIcon className="icon" icon={faUser}></FontAwesomeIcon>
                <h5 className="mail">{friend.from_email}</h5>
              </div>
              <div >
                <Button color="success" onClick={() => this.acceptFriend(friend)}>ACCEPT</Button>
                <Button style={{ marginLeft: "25px" }} color="danger" onClick={() => this.rejectFriend(friend)}>REJECT</Button>
              </div>
              <hr />
            </div>

          ))}

          <div className="sentrequests">
            <Alert color="warning" align="center" > SENT FRIEND REQUEST </Alert>
            {this.state.sentRequest.map((friend, index) => (
              <div key={index}>
                <div >
                  <FontAwesomeIcon className="icon" icon={faUser}></FontAwesomeIcon>
                  <h5 className="mail">{friend.to_email}</h5>
                </div>

                <hr />
              </div>

            ))}
          </div>

        </div>

        <div className="homeDiv1">
          <div>
            <Alert color="warning" align="center" > !! WELCOME !!</Alert>
            <Alert color="info" align="center" > UPDATE YOUR POST </Alert>

            <FormGroup>
              <Label color="info" for="exampleText">Update status of your post</Label>
              <Input type="textarea" name="post" id="postText" value={this.state.post} onChange={this.handleChange} />
              <div class="custom-file">
                            <input onChange={this.onImageUpload} type="file" class="custom-file-input" id="customFile" accept="img/png , img/jpg , img/gif , img/jpeg"/>
                            <label class="custom-file-label" for="customFile">Upload Picture for your post</label>
              </div>
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
                onChange={this.handleChange}
                value={this.state.searchitem}
              />
              <Button className="searchbutton" color="success" onClick={this.searchFriend} > SEARCH </Button>
            </FormGroup>
            {this.state.searchresult.map((friend, index) => (

              <div key={index}>
                <div >
                  <FontAwesomeIcon className="icon" icon={faUser}></FontAwesomeIcon>
                  <h5 className="mail">{friend.mail_id}</h5>
                </div>
              </div>

            ))}
            <hr />
          </div>


        </div>


        <div className="homeDiv2">

          <Alert color="warning" align="center" > CONNECT WITH NEW FRIENDS </Alert>
          <Table >
            <tbody>
              {this.state.newfriends.map((friend, index) =>
                (
                  <tr key={index}>
                    <td>{friend.mail_id}</td>
                    <td><Button color="info" onClick={() => this.sendRequest(friend)}>SEND REQUEST</Button></td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <div className="sentrequests">
            <Alert color="warning" align="center" > YOUR FRIENDS </Alert>
            <Table >
              <tbody>
                {this.state.ourfriends.map((friend, index) =>
                  (
                    <tr key={index}>
                      <td><FontAwesomeIcon className="icon" icon={faUser}></FontAwesomeIcon></td>
                      <td><h5 className="mail">{friend.email}</h5></td>
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