import { LandingPage } from './pages/LandingPage';
import { Theme } from './providers/Theme';
import { ErrorPage } from './pages/ErrorPage';
import { DrivePage } from './pages/DrivePage';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { routes } from './shared/constants/routes';
import { ToastContainer } from 'react-toastify';
import { ThemedToastContainer } from './components/ThemedToastContainer';

function App() {
	return (
		<>
			<BrowserRouter>
				<Provider store={store}>
					<Theme>
						<ThemedToastContainer />
						<Routes>
							<Route path={routes.home} element={<HomePage />} />
							<Route path={routes.login} element={<LandingPage />} />
							<Route path={routes.drive} element={<DrivePage />}>
								<Route path={':driveId/:folderId'} element={<DrivePage />} />
							</Route>
							<Route path='*' element={<ErrorPage />} />
						</Routes>
					</Theme>
				</Provider>
			</BrowserRouter>
		</>
	);
}

export default App;
