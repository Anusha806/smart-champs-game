const express =
require("express");

const axios =
require("axios");

const router =
express.Router();

const Question =
require("../models/Question");

const PlayerQuestionSet =
require("../models/PlayerQuestionSet");

const shuffle =
(arr)=>{

    return [...arr]

    .sort(()=>

        Math.random() - 0.5
    );
};

const generateAIQuestions =
async(prompt)=>{

    const response =

    await axios.post(

        "https://openrouter.ai/api/v1/chat/completions",

        {

            model:
            "openai/gpt-3.5-turbo",

            messages:[

                {
                    role:"user",

                    content:prompt
                }
            ],

            temperature:0.9
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

    return JSON.parse(cleaned);
};

router.get(

    "/generate-pool",

    async(req,res)=>{

        try{

            const level1 =

            await generateAIQuestions(`

Generate EXACTLY 50 unique quiz MCQs.

Subjects:
- maths
- science
- geography
- literature
- history

Rules:
- no duplicate questions
- no repeated concepts
- concise gameplay-friendly questions
- answer must exactly match one option

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

            await generateAIQuestions(`

Generate EXACTLY 20 unique general knowledge MCQs.

Rules:
- medium difficulty
- no duplicate questions
- answer must exactly match one option

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

            await generateAIQuestions(`

Generate EXACTLY 20 unique crossword clues.

Rules:
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

            await generateAIQuestions(`

Generate EXACTLY 30 unique logical reasoning MCQs.

Rules:
- no duplicate logic patterns
- answer must exactly match one option

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

            await generateAIQuestions(`

Generate EXACTLY 20 advanced GK MCQs.

Rules:
- difficult questions
- no duplicates
- answer must exactly match one option

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

            const formattedLevel1 =

            level1.map((q)=>({

                level:1,
                subject:q.subject,
                question:q.question,
                options:q.options,
                answer:q.answer
            }));

            const formattedLevel2 =

            level2.map((q)=>({

                level:2,
                question:q.question,
                options:q.options,
                answer:q.answer
            }));

            const formattedLevel4 =

            level4.map((q)=>({

                level:4,
                clue:q.clue,
                answer:q.answer
            }));

            const formattedLevel7 =

            level7.map((q)=>({

                level:7,
                question:q.question,
                options:q.options,
                answer:q.answer
            }));

            const formattedLevel8 =

            level8.map((q)=>({

                level:8,
                question:q.question,
                options:q.options,
                answer:q.answer
            }));

            await Question.insertMany([

                ...formattedLevel1,
                ...formattedLevel2,
                ...formattedLevel4,
                ...formattedLevel7,
                ...formattedLevel8
            ]);

            res.json({

                message:
                "Question pool generated successfully"
            });

        }

        catch(err){

            console.log(err);

            res.status(500).json({

                message:
                "Pool generation failed"
            });
        }
    }
);

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

            const level1Pool =

            await Question.find({
                level:1
            });

            const level2Pool =

            await Question.find({
                level:2
            });

            const level4Pool =

            await Question.find({
                level:4
            });

            const level7Pool =

            await Question.find({
                level:7
            });

            const level8Pool =

            await Question.find({
                level:8
            });

            const level1 =
            shuffle(level1Pool)
            .slice(0,25);

            const level2 =
            shuffle(level2Pool)
            .slice(0,10);

            const level4 =
            shuffle(level4Pool)
            .slice(0,10);

            const level7 =
            shuffle(level7Pool)
            .slice(0,15);

            const level8 =
            shuffle(level8Pool)
            .slice(0,10);

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
                "Question assignment failed"
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