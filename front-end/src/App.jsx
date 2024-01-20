import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Route, Routes } from "react-router-dom"
import Home from './views/Home'
import Profile from './views/Profile'
import { AuthLogin } from './context/AuthLoging'
import { connect } from "react-redux"
import Lives from "./views/Lives"
import Live from "./views/Live"
import APIs from "./context/APIsContext"
import Header from "./components/header"

function App() {

	return (
		<Routes>
			<Route element={<AuthLogin />}>
				<Route element={<APIs />}>
					<Route path='/' element={<Home />} />
				</Route>
			</Route>
		</Routes>

	)
}

export default App
