import * as React from 'react';
import { Input, Label, Button, FormGroup, Container, Form } from 'reactstrap';
import { render } from 'react-dom';
import LoginBox from './LoginBox';
import { Link } from 'react-router-dom';
// import ForgotPass from './ForgotPass';
import axios from 'axios';

export interface SignupState {
  mail: string;
  pass: string;
  confirm: string;
  error: string;
}

export interface SignupProps {
  alert: string;
}

export default class Login extends React.Component<SignupProps, SignupState> {
  constructor(props: SignupProps) {
    super(props);
    this.state = {
      mail: '',
      pass: '',
      confirm: '',
      error: this.props.alert
    };
  }

  handleChange(e) {
    if (e.target.name == 'user[email]')
      this.setState({
        mail: e.target.value
      });
    if (e.target.name == 'user[password]')
      this.setState({
        pass: e.target.value
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    axios.post('/users/sessions.json', {
      user_session: {
        email: this.state.mail,
        password: this.state.pass
      }
    })
    .then(response => {
      window.location.href = response.data.redirect
    })
    .catch(error => {
      this.setState({
        error: error.response.data.errors
      });
      render(<p>{this.state.error}</p>, document.getElementById('login-alert') as HTMLElement)
    })
  }

  render() {
    var mailclasses = ["input-color"];
    var passclass = ["input-color"];
      if (this.state.error == "Email is not valid") {
        mailclasses.push('input-alert');
      }
      if (this.state.error == "Password is not valid") {
        passclass.push('input-alert');
      }
    return(
        <LoginBox title="Sign up" desc="Sign in to your account">
           <Form action="/users/sign_up" method="post">
            <FormGroup>
              <div id='login-alert'>
                { this.state.error != '' ? <p>{this.state.error}</p> : <span></span> }
              </div>
              <Label className="login-label">Email</Label>
              <Input type="email" className={mailclasses.join(' ')} 
                     name="user[email]" onChange={this.handleChange.bind(this)}/>
            </FormGroup>
            <FormGroup>
              <Label className="login-label">Password</Label>
              <Input type="password" className={passclass.join(' ')} 
                     name="user[password]" onChange={this.handleChange.bind(this)}/>
            </FormGroup>
            <FormGroup>
              <Label className="login-label">Password confirmation</Label>
              <Input type="password" className={passclass.join(' ')} 
                     name="user[password]" onChange={this.handleChange.bind(this)}/>
            </FormGroup>
            <div className="forgot-pass-link">
            </div>
            <Button type="submit" className="btn btn-login" block={true}>Sign up</Button>
          </Form>
          <Link to="/users/sign_in">Sign in</Link>
        </LoginBox>
    );
  }
}