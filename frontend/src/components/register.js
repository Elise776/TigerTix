import { useState } from 'react';
export default function Register() {
  const [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const submit = async submission => 
    {
        submission.preventDefault();
        const response = await fetch('http://localhost:8001/api/authentication/register', {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })});
        alert((await response.json()).message);
    };
  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      <input placeholder="Email" onChange={userEmail=>setEmail(userEmail.target.value)} />
      <input type="password" placeholder="Password" onChange={userPassword=>setPassword(userPassword.target.value)} />
      <button>Register</button>
    </form>
  );
}
