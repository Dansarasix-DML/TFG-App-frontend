// components/GoogleAuth.js
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { setUserCookies } from '@/services/Cookies';

const GoogleAuth = () => {
    const handleLoginSuccess = async (response) => {
        const token = response.credential;

        try {
            const res = await axios.post(process.env.DB_HOST + '/api/auth/google/callback', { token });
            const { token: jwtToken, email, profile_img, username } = res.data;
            setUserCookies(email, jwtToken);

            // Llamar a la API route para guardar la imagen del perfil
            await axios.post('/api/saveProfileImageGoogle', { username, profile_img_url: profile_img });
            window.location.href = "/";
        } catch (error) {
            console.error('Error authenticating with backend', error);
        }
    };

    const handleLoginFailure = (error) => {
        console.error('Login failed', error);
    };

    return (
        <GoogleOAuthProvider clientId="70898371085-gcbke18tj24ucgak300dvvksh8isns62.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginFailure}
                ux_mode="popup"
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleAuth;
