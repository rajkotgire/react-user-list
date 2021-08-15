import { Component } from "react"

class RegistrationForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userFirstName: this.props.userFirstName,
            userLastName: this.props.userLastName,
            userAge: this.props.userAge,
            userEmail: this.props.userEmail
        }
    }
    static getDerivedStateFromProps(props, arg2) {
        console.log('Child Comp getDerivedStateFromProps')
        return {
            userFirstName: props.userFirstName,
            userLastName: props.userLastName,
            userAge: props.userAge,
            userEmail: props.userEmail
        }
    }

    clearInputs = () => {
        this.setState({
            userEmail: "",
            userAge: "",
            userFirstName: "",
            userLastName: ""
        })
    }
    updateInput = (event) => {
        this.props.updateInput(event)
    }
    registerUser = (event) => {
        this.props.registerUser(event, { ...this.state })
    }
    updateUser = (event) => {
        this.props.updateUserFun(event)
    }
    cancel = ()=>{
        if(this.props.addUser){
            this.props.cancelAddUser()
        }else{
            this.props.cancelUpdateUser()
        }

    }
    render() {
        return <form >
            <div className="mb-3">
                <label htmlFor="userFirstName" className="form-label"></label>
                <input onChange={this.updateInput} type="text" className="form-control" name="userFirstName" id="userFirstName" placeholder="First Name" value={this.state.userFirstName} />
            </div>
            <div className="mb-3">
                <label htmlFor="userLastName" className="form-label"></label>
                <input onChange={this.updateInput} type="text" className="form-control" name="userLastName" id="userLastName" placeholder="Last Name" value={this.state.userLastName} />
            </div>
            <div className="mb-3">
                <label htmlFor="userEmail" className="form-label"></label>
                <input onChange={this.updateInput} type="email" className="form-control" name="userEmail" id="userEmail" placeholder="name@example.com" value={this.state.userEmail} />
            </div>
            <div className="mb-3">
                <label htmlFor="userAge" className="form-label"></label>
                <input onChange={this.updateInput} type="text" className="form-control" name="userAge" id="userAge" placeholder="Age" value={this.state.userAge} />
                <span>{this.props.userAgeError}</span>
            </div>
            {this.props.addUser && <button
                className='btn btn-primary'
                type="submit"
                onClick={this.registerUser}
            >
                Register
            </button>}
            {this.props.updateUser && <button
                className='btn btn-primary'
                type="submit"
                onClick={this.updateUser}
            >
                Update User
            </button>
            }
            <button
                className='btn btn-danger'
                onClick={this.cancel}
            >
                Cancel
            </button>
        </form>
    }
}

export default RegistrationForm