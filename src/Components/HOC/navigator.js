import React from 'react';
import { useNavigate } from "react-router-dom";

const navigator = WrappedComponent => props => {
    const navigate = useNavigate();

    return (
        <WrappedComponent
            {...props}
            navigate={navigate}
        />
    );
};

export default navigator;