import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Theme } from './providers/Theme';
import { ThemeMode } from './shared/types/types';
import { ErrorPage } from './pages/ErrorPage';
import { TitleBanner } from './components/TitleBanner';
import { DrivePage } from './pages/DrivePage';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

function App() {
	return (
		<Provider store={store}>
			<Theme>
				<BrowserRouter>
					<Routes>
						<Route path='/login' element={<LandingPage />} />
						<Route path='/drive' element={<DrivePage />} />
					</Routes>
				</BrowserRouter>
			</Theme>
		</Provider>
	);
}

export default App;
