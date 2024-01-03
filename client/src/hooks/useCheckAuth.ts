import { useEffect } from 'react';
import { authUser } from '../services/user.service';
import { setEmail, setIsAuthenticated } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { routes } from '../shared/constants/routes';

export const useCheckAuthAndRedirect = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		(async () => {
			const res = await authUser();
			const toRoute = res.success ? routes.drive : routes.login;

			dispatch(setEmail(res.email));
			dispatch(setIsAuthenticated(res.success));
			navigate(toRoute);
		})();
	}, [navigate, dispatch]);
};
