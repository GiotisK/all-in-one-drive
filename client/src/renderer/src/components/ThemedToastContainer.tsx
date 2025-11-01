import { ToastContainer } from 'react-toastify';
import { useAppSelector } from '../redux/store/store';

export const ThemedToastContainer = () => {
    const themeMode = useAppSelector(state => state.settings.themeMode);

    return (
        <ToastContainer
            position='bottom-left'
            autoClose={2500}
            hideProgressBar
            newestOnTop
            closeOnClick
            theme={themeMode}
        />
    );
};
