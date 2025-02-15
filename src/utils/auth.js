import axiosInstance from "../api/axiosInstance";

export const checkLoginStatus = async (setUser) => {
    try {
        const response = await axiosInstance.get('/me');
        setUser({
            isLoggedIn: true,
            isLoading: false,
            user: response.data
        });
        return true;
    } catch (error) {
        if (error.response?.status === 401) {
            setUser({
                isLoggedIn: false,
                isLoading: false,
                user: null
            });
        } else {
            console.error("로그인 상태 확인 실패:", error);
            setUser({
                isLoggedIn: false,
                isLoading: false,
                user: null
            });
        }
        return false;
    }
};

export const logout = async (setUser) => {
    try {
        await axiosInstance.post('/signout');
        setUser({
            isLoggedIn: false,
            isLoading: false,
            user: null
        });
        return true;
    } catch (error) {
        console.error("로그아웃 실패:", error);
        return false;
    }
};

export const initializeAuthState = (setUser) => {
    setUser({
        isLoggedIn: false,
        isLoading: true,
        user: null
    });
};
