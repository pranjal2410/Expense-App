import React, {useState} from 'react';
import { Container, Typography, makeStyles, Paper, TextField, Button, Avatar } from '@material-ui/core';
import {LockOpen, LockOutlined, Visibility, VisibilityOff} from '@material-ui/icons';
import {BrowserRouter, Link, useHistory} from 'react-router-dom';
import Slide from "@material-ui/core/Slide";
import axios from 'axios';
import AccountBalanceRoundedIcon from '@material-ui/icons/AccountBalanceRounded';
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    cont : {
        paddingTop: '5%'
    },
    heading : {
        paddingTop: '10px'
    },
    avatar: {
        margin: 'auto',
        backgroundColor: theme.palette.secondary.main,
    },
    login : {
        paddingTop: '10px',
        fontStyle: 'bold'
    },
    form : {
        padding: '20px',
        paddingTop: '0px',
        paddingBottom: '10px',
        color: 'white',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    grid : {
        paddingTop: '10px',
    },
    link : {
        textDecoration: 'none',
        color : theme.palette.secondary.main,
    },
    slideAvatar: {
        margin: "auto",
        position: 'relative',
    },
    main : {
        color:'#fff',
        paddingTop:'4%',
        [theme.breakpoints.down('md')] : {
            fontSize: '70px',
            paddingTop: '12%'
        }
    },
}));



const SignUp = () => {
    const classes = useStyles();
    const [values,setValues] = useState({
        username: '',
        password: '',
        showPassword: false,
    })

    const handleChange = (e) => {
        setValues({...values, [e.currentTarget.id]: e.currentTarget.value})
    }
    const [isAuthenticated, setAuth] = useState('false')
    const [SignUpError, setSignUpError] = useState(null);
    let history = useHistory();

    const handleSubmit = (event) => {
        console.log('submitted')
        event.preventDefault();
        axios({
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            data: {
                "username": values.email,
                "password": values.password
            },
            url: 'http://127.0.0.1:8000/api/SignUp/'
        })
            .then((response) => {
                console.log('success')
                console.log(response.data.token)
                setAuth(response.data.isAuthenticated)
                localStorage.setItem('token', response.data.token)
                if(response.data.success)
                    history.push('/Home/')
                else
                    setSignUpError(response.data.message)
            })
            .catch((error)=> {
                console.log(error)
            })
    }
    const [checked, setChecked] = useState(false);

    return (
        <Container component="main" maxWidth="sm">
            <Typography variant="h3" align="center" className={classes.main}>
                THE EXPENSE APP <AccountBalanceRoundedIcon fontSize="large"/>
            </Typography>
            <div className={classes.cont}>
                    <Paper elevation={15}>
                        <div className={classes.heading}>
                            <Avatar className={classes.avatar}>
                                <LockOpen />
                            </Avatar>
                            <Typography className={classes.login} align="center" variant="h4">
                                BREAK THE LOCK
                            </Typography>
                        </div>
                        <form className={classes.form} onSubmit={handleSubmit} noValidate>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                id="full name"
                                label="Full Name"
                                type="text"
                                style={{ width: 200}}
                                autoComplete="Full Name"
                                onChange={handleChange}
                                required autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                id="email"
                                label="Contact Number"
                                style={{ marginLeft: '10px', width: 200}}
                                type="number"
                                autoComplete="Contact Number"
                                onChange={handleChange}
                                required autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                id="email"
                                label="Email"
                                type="email"
                                autoComplete="Email"
                                onChange={handleChange}
                                required autoFocus fullWidth
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type={values.showPassword? "text":"password"}
                                style={{ width: 200}}
                                id="password"
                                onChange={handleChange}
                                autoComplete="password"
                                InputProps = {{
                                    endAdornment:
                                        <IconButton
                                            aria-label= "toggle password visibility"
                                            onClick={() => setValues({...values, showPassword:  !values.showPassword})}
                                        >
                                            { values.showPassword ? <Visibility/> : <VisibilityOff />}
                                        </IconButton>

                                }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Confirm Password"
                                type={values.showPassword? "text":"password"}
                                style={{ marginLeft: '10px', width: 200}}
                                id="confirm_password"
                                onChange={handleChange}
                                autoComplete="confirm password"
                                InputProps = {{
                                    endAdornment:
                                        <IconButton
                                            aria-label= "toggle password visibility"
                                            onClick={() => setValues({...values, showPassword:  !values.showPassword})}
                                        >
                                            { values.showPassword ? <Visibility/> : <VisibilityOff />}
                                        </IconButton>

                                }}
                            />
                            <Divider/>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Flat No"
                                type="password"
                                id="confirm_password"
                                style={{ width: 200}}
                                onChange={handleChange}
                                autoComplete="confirm password"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                className={classes.submit}
                                onClick={() => setChecked(false)}
                            >
                                Sign Up
                            </Button>
                            <div style={{textAlign: "center"}} className={classes.link} onClick={() => history.push('/')}>Login</div>
                        </form>
                    </Paper>
            </div>
            </Container>
    )

}

export default SignUp;