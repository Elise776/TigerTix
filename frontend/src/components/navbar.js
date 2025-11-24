const AUTHENTICATION_URL = process.env.REACT_APP_AUTHENTICATION_URL;

export default function Navbar({ user, setUser }) 
{
    //Handles user logout
    const logout = async () => 
    {
        //Sends a post request and uses the userLogout api to logout the user
        await fetch(`${AUTHENTICATION_URL}/api/authentication/logout`, {
          method: 'POST',
          credentials: 'include'
        });
        
        //Resets the user
        setUser(null);
    };
    
    //Displays the nav bar
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
