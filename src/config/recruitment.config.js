export const recruitmentConfig = {
    isRecruiting: true,
    departments: [
        { id: 'technical', name: 'Technical' },
        { id: 'design', name: 'Design' },
        { id: 'events', name: 'Events' },
        { id: 'hr', name: 'HR' },
        { id: 'outreach', name: 'Outreach' }
    ],
    generalQuestions: [
        {
            id: 'why_zbc',
            label: 'Why do you want to join this club?',
            type: 'textarea',
            required: true,
            wordLimit: 300,
            placeholder: 'Tell us about your motivation (max 300 words)...'
        }
    ],
    domainQuestions: {
        technical: [
            {
                id: 'tech_stack',
                label: 'What is your preferred tech stack and programming languages?',
                type: 'text',
                required: true,
                placeholder: 'e.g., C++, Python, Rust, React, Node.js...'
            },
            {
                id: 'problem_solving',
                label: 'Share your LeetCode/CodeChef profile or competitive programming experience.',
                type: 'text',
                required: false,
                placeholder: 'Profile handles, ratings, or contest achievements...'
            }
        ],
        design: [
            {
                id: 'design_tools',
                label: 'Which design tools do you use?',
                type: 'text',
                required: true,
                placeholder: 'Figma, Adobe XD, Photoshop, Illustrator, Spline...'
            },
            {
                id: 'portfolio_link',
                label: 'Portfolio or Work Showcase Link',
                type: 'url',
                required: true,
                placeholder: 'Behance, Dribbble, Figma Community, or personal website'
            }
        ],
        events: [
            {
                id: 'event_experience',
                label: 'Describe your past experience organizing or managing tech events/hackathons.',
                type: 'textarea',
                required: true,
                placeholder: 'Tell us about the events, team size, and responsibilities...'
            }
        ],
        hr: [
            {
                id: 'hr_scenario',
                label: 'How do you handle conflict or low active engagement within a team?',
                type: 'textarea',
                required: true,
                placeholder: 'Share your approach to team bonding, recruitment, and conflict resolution...'
            }
        ],
        outreach: [
            {
                id: 'outreach_pitch',
                label: 'How would you pitch Zero Bugs Club to potential industry sponsors or partners?',
                type: 'textarea',
                required: true,
                placeholder: 'Share your ideas for sponsorship proposals and external outreach...'
            }
        ]
    }
};
