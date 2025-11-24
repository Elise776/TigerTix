import { useState } from 'react';

const AUTHENTICATION_URL = process.env.REACT_APP_AUTHENTICATION_URL;

//Handles user registration
export default function Register() 
{
    //Creates local state variables and stores user's input email and password
    const [email, setEmail] = useState(''), [password, setPassword] = useState('');

    const submit = async submission => 
    {
        //Prevents the browser from refreshing
        submission.preventDefault();

        //Uses the registerUser api to send a POST request to register the user
        const response = await fetch(
          `${AUTHENTICATION_URL}/api/authentication/register`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          }
        );

        //Lets the user know if registration was sucessful
        alert((await response.json()).message);
    };

    //Renders the registration page
    return (
        <form onSubmit={submit}>
        <h2>Register</h2>
        <input placeholder="Email" onChange={userEmail=>setEmail(userEmail.target.value)} />
        <input type="password" placeholder="Password" onChange={userPassword=>setPassword(userPassword.target.value)} />
        <button>Register</button>
        </form>
    );
}
