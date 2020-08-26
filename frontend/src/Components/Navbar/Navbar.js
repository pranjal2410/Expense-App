import React, {useState, useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {NavLink, Route} from "react-router-dom";
import HomeRoundedIcon from '@material-ui/icons/Home';
import AccountBalanceRoundedIcon from '@material-ui/icons/AccountBalanceRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import AccountBalanceWalletRoundedIcon from '@material-ui/icons/AccountBalanceWalletRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Income from "../Income/Income";
import Login from "../Login/Login";
import {BrowserRouter, useLocation} from "react-router-dom";
import ProfileUpdate from "../Profile/ProfileUpdate";

const drawerWidth = 240;

const userIcons = [
    {icon: <HomeRoundedIcon style={{color: 'white'}}/>, id: 'Home', text: 'Home'},
    {icon: <AccountBalanceRoundedIcon style={{color: 'white'}}/>, id: 'Income', text: 'Income'},
    {icon: <AccountBalanceWalletRoundedIcon style={{color: 'white'}}/>, id: 'Expense', text: 'Expense'},
    {icon: <ExitToAppRoundedIcon style={{color: 'white'}}/>, id: 'Logout', text: 'Logout'},
]

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        background: 'rgb(50, 65, 77)',
        color: 'white',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    navContent: {
        textDecoration: 'none',
        color: 'white',
    },
    navProfile: {
        height: '80px',
        width: '80px',
        color: 'white',
        marginTop: '10px',
        marginLeft: '75px'
    },
    navProfileText: {
        marginLeft: '90px',
        marginTop: '10px',
        color: 'white',
        height: '40px',
        width: '80px',
        marginBottom: '10px',
    },
}));

export default function Navbar(props) {
    const classes = useStyles();
    const [appTitle, setTitle] = useState('Home')
    let location = useLocation();
    useEffect(() => {
        setTitle(location.pathname.slice(1, location.pathname.length-1).toUpperCase())
    }, [location])

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        {appTitle}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar} />
                <Divider/>
                <NavLink to="/Profile/" className={classes.navContent}>
                    <ListItemIcon><AccountCircleIcon className={classes.navProfile}/></ListItemIcon>
                </NavLink>
                <NavLink to="/Profile/" className={classes.navContent}>
                    <ListItemText primary="Profile" className={classes.navProfileText}/>
                </NavLink>
                <Divider />
                <List>
                    {userIcons.map((IconInfo, index) => {
                         return IconInfo.text !== 'Logout'? (
                             <NavLink to={'/'+IconInfo.text+'/'} key={IconInfo.id} className={classes.navContent}>
                                 <ListItem button>
                                     <ListItemIcon>{IconInfo.icon}</ListItemIcon>
                                     <ListItemText primary={IconInfo.text.toUpperCase()} style={{textDecoration: 'none'}}/>
                                 </ListItem>
                             </NavLink>
                         ):(
                             <ListItem button key={IconInfo.id}>
                                 <ListItemIcon>{IconInfo.icon}</ListItemIcon>
                                 <ListItemText primary={IconInfo.text.toUpperCase()} style={{textDecoration: 'none'}}/>
                             </ListItem>
                         )
                        }
                    )}
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <BrowserRouter>
                    <Route exact path='/Profile/' component={ProfileUpdate}/>
                    <Route exact path='/Home/' component={Login}/>
                    <Route exact path='/Income/' component={Income}/>
                    <Route exact path='/Expense/' component={Login}/>
                </BrowserRouter>
            </main>
        </div>
    );
}