import { useState } from 'react';

const AUTHENTICATION_URL = process.env.REACT_APP_AUTHENTICATION_URL;

//Handles a uer's login
export default function Login({ setUser }) 
{
    //Defines email and password component states and sets the user's entered email and password
    const [email, setEmail] = useState(''), [password, setPassword] = useState('');

    const submit = async userEmail => 
    {
        //Prevents the browser from refreshing the page
        userEmail.preventDefault();

        //Uses the userLogin api to attempt to login the user based on their entered credentials
        const response = await fetch(
          `${AUTHENTICATION_URL}/api/authentication/login`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          }
        );
        const data = await response.json();
        
        //If a valid email and password combination is entered, a token is assigned to the user
        if (response.ok) 
            setUser(data.token);
        //If the email and password combination is not valid, an error is raised
        else 
            alert(data.error);
    };

    //Renders the login form
    return (
        <form onSubmit={submit}>
        <h2>Login</h2>
        <input placeholder="Email" onChange={userEmail=>setEmail(userEmail.target.value)} />
        <input type="password" placeholder="Password" onChange={userPassword=>setPassword(userPassword.target.value)} />
        <button>Login</button>
        </form>
    );
}
