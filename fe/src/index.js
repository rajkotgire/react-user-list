import { Component } from 'react';
import ReactDOM from 'react-dom';
import fetch from 'fetch'
import axios from 'axios'
import RegistrationForm from './components/registration-form';
import UserList from './components/userList'
class MainApp extends Component {
  state = {
    users: undefined,
    addUser: false,
    updateUser: false,
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
  loadSelectedUser = (user) => {
    console.log("updateUserBtn")
    this.setState({
      updateUser: true,
      addUser: false,
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

  registerUser = (event, { userFirstName, userLastName, userEmail, userAge }) => {
    event.preventDefault()
    if (!this.isValidInput()) {
      return;
    }
    this.setState({ addUser: false })
    const userData = {
      firstName: userFirstName,
      lastName: userLastName,
      userAge: userAge * 1,
      userEmail: userEmail
    }
    axios.post( `${this.baseUrl}/data`, userData).then((response) => {
      this.fetchWithAxios()
      this.clearRegistrationState()
    }).catch((error) => {
      console.log(`Error while pushing data to server: ` + error)
    })
  }

  updateUser = (event) => {
    event.preventDefault()
    if (!this.isValidInput()) {
      return;
    }
    this.setState({ updateUser: false })
    const userData = this.getUserData()
    axios.put(`${this.baseUrl}/data/${this.state.currentUser._id}`, userData)
      .then(() => {
        this.fetchWithAxios()
        this.clearRegistrationState()
      }).catch((error) => {
        console.log(`Error while pushing data to server: ` + error)
      })
  }
  getUserData = () => {
    const userData = {
      firstName: this.state.userFirstName,
      lastName: this.state.userLastName,
      userAge: this.state.userAge * 1,
      userEmail: this.state.userEmail,
      id: this.state.currentUser._id
    }
    return userData
  }
  isValidInput = () => {
    let isValid = true
    if (this.state.userAge === '') {
      this.setState({ userAgeError: "enter your age" });
      isValid = false
    } else {
      if (this.state.userAge < 18) {
        this.setState({ userAgeError: "you are too young to joing us" });
        isValid = false
      } else if (this.state.userAge > 90) {
        this.setState({ userAgeError: "you are old to joing us" });
        isValid = false
      }
    }
    return isValid
  }
  clearRegistrationState = () => {
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
  cancelAddUser = () => {
    this.setState({ addUser: false })
  }
  cancelUpdateUser = () => {
    this.setState({ updateUser: false })
  }

  render() {
    const { userFirstName, userLastName, userAge, userEmail } = { ...this.state }
    return <div className="container">
      <h1>Users</h1>
      {(this.state.addUser || this.state.updateUser) &&
        <RegistrationForm
          userFirstName={userFirstName}
          userLastName={userLastName}
          userAge={userAge} userEmail={userEmail}
          registerUser={(evt, { userFirstName, userLastName, userAge, userEmail }) => { this.registerUser(evt, { userFirstName, userLastName, userAge, userEmail }) }}
          updateUser={() => { this.updateUser() }}
          updateInput={this.updateInput}
          addUser={this.state.addUser}
          updateUser={this.state.updateUser}
          updateUserFun={this.updateUser} 
          userAgeError={this.state.userAgeError}>
        </RegistrationForm>

      }
      <hr></hr>
      {!this.state.addUser && <button className='btn btn-warning' onClick={() => { this.setState({ addUser: true }) }}>Add New User</button>}
      <hr></hr>
      <UserList
        users={this.state.users}
        deleteUser={(user) => { this.deleteUser(user) }}
        updateUser={(user) => { this.loadSelectedUser(user) }}>
      </UserList>
    </div >
  }
}
ReactDOM.render(<MainApp />, document.getElementById("root"));