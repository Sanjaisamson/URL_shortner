import { useState } from 'react';
import '../styles/dashboard.css'
import logo from '../assets/logo_.avif';
import create_link_img from '../assets/dashboard_links.png'
import Links_img from '../assets/dashboard_qrcs.png'
import premium_img from '../assets/dashboard_lib.png'
import {UserCircle2Icon} from "lucide-react"
import axios from 'axios';
import {Button, Flex, Card, Space } from 'antd';
import {useNavigate} from 'react-router-dom'


export const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
    <div className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="navbar-content">
        <h4>User</h4>
        <UserCircle2Icon className='userIcon'/>
      </div>
    </div>
    <div className='contents'>
      <div className='text'>
        <h1>Hi User</h1>
        <h3>Welcome to Url_shortner</h3>
      </div>
      <div className='content-cards'>
      <Card style={{ width: 350, height: 150, boxShadow: 20, backgroundColor:'#e6e6e6'}}>
      <img src={create_link_img} style={{ width: 150, height: 100, margin:0, padding:0}}></img>
      <div className='card-elements'>
        <h3>Make it short</h3>
        <Button onClick={()=>{
              navigate('/url')
            }} type='link'>Create new link</Button>
        </div>
    </Card>
    <Card style={{ width: 350, height: 150, boxShadow: 20, backgroundColor:'#e6e6e6'}}>
      <img src={Links_img} style={{ width: 150, height: 100, margin:0, padding:0}}></img>
      <div className='card-elements'>
        <h3>Go to your collections</h3>
        <Button onClick={()=>{
              navigate('/links')
            }} type='link'>Go to Links</Button>
        </div>
    </Card>
      </div>
    </div>
  </div>
  )
}

