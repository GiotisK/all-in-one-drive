import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Theme } from './providers/Theme';
import { ErrorPage } from './pages/ErrorPage';
import { DrivesPage } from './pages/DrivesPage';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import { HomePage } from './pages/HomePage';
import { routes } from './shared/constants/routes';
import { ThemedToastContainer } from './components/ThemedToastContainer';
import { PendingFilesProvider } from './providers/PendingFilesProvider';
import { DrivesList } from './components/DrivesList';
import { FilesList } from './components/FilesList';

const router = createBrowserRouter([
	{
		path: routes.home,
		element: <HomePage />,
	},
	{
		path: routes.login,
		element: <LandingPage />,
	},
	{
		path: routes.drives,
		element: <DrivesPage />,
		children: [
			{
				index: true,
				element: <DrivesList />,
			},
			{
				path: ':driveId/:folderId?',
				element: <FilesList />,
			},
		],
	},
	{
		path: '*',
		element: <ErrorPage />,
	},
]);

function App() {
	return (
		<Provider store={store}>
			<PendingFilesProvider>
				<Theme>
					<ThemedToastContainer />
					<RouterProvider router={router} />
				</Theme>
			</PendingFilesProvider>
		</Provider>
	);
}

export default App;
