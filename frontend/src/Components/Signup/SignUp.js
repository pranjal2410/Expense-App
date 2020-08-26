import React, {useState} from 'react';
import { Container, Typography, makeStyles, Paper, TextField, Button, Avatar } from '@material-ui/core';
import { LockOpen, LockOutlined } from '@material-ui/icons';
import {BrowserRouter, Link, useHistory} from 'react-router-dom';
import Slide from "@material-ui/core/Slide";
import axios from 'axios';
import AccountBalanceRoundedIcon from '@material-ui/icons/AccountBalanceRounded';

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
        color: 'white'
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
        password2: '',

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
                                autoComplete="Full Name"
                                onChange={handleChange}
                                fullWidth required autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                id="email"
                                label="Email"
                                type="email"
                                autoComplete="Email"
                                onChange={handleChange}
                                fullWidth required autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                id="password"
                                onChange={handleChange}
                                autoComplete="password"
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
                            <div style={{textAlign: "center"}} className={classes.link} onClick={() => history.push('/Login/')}>Login</div>
                        </form>
                    </Paper>
            </div>
            </Container>
    )

}

export default SignUp;