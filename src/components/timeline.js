import React from 'react';
import { Alert, Button, Card, CardTitle, CardText, Navbar, NavItem, Collapse, Nav, NavbarToggler } from 'reactstrap';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {Helmet} from 'react-helmet';


export default class timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            likelist: []
        };
    }

    timelinePost = () => {
        fetch('http://localhost:8082/timelinePost')
            .then(response => response.json()
                .then((data => {
                    this.setState({ posts: data }, () => console.log(this.state.posts))
                }))
            )
            .catch(error => {
                if (error) throw error;
            });
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

    componentWillMount = () => {

        if (localStorage.getItem('token') == null)
            window.location.href = "/login";
        this.timelinePost();
        this.getImage();
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
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then((data) => this.timelinePost())
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
            <div >
                 <Helmet>
                <style>{'body { background-color: rgb(42, 240, 148); }'}</style>
            </Helmet>
                <Navbar  light expand="md">
          <NavbarToggler onClick={this.toggle} />

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>

            <NavItem>
                  <Link to="/home" >HOME</Link>
                </NavItem>

                <NavItem className="walle">
                  <Link to="/wall" onClick={this.wall}>WALL</Link>
                </NavItem>

                <NavItem className="timelinee">
                  <Link to="/timeline" onClick={this.timeline}>TIMELINE</Link>
                </NavItem>

                <h4 style={{paddingLeft : "345px", fontFamily:"Bradley Hand, cursive" }}> Mini-FB</h4>

                <NavItem className="namee">
                  Hi {(localStorage.getItem('name'))}
                </NavItem>

                <NavItem className="dp">
                  <img src={localStorage.getItem('url')} alt="" width="75px" ></img>
                </NavItem>

                <NavItem className="logoute">
                  <Link to="/login" onClick={this.sessionDestroy}>LOGOUT</Link>
                </NavItem>

            </Nav>
          </Collapse>
        </Navbar>
                <div className='timeline'>
                    <Alert color="info" align="center" className="timelinepost"> TimeLine Posts </Alert>
                    <div>
                        {this.state.posts.map((post, index) => (
                            <Card className="postcontent" key={index} body color="">
                                <CardTitle><Button color="info">{post.post_by}</Button></CardTitle>
                                <CardText color="info" style={{ fontFamily: "sans-srif", fontSize: "20px" }}>{post.post_content}</CardText>
                                <CardText>
                                {<img src={post.photo} style={{width : "15%" ,padding:"10px" ,paddingBottom : "30px"}} alt="" />}
                                    </CardText>
                                <div>
                                    <p style={{ float: "left", paddingRight: "10px", color: "blue" }}>LIKE</p>
                                    <FontAwesomeIcon className="thumbs" icon={faThumbsUp} style={{ float: "left", color: "rgb(0,89,255" }} onClick={() => this.likeButton(post)}></FontAwesomeIcon>                                    
                                    <span className="show" onMouseOver={() => this.likelist(post)} style={{ fontSize: "20px", paddingLeft: "10px",  paddingTop: "20%"}}><b>{post.likes}</b>
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

            </div>
        )
    }
}