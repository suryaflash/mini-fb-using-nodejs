import React from 'react';
import { Alert, Tooltip ,Button , Card, CardTitle, CardText, Navbar, NavItem, Collapse, Nav, NavbarToggler } from 'reactstrap';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

var cookies = new Cookies();

export default class timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            likelist : []
        };
    }

    timelinePost = () =>
   { 
       fetch('http://localhost:8082/timelinePost')
        .then(response => response.json()
            .then((data => {
                this.setState({ posts: data },()=>console.log(this.state.posts))
            }))
            )
        .catch(error => {
            if (error) throw error;
        });
    }

    likelist = (post) =>
    {
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
                this.setState({ likelist: data },()=>console.log(this.state.likelist))
            }))
            .catch(error => { if (error) throw error; })
    }

    componentWillMount = () => {

        if (cookies.get('name') == undefined)
            window.location.href = "/login";
        this.timelinePost();
    }

    
    likeButton = (post) => 
    {
        const data =
        {
            post_id: post.post_id,
            liked_by_uid: cookies.get('uid')
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
            .then((data)=>this.timelinePost())
            .catch(error => { if (error) throw error; })
    }

    render() {
        const classes = 'tooltip-inner'
        return (
            <div className="container">
                <Navbar color="link" light expand="md">
                    <NavbarToggler onClick={this.toggle} />

                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>

                        <NavItem className="homee">
              <Link to ="/home" >HOME</Link>
            </NavItem>

            <NavItem className="sessionowner3">
                <Link to ="/wall" onClick={this.timeline}>WALL</Link>
              </NavItem>

            <NavItem className="sessionowner">
                <Link to ="/timeline" onClick={this.timeline}>TIMELINE</Link>
              </NavItem>

              <NavItem className="sessionowner">
                Hi {cookies.get('name')} 
              </NavItem>
      
             <NavItem>
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
                                {/* <CardText>Content :</CardText> */}
                                <CardText color ="info" style={{fontFamily:"sans-srif",fontSize:"20px"}}>{post.post_content}</CardText>
                                <div>
                                    <p style={{float:"left",paddingRight:"10px",color:"blue"}}>LIKE</p>
                                <FontAwesomeIcon className="thumbs" icon={faThumbsUp} style={{fontSize:"35px",paddingBottom:"10px"}}onClick={()=>this.likeButton(post)}></FontAwesomeIcon>
                                <span class="show" onMouseOver={()=>this.likelist(post)} style={{fontSize:"20px",paddingLeft:"10px",paddingTop:"20px"}}>{post.likes} 
                                <ul class="list-likers">
                                    {
                                        this.state.likelist.map((mail ,idx) => (
                                            <div key={idx}>
                                             <li style={{fontFamily:"helvetica",fontSize:"15px"}}><b> {mail.mail_id}</b></li>
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