import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store/types';
import { routes } from '../shared/constants/routes';

export const HomePage = () => {
	const navigate = useNavigate();
	const isUserAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

	useEffect(() => {
		isUserAuthenticated ? navigate(routes.drive) : navigate(routes.login);
	}, [isUserAuthenticated, navigate]);

	return null;
};
