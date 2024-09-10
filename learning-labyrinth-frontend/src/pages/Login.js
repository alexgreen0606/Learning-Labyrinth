import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import background from "../images/login.jpg";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, signup, loginWithToken } from '../store/account'
import Messenger from '../components/Messenger';
import '../styles/login.css'

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Global account object, which is updated after a successful login
    const account = useSelector(state => state.account)

    // the type of user signing up (1 = admin, 0 = user)
    const [userType, setUserType] = React.useState(0);

    // the type of app access being attempted (0 = login, 1 = signup)
    const [accessType, setAccessType] = React.useState(0);

    // the username typed by the user
    const [username, setUsername] = React.useState('');

    // the password typed by the user
    const [password, setPassword] = React.useState('');

    /**
     * On page load, if a token is stored in the browser, attempt to login with that token
     */
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            staySignedIn(token)
        }
    }, [])

    /**
     * When the global account changes, navigate to the corresponding homepage.
     */
    useEffect(() => {
        if (account.isAdmin !== null && account.isAdmin !== undefined) {
            if (account.isAdmin === true) {
                navigate('/adminHome')
            } else {
                navigate('/homepage')
            }
        }
    }, [account])

    /**
     * Sets the userType to the desired value.
     * 
     * @param {*} event 
     * @param {*} newValue - the new userType selected in the tabs
     */
    const handleUserTypeChange = (event, newValue) => {
        setUserType(newValue);
    };

    /**
     * Sets the accessType to the opposite of the current
     * selection.
     */
    const handleAccessTypeChange = () => {
        setAccessType((accessType + 1) % 2);
    };

    /**
     * Updates the username variable with the value typed in the textfield.
     * 
     * @param {*} event - the typing event made in the username textfield
     */
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    /**
     * Updates the password variable with the value typed in the textfield.
     * 
     * @param {*} event - the typing event made in the password textfield
     */
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    /**
     * Calls the Login API with the username and password
     */
    const handleLogin = async () => {
        dispatch(login(username, password));
    }

    /**
     * Calls the Signup API with the username, password, and userType
     */
    const handleSignup = () => {
        dispatch(signup(username, password, userType === 1))
    }

    /**
     * Calls the login API with the token stored in the browser.
     */
    const staySignedIn = (token) => {
        dispatch(loginWithToken(token))
    }

    return (
        <div
            className='login-page'
            style={{ backgroundImage: `url(${background})` }}
        >
            <div className='login-box'>
                {/* Sign Up / Sign In labels above login box */}
                {accessType === 0 && (
                    <h1 className='access-type-label'
                    >Sign In</h1>
                )}
                {accessType === 1 && (
                    <h1 className='access-type-label'
                    >Sign Up</h1>
                )}
                <Card
                    className='login-card'
                    variant='outlined'
                >
                    <CardContent>
                        <Box sx={{ width: '100%' }}>
                            {/* Tabs for switching between user or admin sign up */}
                            {accessType === 1 && (
                                <Box sx={{
                                    borderBottom: 1,
                                    borderColor: 'divider'
                                }}
                                >
                                    <Tabs value={userType} onChange={handleUserTypeChange}>
                                        <Tab label="User" />
                                        <Tab label="Admin" />
                                    </Tabs>
                                </Box>
                            )}
                            {accessType === 0 && (
                                <Box sx={{ height: '49px' }}></Box>
                            )}
                            <Box sx={{ p: 3 }}>
                                {/* Username and Password Input Fields */}
                                <TextField
                                    value={username}
                                    onChange={handleUsernameChange}
                                    label="Username"
                                    variant="outlined"
                                    style={{ width: '100%', marginBottom: '20px' }}
                                />
                                <TextField
                                    value={password}
                                    onChange={handlePasswordChange}
                                    label="Password"
                                    type='password'
                                    variant="outlined"
                                    style={{ width: '100%', marginBottom: '5px' }}
                                />
                                {/* Sign In button */}
                                {accessType === 0 && (
                                    <div className='login-button-container'>
                                        <Fab
                                            color='primary'
                                            variant="extended"
                                            className='login-button'
                                            onClick={handleLogin}
                                        >Sign In</Fab>
                                        <div style={{ marginTop: '20px' }}>
                                            <span>Need an account? </span>
                                            <span
                                                onClick={handleAccessTypeChange}
                                                className='link'
                                            >Click here.</span>
                                        </div>
                                    </div>
                                )}
                                {/* Sign Up button */}
                                {accessType === 1 && (
                                    <div className='login-button-container'>
                                        <Fab
                                            color='primary'
                                            variant="extended"
                                            onClick={handleSignup}
                                            className='login-button'
                                        >Sign Up</Fab>
                                        <div style={{ marginTop: '20px' }}>
                                            <span>Have an account? </span>
                                            <span
                                                onClick={handleAccessTypeChange}
                                                className='link'
                                            >Click here.</span>
                                        </div>
                                    </div>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </div>
            <Messenger></Messenger>
        </div>
    );
}

export default Login;