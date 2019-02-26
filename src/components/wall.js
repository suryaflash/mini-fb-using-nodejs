import React from 'react';
import { Alert, Button, Card, CardTitle, CardText, Table, CardBody, Navbar, NavItem, Collapse, Nav, NavbarToggler } from 'reactstrap';
import { Link } from 'react-router-dom';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faUser } from '@fortawesome/free-solid-svg-icons';


export default class wall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            ourfriends: [],
            likelist: [],
        };
    }
    
    componentWillMount = () => {
        if (localStorage.getItem('token') == null)
            window.location.href = "/login";
        this.getImage();
        this.friendsList();
        this.wallPost();
    }

    friendsList = () => {
        console.log("called")
        fetch('http://localhost:8082/ourfriends',
            { headers: { 'Auth': `bearer ${localStorage.getItem('token')}`} })
            .then(response => response.json())
            .then(result => this.setState({ ourfriends: result }))
            .catch(err => console.log(err))
    }

    wallPost = () => {
        const data =
        {
            mail: localStorage.getItem('name')
        }
        fetch('http://localhost:8082/wall',
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            .then(response => response.json())
            .then((data => this.setState({ posts: data }, () => {
                console.log(this.state.posts);
            })))
            .catch(error => {
                if (error) throw error;
            })
    }


    likeButton = (post) => {
        const data =
        {
            post_id: post.post_id,
            liked_by_uid: localStorage.getItem('uid')
        }
        fetch('http://localhost:8082/addlike',
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then((data) => this.wallPost())
            .catch(error => { if (error) throw error; })
    }

    likelist = (post) => {
        const data =
        {
            post_id: post.post_id,
        }
        fetch('http://localhost:8082/likelist',
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then((data => {
                this.setState({ likelist: data }, () => console.log(this.state.likelist))
            }))
            .catch(error => { if (error) throw error; })
    }

    setImage = () =>
    {
        const data ={ imageURL : localStorage.getItem('url')}
    fetch('http://localhost:8082/addImage',
        {
            method : 'POST',
            body : JSON.stringify(data),
            headers: { 
                'Content-Type': 'application/json',
                'Auth': `bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(response =>
            {
                localStorage.setItem('url',)
            })
        .catch(error => { if (error) throw error; })
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
                self.setImage();
            }
            reader.readAsDataURL(e.target.files[0]);
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
              console.log(localStorage.getItem('token','url','name','uid'));
            window.location.href = "/"
          }

    render() {
        return (
            <div className='container'>
                <Navbar color="link" light expand="md">
                    <NavbarToggler onClick={this.toggle} />

                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>

                            <NavItem className="homee">
                                <Link to="/home" >HOME</Link>
                            </NavItem>

                            <NavItem className="sessionowner3">
                                <Link to="/wall" onClick={this.timeline}>WALL</Link>
                            </NavItem>

                            <NavItem className="sessionowner">
                                <Link to="/timeline" onClick={this.timeline}>TIMELINE</Link>
                            </NavItem>

                            <NavItem className="sessionowner">
                                Hi {localStorage.getItem('name')}
                            </NavItem>

                            <NavItem className="sessionowner">
                                <img src={localStorage.getItem('url')} alt="" width="50px" ></img>
                            </NavItem>

                            <NavItem>
                                <Link to="/login" onClick={this.sessionDestroy}>LOGOUT</Link>
                            </NavItem>

                        </Nav>
                    </Collapse>
                </Navbar>
                <div className="wall">
                    <Alert color="warning" align="center" className="timelinepost"> YOUR WALL </Alert>
                    <div>
                        {this.state.posts.map((post, index) => (
                            <Card className="postcontent" key={index} >
                                <CardTitle><Button color="info">{post.post_by}</Button></CardTitle>
                                <CardText style={{ fontFamily: "sans-srif", fontSize: "20px" }}>{post.post_content}</CardText>
                                <div>
                                    <p style={{ float: "left", paddingRight: "10px", color: "blue" }}>LIKE</p>
                                    <FontAwesomeIcon className="thumbs" icon={faThumbsUp} onClick={() => this.likeButton(post)}></FontAwesomeIcon>
                                    <span className="show" onMouseOver={() => this.likelist(post)} style={{ fontSize: "20px", paddingLeft: "10px", paddingTop: "20px" }}>{post.likes}
                                        <ul className="list-likers">
                                            {
                                                this.state.likelist.map((mail, idx) => (
                                                    <div key={idx}>
                                                        <li style={{ fontFamily: "helvetica", fontSize: "15px" }}><b> {mail.mail_id}</b></li>
                                                    </div>
                                                ))
                                            }
                                        </ul>
                                    </span>
                                </div>

                            </Card>
                        ))}
                    </div>
                </div>

                <div className="profile">
                    <Alert color="primary" align="center" style={{ fontSize: "30px" }}> PROFILE </Alert>

                    <Card>
                        <CardBody>
                            <CardTitle style={{ textDecoration: "bold" }}>{localStorage.getItem('name')}</CardTitle>
                            {/* <CardSubtitle>EMAIL ADDRESS : {localStorage.getItem('name')}</CardSubtitle> */}
                            <CardText>
                                <img src={localStorage.getItem('url')} alt="" width="100px" />
                            </CardText>
                        <div class="custom-file">
                            <input onChange={this.onImageUpload} type="file" class="custom-file-input" id="customFile" accept="img/png , img/jpg , img/gif , img/jpeg"/>
                            <label class="custom-file-label" for="customFile">Change Picture</label>
                        </div>
                            <FontAwesomeIcon icon={faThumbsUp}></FontAwesomeIcon>
                        </CardBody>
                    </Card>


                    <div className="friendslist">
                        <Alert color="primary" align="center" > YOUR FRIENDS </Alert>
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