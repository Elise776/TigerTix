export default function Navbar({ user, setUser }) 
{
    const logout = async () => 
    {
        await fetch('http://localhost:8001/api/authentication/logout', { method: 'POST', credentials: 'include' });
        setUser(null);
    };
    
    return (
        <nav>
        {user ? (
            <>
            <span>Logged in</span>
            <button onClick={logout}>Logout</button>
            </>
        ) : <span>Guest</span>}
        </nav>
    );
}
