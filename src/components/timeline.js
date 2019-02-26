import React from 'react';
import { Alert, Button, Card, CardTitle, CardText, Navbar, NavItem, Collapse, Nav, NavbarToggler } from 'reactstrap';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

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
                <div className='container'>
                    <Alert color="warning" align="center" className="timelinepost"> TIMELINE POSTS </Alert>
                    <div>
                        {this.state.posts.map((post, index) => (
                            <Card className="postcontent" key={index} body color="">
                                <CardTitle><Button color="info">{post.post_by}</Button></CardTitle>
                                <CardText color="info" style={{ fontFamily: "sans-srif", fontSize: "20px" }}>{post.post_content}</CardText>
                                <div>
                                    <p style={{ float: "left", paddingRight: "10px", color: "blue" }}>LIKE</p>
                                    <FontAwesomeIcon className="thumbs" icon={faThumbsUp} style={{ fontSize: "35px", paddingBottom: "10px" }} onClick={() => this.likeButton(post)}></FontAwesomeIcon>
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

            </div>
        )
    }
}