const express =
require("express");

const axios =
require("axios");

const PlayerQuestionSet =
require("../models/PlayerQuestionSet");

const router =
express.Router();

const generateQuestions =
async(prompt)=>{

    const response =

    await axios.post(

        "https://openrouter.ai/api/v1/chat/completions",

        {

            model:
            "mistralai/mistral-7b-instruct:free",

            messages:[

                {
                    role:"user",

                    content:prompt
                }
            ]
        },

        {

            headers:{

                Authorization:

                `Bearer ${process.env.OPENROUTER_API_KEY}`,

                "Content-Type":
                "application/json"
            }
        }
    );

    const text =

    response.data
    .choices[0]
    .message.content;

    const cleaned =

    text

    .replace(/```json/g,"")

    .replace(/```/g,"")

    .trim();

    try{

    return JSON.parse(cleaned);
}

catch(err){

    console.log(
        "JSON Parse Error"
    );

    console.log(cleaned);

    throw new Error(
        "Invalid AI JSON"
    );
}
};

router.post(

    "/assign-questions/:teamName",

    async(req,res)=>{

        try{

            const { teamName } =
            req.params;

            const existingPlayer =

            await PlayerQuestionSet
            .findOne({

                teamName
            });

            if(existingPlayer){

                return res.json({

                    message:
                    "Questions already assigned"
                });
            }

            const level1 =

            await generateQuestions(`

Generate EXACTLY 25 MCQ quiz questions.

Subjects:
- maths
- science
- geography
- literature
- history

Return ONLY valid JSON array.

Format:

[
{
"subject":"maths",
"question":"Question",
"options":["A","B","C","D"],
"answer":"Correct"
}
]
`);

            const level2 =

            await generateQuestions(`

Generate EXACTLY 10 tricky general knowledge MCQs.

Return ONLY valid JSON array.

Format:

[
{
"question":"Question",
"options":["A","B","C","D"],
"answer":"Correct"
}
]
`);

            const level4 =

            await generateQuestions(`

Generate EXACTLY 10 crossword clues.

RULES:
- single word answers
- uppercase only
- no spaces

Return ONLY valid JSON array.

Format:

[
{
"clue":"Largest ocean",
"answer":"PACIFIC"
}
]
`);

            const level7 =

            await generateQuestions(`

Generate EXACTLY 15 logical reasoning MCQs.

Return ONLY valid JSON array.

Format:

[
{
"question":"Question",
"options":["A","B","C","D"],
"answer":"Correct"
}
]
`);

            const level8 =

            await generateQuestions(`

Generate EXACTLY 10 advanced GK MCQs.

Return ONLY valid JSON array.

Format:

[
{
"question":"Question",
"options":["A","B","C","D"],
"answer":"Correct"
}
]
`);

            await PlayerQuestionSet
            .create({

                teamName,

                level1,
                level2,
                level4,
                level7,
                level8
            });

            res.json({

                message:
                "Questions assigned successfully"
            });

        }

        catch(err){

            console.log(err);

            res.status(500).json({

                message:
                "Question generation failed"
            });
        }
    }
);

router.get(

    "/player/:teamName/:level",

    async(req,res)=>{

        try{

            const {

                teamName,
                level

            } = req.params;

            const playerSet =

            await PlayerQuestionSet
            .findOne({

                teamName
            });

            if(!playerSet){

                return res.status(404).json({

                    message:
                    "Player questions not found"
                });
            }

            const levelKey =
            `level${level}`;

            res.json(
                playerSet[levelKey]
            );
        }

        catch(err){

            console.log(err);

            res.status(500).json({

                message:
                "Failed to fetch questions"
            });
        }
    }
);

router.delete(

    "/delete-player/:teamName",

    async(req,res)=>{

        try{

            const { teamName } =
            req.params;

            await PlayerQuestionSet
            .deleteOne({

                teamName
            });

            res.json({

                message:
                "Player questions deleted"
            });
        }

        catch(err){

            console.log(err);

            res.status(500).json({

                message:
                "Delete failed"
            });
        }
    }
);

module.exports = router;