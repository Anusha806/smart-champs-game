import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

function ProtectedRoute({

    level,
    children

}) {

    const { currentLevel } =
    useContext(GameContext);

    if(currentLevel < level){

        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;