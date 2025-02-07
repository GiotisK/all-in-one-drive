import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../shared/constants/routes';
import { useAppSelector } from '../redux/store/store';

export const HomePage = () => {
	const navigate = useNavigate();
	const isUserAuthenticated = useAppSelector(state => state.user.isAuthenticated);

	useEffect(() => {
		isUserAuthenticated ? navigate(routes.drive) : navigate(routes.login);
	}, [isUserAuthenticated, navigate]);

	return null;
};
