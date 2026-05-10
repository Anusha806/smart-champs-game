const express = require("express");

const router = express.Router();

const {

    savePlayer,
    getLeaderboard,
    getPlayer

} = require(
    "../controllers/playerController"
);

router.post(
    "/save",
    savePlayer
);

router.get(
    "/leaderboard",
    getLeaderboard
);

router.get(

    "/:teamName",

    getPlayer
);

module.exports = router;