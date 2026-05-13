const Player =
require("../models/Player");

const savePlayer =
async(req,res)=>{

    try{

        const {

            teamName,
            score,
            level,
            warnings,
            levelsCompleted,
            totalTime

        } = req.body;

        let player =

        await Player.findOne({

            teamName
        });

        if(player){

            player.score = score;

            player.level = level;

            player.warnings = warnings;

            player.levelsCompleted =
            levelsCompleted;

            player.totalTime =
            totalTime;

            await player.save();

            return res.json(player);
        }

        player = await Player.create({

            teamName,

            score,

            level,

            warnings,

            levelsCompleted,

            totalTime
        });

        res.json(player);

    }

    catch(err){

        res.status(500).json({

            error:err.message
        });
    }
};

const getLeaderboard =
async(req,res)=>{

    try{

        const leaderboard =

        await Player.find()

        .sort({

            score:-1,

            levelsCompleted:-1,

            totalTime:1
        })

        .limit(10);

        res.json(leaderboard);

    }

    catch(err){

        res.status(500).json({

            error:err.message
        });
    }
};

const getPlayer =
async(req,res)=>{

    try{

        const { teamName } =
        req.params;

        const player =

        await Player.findOne({

            teamName
        });

        res.json(player);

    }

    catch(err){

        res.status(500).json({

            error:err.message
        });
    }
};

module.exports = {

    savePlayer,

    getLeaderboard,

    getPlayer
};