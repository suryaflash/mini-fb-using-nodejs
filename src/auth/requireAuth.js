// import React,{Component} from 'react';
// import Cookies from 'universal-cookie';
// import {Redirect} from 'react-router-dom';
// const cookies = new Cookies();
// export default function(MyComponent)
// {
//     class Authentication extends Component 
//     {
//         state =
//         {
//             flag:false
//         }
//         componentDidMount()
//         {
//             const user =cookies.get("name");
//             if(!user)
//             {
//              window.location.href='/';
//             }
//         }
//         render()
//         {
//             return < MyComponent {...this.props} />
//         }
//     }
// }