'use client';
import UserIndex from '../../components/User/UserIndex.js';
import '../../css/user.css';

export default function UserPage({params}) {
    return (
        <main>
            <UserIndex username={(params.username).replace('%40', '')} />
        </main>
    );
}