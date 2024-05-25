import { useState } from 'react';
import '../styles/register.css'
import axios from 'axios';
import CONSTANTS from '../constants/constants'
import {Button, Card, Input, Form } from 'antd';
import {useNavigate} from 'react-router-dom'


export const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registerStatus, setRegisterStatus] = useState("");

  const handleRegister = async () => {
    try {
      const requestData = JSON.stringify({
        userName:username,
        mailId: email,
        password: password,
      });
      const response = await axios.post(
        `${CONSTANTS.API_URL}/user/signup`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === CONSTANTS.RESPONSE_STATUS.SUCCESS) {
        setRegisterStatus(CONSTANTS.STATUS_CONSTANTS.COMPLETED);
        navigate("/")
      } else {
        throw new Error(CONSTANTS.RESPONSE_STATUS.FAILED);
      }
    } catch (error) {
        setRegisterStatus(CONSTANTS.STATUS_CONSTANTS.FAILED);
      }
}  

  return (
      <div className="reg-Container">
        <div className='reg-wrapper'>
        <div className='reg-section-1'>
            <div className='reg-card'>
            <Card style={{ width: 350, height: 500, boxShadow: 20, backgroundColor:'#e6e6e6'}}>
                <Form>
                <div className='reg-card-header'>
                  <h2>Welcome</h2>
                  <p>Register An account to explore All the features</p>
                  </div>
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                  >
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      style={{ width: 250 }}
                    />
                  </Form.Item>
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
                  <Button onClick={handleRegister} type="primary">
                    Register
                  </Button>
              </Form>
              {registerStatus === CONSTANTS.STATUS_CONSTANTS.COMPLETED && (
                <p style={{color:"green"}}>Registration Successful!</p>
              )}
              {registerStatus === CONSTANTS.STATUS_CONSTANTS.FAILED && (
                <p style={{color:"red"}}>
                  Registration Failed. Please try again.
                </p>
              )}
            </Card>
        </div>
        </div>
        <div className='reg-section-2'>
            
        </div>
        </div>
      </div>
  )
}