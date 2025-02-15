// src/components/AuthWrapper.jsx
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '../recoil/atoms';
import { checkLoginStatus } from '../utils/auth';
import LoadingSpinner from './LoadingSpinner';


// eslint-disable-next-line react/prop-types
const AuthWrapper = ({ children }) => {
    const [user, setUser] = useRecoilState(userState);

    useEffect(() => {
        checkLoginStatus(setUser);
    }, [setUser]);

    if (user.isLoading) {
        return <LoadingSpinner fullScreen text="인증 상태를 확인하는 중입니다..." />;
    }

    return children;
};

export default AuthWrapper;