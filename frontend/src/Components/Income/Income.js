import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import FormGroup from '@material-ui/core/FormGroup';
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import {useHistory, useLocation} from "react-router-dom";
import axios from 'axios';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    root: {
        justifyContent: 'left',
    },
    wrapper: {
        width: 100 + theme.spacing(2),
    },
    paper: {
        zIndex: 1,
        marginTop: theme.spacing(10),
        justifyContent: 'center'
    },
    table: {
        minWidth: 450,
    },
}))

function createData(date, amount, source, color, id) {
    return { date, amount, source, color, id };
}

function sourceData(source, update, delete_source, id) {
    return { source, update, delete_source, id }
}

export default function Income() {
    const [state, setState] = React.useState(true);
    let history = useHistory();
    let location = useLocation();

    const handleChange = (event) => {
        setState(!state);
    };
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [sources, setSources] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios({
            method: 'GET',
            headers: {
                "content-type" : "application/json",
                "Authorization": `Token ${token}`
            },
            url: 'http://127.0.0.1:8000/api/Income/'
        }).then((response) => {
            console.log(response.data)
            var id = 0;
            let rows_local = []
             response.data.Incomes.map((income) => {
                 const row = createData(income.date, income.amount, income.source, (income.amount === response.data.min_amount)?'red': (income.amount === response.data.max_amount)? 'green': 'yellow', id++)
                 rows_local.push(row)
             })
            setRows(rows_local)
            let sources_local = []
            response.data.sources.map((source) => {
                const row = sourceData(source.source, <Button variant="contained" color="primary">
                    Update
                </Button>, <Button variant="contained" color="secondary">
                    Delete
                </Button>, source.pk)
                sources_local.push(row)
            })
            setSources(sources_local)
        })
    }, [])

    return (
        <>
            <FormGroup row className={classes.root}>
                <RadioGroup row aria-label="position" name="position" defaultValue="top">
                    <FormControlLabel
                        value="Report"
                        control={<Radio color="primary" onChange={handleChange}/>}
                        label="Report"
                        labelPlacement="start"
                        checked={state}
                    />
                    <FormControlLabel
                        value="Sources"
                        control={<Radio color="primary" onChange={handleChange}/>}
                        label="Sources"
                        labelPlacement="start"
                    />
                </RadioGroup>
            </FormGroup>
            <Slide direction="down" in={state} mountOnEnter unmountOnExit>
                <Paper elevation={10} className={classes.paper}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell align="right">Source</TableCell>
                                    <TableCell align="right">Update</TableCell>
                                    <TableCell align="right">Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.date}
                                        </TableCell>
                                        <TableCell align="right">{row.amount}</TableCell>
                                        <TableCell align="right">{row.source}</TableCell>
                                        <TableCell align="right"><Button variant="contained" color="primary">
                                            Update
                                        </Button></TableCell>
                                        <TableCell align="right"><Button variant="contained" color="secondary">
                                            Delete
                                        </Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Slide>
            <Slide direction="up" in={!state} mountOnEnter unmountOnExit>
                <Paper elevation={10} className={classes.paper}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Source</TableCell>
                                    <TableCell align="right">Update</TableCell>
                                    <TableCell align="right">Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sources.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.source}
                                        </TableCell>
                                        <TableCell align="right">{row.update}</TableCell>
                                        <TableCell align="right">{row.delete_source}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Slide>
        </>
    );
}
