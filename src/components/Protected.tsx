import { useEffect} from 'react';
import {useNavigate} from 'react-router-dom';


const Protected = (props:any) => {

    const navigate = useNavigate();
    const {Component} = props;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token){
            localStorage.setItem('loginStatus','You need to login first')
            navigate('/',{replace:true});
        }
    },[]);
    
    return (
        <Component />
     )
     
 }

export default Protected;
  


 