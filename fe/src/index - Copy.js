import { Component } from 'react';
import ReactDOM from 'react-dom';
import fetch from 'fetch'
import axios from 'axios'
import RegistrationForm from './components/registration-form';
class MainApp extends Component {
  state = {
    users: undefined,
    addUser: false,
    firstTimeAddUser: true,
    editUser: false,
    userFirstName: '',
    userLastName: '',
    userEmail: '',
    userAge: '',
    userAgeError: '',
    currentUser: null
  }
  constructor() {
    super()
  }
  baseUrl = "http://localhost:5050"

  componentDidMount() {
    this.fetchWithAxios()
  }
  fetchUserData = () => {
    fetch.fetchUrl('http://localhost:5050/data1', (error, meta, data) => {
      this.setState({ users: JSON.parse(data) })
    })
  }
  fetchWithAxios = () => {
    axios.get(`${this.baseUrl}/data`).then((response) => {
      this.setState({ users: response.data })
    }).catch((err) => {
      console.log("Error with fetchAxios: " + err)
    })
  }
  updateUserBtn = (user) => {
    console.log("updateUserBtn")
    this.setState({
      editUser: !this.state.editUser,
      addUser: !this.state.addUser,
      currentUser: user,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      userEmail: user.userEmail,
      userAge: user.userAge
    })
  }

  deleteUser = (user) => {
    axios.delete(`${this.baseUrl}/data/${user._id}`).then((response) => {
      this.fetchWithAxios()
    })
  }

  registerUser = (event, firstName, lastName, userEmail, userAge) => {
    this.setState({ addUser: !this.state.addUser })
    if (this.state.userAge === '') {
      this.setState({ userAgeError: "enter your age" });
    } else {
      if (this.state.userAge < 18) {
        this.setState({ userAgeError: "you are too young to joing us" });
      } else if (this.state.userAge > 90) {
        this.setState({ userAgeError: "you are old to joing us" });
      }
      event.preventDefault()

    }
    const userData = {
      firstName: firstName,
      lastName: this.state.userLastName,
      userAge: this.state.userAge * 1,
      userEmail: this.state.userEmail,
    }
    axios.post(`${this.baseUrl}/data`, userData).then((response) => {
      this.fetchWithAxios()
      this.updateRegistrationState()
    }).catch((error) => {
      console.log(`Error while pushing data to server: ` + error)
    })
  }

  updateUser = (event, user) => {
    event.preventDefault()
    this.setState({ addUser: !this.state.editUser })
    if (this.state.userAge === '') {
      this.setState({ userAgeError: "enter your age" });
    } else {
      if (this.state.userAge < 18) {
        this.setState({ userAgeError: "you are too young to joing us" });
      } else if (this.state.userAge > 90) {
        this.setState({ userAgeError: "you are old to joing us" });
      }
    }
    const userData = {
      firstName: this.state.userFirstName,
      lastName: this.state.userLastName,
      userAge: this.state.userAge * 1,
      userEmail: this.state.userEmail,
      id: this.state.currentUser._id
    }
    axios.put(`${this.baseUrl}/data/${this.state.currentUser._id}`, userData).then((response) => {
      this.fetchWithAxios()
      this.updateRegistrationState()
    }).catch((error) => {
      console.log(`Error while pushing data to server: ` + error)
    })
  }

  updateRegistrationState = () => {
    this.setState({
      firstName: '',
      lastName: '',
      userAge: '',
      userEmail: ''
    })
  }

  updateInput = (event) => {
    if (event.target.name === 'userFirstName') {
      this.setState({ userFirstName: event.target.value })
    }
    if (event.target.name === 'userLastName') {
      this.setState({ userLastName: event.target.value })
    }
    if (event.target.name === 'userEmail') {
      this.setState({ userEmail: event.target.value })
    }
    if (event.target.name === 'userAge') {
      this.setState({ userAge: event.target.value })
    }
  }

  render() {
    const { userFirstName, userLastName, userAge, userEmail } = { ...this.state }
    return <div className="container">
      <h1>User List </h1>
      <RegistrationForm userFirstName={userFirstName} userLastName={userLastName} userAge={userAge} userEmail={userEmail}
        registerUser={(evt, firstName, lastName, userEmail, userAge) => { this.registerUser(evt, firstName, lastName, userEmail, userAge) }}></RegistrationForm>
      <hr></hr>
      {this.state.firstTimeAddUser && <div><button className="btn btn-primary" onClick={() => {
        this.setState({
          firstTimeAddUser: !this.state.firstTimeAddUser,
          addUser: !this.state.addUser
        })
      }}> Add User</button></div>}
      {(this.state.addUser) && <div><button className="btn btn-primary" onClick={() => { this.setState({ addUser: !this.state.addUser }) }}> Add User</button></div>}
      {(this.state.editUser || this.state.addUser) &&
        <div>
          <form >
            <div class="mb-3">
              <label for="userFirstName" class="form-label"></label>
              <input onChange={this.updateInput} type="text" class="form-control" name="userFirstName" id="userFirstName" placeholder="" value={this.state.userFirstName} />
            </div>
            <div class="mb-3">
              <label for="userEmail" class="form-label"></label>
              <input onChange={this.updateInput} type="email" class="form-control" name="userEmail" id="userEmail" placeholder="name@example.com" value={this.state.userEmail} />
            </div>
            <div class="mb-3">
              <label for="userLastName" class="form-label"></label>
              <input onChange={this.updateInput} type="text" class="form-control" name="userLastName" id="userLastName" placeholder="" value={this.state.userLastName} />
            </div>
            <div class="mb-3">
              <label for="userAge" class="form-label"></label>
              <input onChange={this.updateInput} type="text" class="form-control" name="userAge" id="userAge" placeholder="" value={this.state.userAge} />
            </div>
            {(this.state.addUser) && <button className='btn btn-primary' type="submit" onClick={this.registerUser}>Register</button>}
            {(this.state.editUser) && <button className='btn btn-primary' type="submit" onClick={this.updateUser}>Update User</button>}
          </form>
        </div>
      }

      <table className="table">
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
          {this.state.users && this.state.users.map((user, index) => {
            /* return <li>{user.name}</li> })} */
            return <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.firstName} </td>
              <td>{user.lastName}</td>
              <td>{user.userEmail}</td>
              <td>{user.userAge}</td>
              <td><button className="btn btn-danger" onClick={() => this.deleteUser(user)}>Delete</button></td>
              <td><button className="btn btn-warning" onClick={() => this.updateUserBtn(user)} >Update</button></td>
            </tr>
          })
          }
        </tbody>
      </table>
    </div >
  }
}
ReactDOM.render(<MainApp />, document.getElementById("root"));