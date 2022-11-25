import React from 'react';
import { useNavigate, useParams } from "react-router-dom";

const navigator = WrappedComponent => props => {
    const navigate = useNavigate();
    const params = useParams();

    return (
        <WrappedComponent
            {...props}
            navigate={navigate}
            params={params}
        />
    );
};

export default navigator;