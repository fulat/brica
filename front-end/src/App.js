import { Route, Routes } from "react-router-dom"
import Home from './views/Home'
import Profile from './views/Profile'
import { AuthLogin } from './context/AuthLoging'
import { connect } from "react-redux"
import Lives from "./views/Lives"
import Live from "./views/Live"
import APIs from "./context/APIsContext"
import Header from "./components/header"

const App = () => {

	return (
		<Routes>
			<Route element={<AuthLogin />}>
				<Route element={<APIs />}>
					<Route path='/' element={<Home />} />
					<Route path='/lives/:date/:roomId' element={<Lives />} />
					<Route path='/live/:roomId' element={<Live />} />
					<Route path='/c/:coins' element={<Profile />} />
					<Route path='/u/:users' element={<h1>Users</h1>} />
					<Route path='/debate/:roomId' element={<h1>Debate</h1>} />
				</Route>
			</Route>
		</Routes>
	)
}


const mapStateToProps = (state, ownProps) => ({
	state, ownProps
})

export default connect(mapStateToProps)(App)
