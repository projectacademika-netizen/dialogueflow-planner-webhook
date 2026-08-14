const express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const app = express();

app.use(express.json());

app.post('/webhook', (request, response) => {
    const agent = new WebhookClient({ request, response });

    function generatePlanHandler(agent) {
        const topic = agent.parameters.topic;
        const durationParam = agent.parameters.duration;

        let amount = durationParam.amount; 
        let unit = durationParam.unit; 

        let totalDays = amount;
        if (unit === 'wk') totalDays = amount * 7;

        const templates = {
            math: [
                "Review formulas, theorems, and core notes",
                "Deconstruct step-by-step example problems",
                "Solve foundational practice question sets",
                "Complete a timed, mixed-topic mock quiz",
                "Analyze errors and drill flashcard formulas"
            ],
            english: [
                "Review vocabulary, literary devices, and essay rubrics",
                "Analyze sample texts or reading comprehension prompts",
                "Practice outlining thesis statements and arguments",
                "Write a timed essay or complete full passage sets",
                "Proofread common grammatical errors and refine transitions"
            ],
            default: [
                "Research & outline your milestone checklist",
                "Gather materials and establish your setup",
                "Execute core heavy tasks & foundational work",
                "Refine, troubleshoot, and polish details",
                "Final review, presentation prep, or testing"
            ]
        };

        let lowerTopic = topic.toLowerCase();
        let selectedTemplate = templates.default;

        if (lowerTopic.includes('math') || lowerTopic.includes('algebra') || lowerTopic.includes('calc')) {
            selectedTemplate = templates.math;
        } else if (lowerTopic.includes('english') || lowerTopic.includes('writing') || lowerTopic.includes('lit')) {
            selectedTemplate = templates.english;
        }

        let responseText = `🗓️ Here is your customized ${amount} ${unit}(s) plan for *${topic}*:\n\n`;
        
        for (let day = 1; day <= totalDays; day++) {
            let progressFraction = (day - 1) / totalDays;
            let stepIndex = Math.floor(progressFraction * selectedTemplate.length);
            let dailyTask = selectedTemplate[stepIndex];
            
            responseText += `• *Day ${day}:* ${dailyTask}\n`;
        }
        
        responseText += `\nGood luck! You've got this! 💪`;
        agent.add(responseText);
    }

    let intentMap = new Map();
    intentMap.set('Generate.Plan', generatePlanHandler);
    agent.handleRequest(intentMap);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

                                                                                                                                                                                        
