import { useEffect} from 'react';
import {useNavigate} from 'react-router-dom';


const Protected = (props:any) => {

    const navigate = useNavigate();
    const {Component} = props;

    useEffect(() => {
        const token = localStorage.getItem('token');

        if(!token){
            //@ts-ignore
            const checker = JSON.parse(token);
            if(checker.approval !== 0){
            localStorage.setItem('loginStatus','You need to login first')
            navigate('/',{replace:true});
            }else{
                alert('Wait for account verification by admin')
            }
        }
    },[]);
    
    return (
        <Component />
     )
     
 }

export default Protected;
  


 