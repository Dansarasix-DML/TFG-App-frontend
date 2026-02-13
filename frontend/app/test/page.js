'use client';
import Error from '../components/Common/Error.js';
import '../css/error.css';

export default function test() {
    return (
      <>
        <Error error="500" content="Opps, error on the server!"/>
      </>
    );
}