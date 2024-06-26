import { useState } from 'react';
import '../styles/login.css'
import axios from 'axios';
import CONSTANTS from '../constants/constants'
import {Button, Card, Input, Form } from 'antd';
import {useNavigate} from 'react-router-dom'


export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState("");

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = async () => {
    try {
      const requestData = JSON.stringify({
        mailId: email,
        password: password,
      });
      const response = await axios.post(
        `${CONSTANTS.API_URL}/user/login`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === CONSTANTS.RESPONSE_STATUS.SUCCESS) {
        setLoginStatus(CONSTANTS.STATUS_CONSTANTS.COMPLETED);
        navigate("/dashboard")
      } else {
        throw new Error(CONSTANTS.RESPONSE_STATUS.FAILED);
      }
    } catch (error) {
        setLoginStatus(CONSTANTS.STATUS_CONSTANTS.FAILED);
      }
}  

  return (
      <div className="loginContainer">
        <div className='login-wrapper'>
        <div className='section-1'>
            <div className='login-card'>
            <Card style={{ width: 350, height: 500, boxShadow: 20, backgroundColor:'#e6e6e6'}}>
                <Form>
                  <h2>Welcome back</h2>
                  <p>Enter to explore All the features</p>
                  <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                  >
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      style={{ width: 250 }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                  >
                    <Input.Password
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      style={{ width: 250 }}
                    />
                  </Form.Item>
                  <Button onClick={handleLogin} type="primary">
                    Login
                  </Button>
                  <p>---------------------- or -----------------------</p>
                  <div className='login-card-new-account-section'>
                  <p>Don't Have an account?</p>
                  <Button onClick={handleRegister} type="primary" style={{width:200, alignSelf:"center"}}>
                    Create new account
                  </Button>
                  </div>
              </Form>
              {loginStatus === CONSTANTS.STATUS_CONSTANTS.COMPLETED && (
                <p style={{color:"green"}}>Login Successful!</p>
              )}
              {loginStatus === CONSTANTS.STATUS_CONSTANTS.FAILED && (
                <p style={{color:"red"}}>
                  Login Failed. Please try again.
                </p>
              )}
            </Card>
        </div>
        </div>
        <div className='section-2'>
            
        </div>
        </div>
      </div>
  )
}