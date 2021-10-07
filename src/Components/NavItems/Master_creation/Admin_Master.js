import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';

const INSERT_ADMIN=gql`
mutation MyMutation($email_id: String = "", $mobile_no: String = "", $name: String = "", $password: String = "", $subscription_from: date = "", $subscription_to: date = "", $username: String = "") {
    insert_admin_user_one(object: {email_id: $email_id, mobile_no: $mobile_no, name: $name, password: $password, subscription_from: $subscription_from, subscription_to: $subscription_to, username: $username}) {
      id
    }
  }
`
const READ_ADMIN=gql`
subscription MySubscription {
    admin_user {
      email_id
      id
      mobile_no
      name
      password
      subscription_from
      subscription_to
      username
    }
  }
`
const UPDATE_ADMIN=gql`
mutation MyMutation($email_id: String = "", $mobile_no: String = "", $name: String = "", $password: String = "", $subscription_from: date = "", $subscription_to: date = "", $username: String = "", $id: Int = 0) {
    update_admin_user_by_pk(pk_columns: {id: $id}, _set: {email_id: $email_id, mobile_no: $mobile_no, name: $name, password: $password, subscription_from: $subscription_from, subscription_to: $subscription_to, username: $username}) {
      id
    }
  }
`
const DELETE_ADMIN=gql`
mutation MyMutation($id: Int = 0) {
    delete_admin_user_by_pk(id: $id) {
      id
    }
  }
  
`

function Admin_Master(){
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [admin,setAdmin]=useState({
        name:'',
        mobile_no:'',
        subscription_from:'',
        subscription_to:'',
        username:'',
        password:'',
        email_id:''
    });
    const [modalAdmin,setModalAdmin]=useState({
        id:'',
        name:'',
        mobile_no:'',
        subscription_from:'',
        subscription_to:'',
        username:'',
        password:'',
        email_id:''
    });
    const onInputChange=(e)=>{
        setAdmin({...admin,[e.target.name]:e.target.value})
    }
    const onFormSubmit=(e)=>{
        e.preventDefault();
        insert_admin({variables:{name:admin.name,mobile_no:admin.mobile_no,subscription_from:admin.subscription_from,subscription_to:admin.subscription_to,username:admin.username,password:admin.password,email_id:admin.email_id}})
        toast.configure();
        toast.success('Successfully Inserted')
    }
    const onEdit=(row)=>{
        handleShow();
        setModalAdmin({
            id:row.id,
            name:row.name,
            email_id:row.email_id,
            subscription_from:row.subscription_from,
            subscription_to:row.subscription_to,
            mobile_no:row.mobile_no,
            username:row.username,
            password:row.password
        })
    }
    const onModalInputChange=(e)=>{
        setModalAdmin({...modalAdmin,[e.target.name]:e.target.value});
    }
    const onModalFormSubmit=(e)=>{
        e.preventDefault();
        update_admin({variables:{id:modalAdmin.id,name:modalAdmin.name,email_id:modalAdmin.email_id,mobile_no:modalAdmin.mobile_no,subscription_from:modalAdmin.subscription_from,subscription_to:modalAdmin.subscription_to,username:modalAdmin.username,password:modalAdmin.password}});
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }
    const onDelete=(id)=>{
        delete_admin({variables:{id:id}})
        toast.configure();
        toast.error('Successfully Deleted')
    }
    //Queries
    const [insert_admin]=useMutation(INSERT_ADMIN);
    const [update_admin]=useMutation(UPDATE_ADMIN);
    const [delete_admin]=useMutation(DELETE_ADMIN);
    const read_admin=useSubscription(READ_ADMIN);
    if(read_admin.loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 160,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 160
        },
        {
            field: 'mobile_no',
            headerName: 'Mobile No',
            width: 160
        },
        {
            field: 'email_id',
            headerName: 'Email ID',
            width: 160
        },
        {
            field: 'subscription_from',
            headerName: 'Subscription From',
            width: 160
        },
        {
            field: 'subscription_to',
            headerName: 'Subscription To',
            width: 160
        },
        {
            field: 'username',
            headerName: 'Username',
            width: 160
        },
        {
            field: 'password',
            headerName: 'Password',
            width: 160
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="">
                        <button onClick={() => onEdit(params.row)} data-toggle="tooltip" title="Edit" type="button" className="btn btn-warning"  ><i className="bi bi-pencil-fill"></i></button>
                        <button onClick={() => onDelete(params.row.id)} data-toggle="tooltip" title="Delete" style={{ marginLeft: '20%' }} className="btn btn-danger" ><i className="bi bi-trash-fill"></i></button>
                    </div>
                );
            }
        },
    ];
    const rows=read_admin.data.admin_user;
    return(
        <div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Admin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-md-6">
                        <form onSubmit={onModalFormSubmit} className="form-group">
                            <div className="field">
                                <label>ID</label>
                                <input defaultValue={modalAdmin.id} onChange={onModalInputChange} className="form-control" name="id" type="text" required/>
                            </div>
                            <div className="field">
                                <label>Name</label>
                                <input defaultValue={modalAdmin.name} onChange={onModalInputChange} className="form-control" name="name" type="text" required />
                            </div>
                            <div className="field">
                                <label>Mobile No</label>
                                <input defaultValue={modalAdmin.mobile_no} onChange={onModalInputChange} className="form-control" name="mobile_no" type="number" required />
                            </div>
                            <div className="field">
                                <label>Email Id</label>
                                <input defaultValue={modalAdmin.email_id} onChange={onModalInputChange} className="form-control" name="email_id" type="email" required />
                            </div>
                            <div className="field">
                                <label>Subscription From</label>
                                <input defaultValue={modalAdmin.subscription_from} onChange={onModalInputChange} className="form-control" name="subscription_from" type="text" required />
                            </div>
                            <div className="field">
                                <label>Subscription To</label>
                                <input defaultValue={modalAdmin.subscription_to} onChange={onModalInputChange} className="form-control" name="subscription_to" type="text" required />
                            </div>
                            <div className="field">
                                <label>Username</label>
                                <input defaultValue={modalAdmin.username} onChange={onModalInputChange} className="form-control" name="username" type="text" required />
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <input defaultValue={modalAdmin.password} onChange={onModalInputChange} className="form-control" name="password" type="text" required />
                            </div><br />
                            <div className="field">
                                <button className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
             <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>
                <h4 className="text-center">ADMIN MASTER</h4>

                <form onSubmit={onFormSubmit} className="form-group" padding="2px">
                    <div className="row">
                        <div className="field col-md-6">
                            <label>Name</label>
                            <input onChange={onInputChange} type="text" name="name" className="form-control"  required/>
                        </div>
                        <div className="field col-md-6">
                            <label>Mobile No</label>
                            <input onChange={onInputChange} type="number" name="mobile_no" className="form-control"  required/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="field col-md-6">
                            <label>Subscription From</label>
                            <input onChange={onInputChange} type="date" name="subscription_from" className="form-control" />
                        </div>
                        <div className="field col-md-6">
                            <label>Subscription To</label>
                            <input onChange={onInputChange} type="date" name="subscription_to" className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                    <div className="field col-md-6">
                            <label>Username</label>
                            <input onChange={onInputChange} type="text" name="username" className="form-control" />
                        </div>
                        <div className="field col-md-6">
                            <label>Password</label>
                            <input onChange={onInputChange} type="text" name="password" className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="field col-md-6">
                            <label>Email Id</label>
                            <input onChange={onInputChange} type="email" name="email_id" className="form-control"  required/>
                        </div>
                    </div>
                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>
                        <button className="btn btn-primary" type='reset'>Reset</button>
                        {/* <button className="btn btn-primary" type='Next' style={{ marginLeft: '5%' }}>Next</button> */}
                    </div>
                </form>
            </Card>
            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>

                <div style={{ height: 500, width: '100%', padding: '3%' }}>
                    <div style={{ height: 500, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            style={{ borderTop: '4px' }}
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}
export default Admin_Master;