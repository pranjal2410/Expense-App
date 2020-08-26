import React, {useState} from 'react';
import { Container, Typography, makeStyles, Paper, TextField, Button, Avatar } from '@material-ui/core';
import { LockOpen, LockOutlined } from '@material-ui/icons';
import {BrowserRouter, Link, useHistory} from 'react-router-dom';
import Slide from "@material-ui/core/Slide";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    cont : {
        paddingTop: '15%'
    },
    welcome : {
        fontSize: '31px',
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
    }
}));



const Login = () => {
    const classes = useStyles();
    const [values,setValues] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setValues({...values, [e.currentTarget.id]: e.currentTarget.value})
    }
    const [isAuthenticated, setAuth] = useState('false')
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
            url: 'http://127.0.0.1:8000/api/Login/'
        })
            .then((response) => {
                console.log('success')
                console.log(response.data.token)
                setAuth(response.data.isAuthenticated)
                localStorage.setItem('token', response.data.token)
                if(isAuthenticated === 'true')
                    history.push('/Home/')
                else
                    history.push('/Income/')
            })
            .catch((error)=> {
                console.log(error)
            })
    }
    const [checked, setChecked] = useState(false);

    return (
        <Container component="main" maxWidth="sm">
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
                            Log In
                        </Button>
                        <div style={{textAlign: "center"}} onClick={() => history.push('/')} className={classes.link}>SignUp</div>
                    </form>
                </Paper>
            </div>
        </Container>
    )

}

export default Login;