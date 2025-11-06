import { useState } from 'react';
export default function Login({ setUser }) 
{
    const [email, setEmail] = useState(''), [password, setPassword] = useState('');
    const submit = async userEmail => 
    {
        userEmail.preventDefault();
        const response = await fetch('http://localhost:8001/api/authentication/login', {method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })});
        const data = await response.json();
        if (response.ok) 
            setUser(data.token);
        else 
            alert(data.error);
    };
  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={userEmail=>setEmail(userEmail.target.value)} />
      <input type="password" placeholder="Password" onChange={userPassword=>setPassword(userPassword.target.value)} />
      <button>Login</button>
    </form>
  );
}
