import { Component } from "react";

class UserList extends Component {
    constructor(props) {
        super(props)
    }

    deleteUser = (user) => {
        this.props.deleteUser(user)
    }
    updateUser = (user) => {
        this.props.updateUser(user)
    }
    render() {
        return <table className="table">
            <thead>
                <tr>
                    <th scope="col">Sl #</th>
                    <th scope="col">FirstName</th>
                    <th scope="col">LastName</th>
                    <th scope="col">eMail</th>
                    <th scope="col">Age</th>
                    <th colSpan={2} scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {this.props.users && this.props.users.map((user, index) => {
                    /* return <li>{user.name}</li> })} */
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{user.firstName} </td>
                        <td>{user.lastName}</td>
                        <td>{user.userEmail}</td>
                        <td>{user.userAge}</td>
                        <td><button className="btn btn-danger" onClick={() => this.deleteUser(user)}>Delete</button></td>
                        <td><button className="btn btn-warning" onClick={() => this.updateUser(user)} >Update</button></td>
                    </tr>
                })
                }
            </tbody>
        </table>
    }
}

export default UserList