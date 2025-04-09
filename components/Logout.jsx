import { logoutAction } from '@/app/actions';

const Logout = () => {
    return (
        <form action={logoutAction}>
            <button type="submit">Logout</button>
        </form>
    );
};

export default Logout;