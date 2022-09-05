import React, { useState, useEffect } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { Grid, TextField, Dialog, DialogTitle, DialogContent, ButtonGroup, Button, DialogContentText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from 'react-helmet'
import { Breadcrumb, ConfirmationDialog } from 'egret'
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import EmployeeEditorDialog from "./EmployeeEditorDialog";
import { searchByDto, deleteEmployee, updateEmployee } from "./EmployeeService";
import { toast } from 'react-toastify';

toast.configure({
    autoClose: 1000,
    draggable: false,
    limit: 3
});

const useStyles = makeStyles((theme) => ({
    box: {
        display: 'flex',
        margin: '5px 0',
        alignItems: 'space-evenly',
        padding: theme.spacing(1)
    },

    groupButton: {
        marginLeft: 10,
        marginTop: 20,
        display: 'flex',
        justifyContent: 'end',
    },
    search: {
        width: '25%',
        marginLeft: 'auto'
    },
    button1: {
        marginLeft: 5,
    },
    dialogContentText: {
        marginBottom: 20

    },
    textField: {
        margin: theme.spacing(1),
    },
    dialogTitle: {
        marginBottom: 10


    }
}));

function Employee() {
    const classes = useStyles();

    const [itemList, setItemList] = useState([]);
    const [state, setState] = useState(true);
    const [open, setOpen] = useState(false);
    const [deleteButton, setDeleteButton] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [search, setSearch] = useState('');
    const [oldUser, setOldUser] = useState({})

    const columns = [
        {
            title: 'Actions', field: '',
            render: (rowData) => (
                <>
                    <ButtonGroup variant="text">
                        <Button>
                            <EditIcon color="primary" onClick={() => {
                                handleEdit(rowData)
                            }} />
                        </Button>
                        <Button>
                            <DeleteIcon color="error" onClick={() => {
                                handleOpenDelete(rowData)
                            }} />
                        </Button>
                    </ButtonGroup>
                </>
            )
        },
        { title: "Name", field: "name" },
        { title: "Code", field: "code" },
        { title: "Age", field: "age" },
        { title: "Phone", field: "phone" },
        { title: "Email", field: "email" },

    ];


    useEffect(() => {
        if (search) {
            searchByDto({}).then(res => {
                setItemList(res.data.data.filter(employee => handleSearch(employee)))
            })
        }
        if (state) {
            reRender();

        }
    }, [state, search]);



    //Render
    const reRender = () => {
        searchByDto({})
            .then((res) => {
                setItemList(res.data.data);
            });
    }

    {/* Search*/ }

    const handleSearch = (employee) => {
        if (search === "") {
            return employee
        } else {
            if (search !== "") {
                if (employee.name.toLowerCase().includes(search.toLowerCase())) {
                    return employee
                }
            }
        }
    }

    //edit
    const handleOpen = () => {
        setOpen(true);
        setOldUser({})

    };

    const handleClose = () => {
        setOpen(false)
        reRender()


    };


    //delete

    const handleClose__Delete = () => {
        setDeleteButton(false);



    };
    const handleOpenDelete = (rowData) => {
        setDeleteButton(true)

        setOldUser(rowData)
    }
    const handleDeleteEmployee = (data) => {
        setOldUser(data)


        deleteEmployee(data).then(() => {
            reRender()
            handleClose__Delete()
            toast.success("Xóa thành công")

        })
    }


    // edit
    const handleEdit = (rowData) => {
        setOpen(true)
        setOldUser(rowData)

    }


    const handleSubmit = (name, age, code, email, phone, province, district, commune) => {

    }



    return (


        <div className="m-sm-30">

            <EmployeeEditorDialog
                employeeData={oldUser}
                setstate={setState}
                state={state}
                handleClose={handleClose}
                submit={submit}
                open={open}
                setOpen={setOpen}
                reRender={reRender}
                setSubmit={setSubmit}
                setHandleSubmit={
                    (name, age, code, email, phone, province, district, commune) =>
                        handleSubmit(name, age, code, email, phone, province, district, commune)} />

            <Grid className={classes.box}>
                <Helmet>
                    <title>Quản lý nhân viên</title>
                </Helmet>
                <div>
                    <Breadcrumb
                        routeSegments={[
                            { name: "Danh mục", path: "/directory/apartment" },
                            { name: "Nhân viên" },
                        ]}
                    />
                </div>
            </Grid>

            <Grid className={classes.box}>

                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Thêm mới
                    <PersonAddIcon className={classes.button1} />
                </Button>


                {/* Search Input */}
                <Grid className={classes.search}>

                    <TextField
                        label="Search"
                        type="text"
                        fullWidth
                        value={search}
                        onChange={(e) => {
                            e.preventDefault()
                            setSearch(e.target.value)
                        }}
                        InputProps={{
                            startAdornment: (
                                <SearchIcon />
                            )
                        }}

                    />

                </Grid>
            </Grid>

            <Grid>
                <ConfirmationDialog
                    open={deleteButton}
                    onConfirmDialogClose={handleClose__Delete}
                    onYesClick={() => {
                        handleDeleteEmployee(oldUser)
                    }}
                    text={'Bạn có chắc xóa: ' + oldUser.name}
                    cancel={'Cancel'}
                    agree={'Agrre'}

                />
                {/* <Dialog open={deleteButton} onClose={handleClose__Delete} >
                    <DialogTitle className={classes.dialogTitle}>Delete Confirm</DialogTitle>


                    <DialogContent>
                        <DialogContentText className={classes.dialogContentText}>
                            Bạn có chắc xóa {oldUser.name}
                        </DialogContentText>
                        <Grid >
                            <Button
                                style={{
                                    float: 'right',

                                }}
                                variant='contained'

                                color="secondary"
                                onClick={() => {
                                    handleDeleteEmployee(oldUser)
                                }}>
                                Yes
                            </Button>
                            <Button
                                style={{
                                    float: 'right',
                                    marginRight: '10px'

                                }}
                                variant='contained'
                                color="primary"
                                onClick={() => {
                                    handleClose__Delete()
                                }}
                            >
                                No
                            </Button>

                        </Grid>
                    </DialogContent>

                </Dialog> */}

            </Grid>

            <Grid xs={12}>
                <MaterialTable
                    title={""}
                    data={itemList}
                    columns={columns}

                    options={{
                        selection: false,
                        paging: true,
                        search: false,
                        exportButton: true,

                        rowStyle: (rowData, index) => ({
                            backgroundColor: (index % 2 === 1) ? '#EEE' : '#FFF',
                        }),
                        headerStyle: {
                            backgroundColor: '#358600',
                            color: '#fff',
                        },
                        padding: 'dense',
                        toolbar: true
                    }}
                    localization={{
                        body: {
                            emptyDataSourceMessage:
                                "No data",
                        },
                    }}

                />
            </Grid>

        </div>
    );
}

export default Employee;
