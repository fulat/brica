import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import axios from "axios"
import { APIsProvider } from './context/APIsContext'

// Styles
import 'antd/dist/antd.css'
import './css/header.scss'
import './css/home.scss'
import './css/signup.scss'
import './css/App.scss'
import './css/live.scss'
import './css/index.scss'

// Redux
import { Provider } from 'react-redux'
import store from './redux/store'


const MoralisCredentials = {
	appId: "cKZEry0cI7B56eRU0wwbdHjXbzfLr1gTsffWjHw8",
	serverUrl: "https://rff9oajlxdp2.usemoralis.com:2053/server"
}

// Global axios
axios.defaults.baseURL = "http://localhost:8000/"

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
