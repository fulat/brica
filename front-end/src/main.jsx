import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

// Styles
import 'antd/dist/antd.css'
import './css/header.scss'
import './css/home.scss'
import './css/signup.scss'
import './css/App.scss'
import './css/live.scss'
import './css/index.scss'
import './index.css'

// Redux
import { Provider } from 'react-redux'
import store from './redux/store'
import AuthContextLogin from './context/AuthLoging.jsx'

// Global axios
axios.defaults.baseURL = "http://localhost:8000/"


ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
)
