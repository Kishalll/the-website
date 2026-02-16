export const recruitmentConfig = {
    isRecruiting: true, // Toggle this to true to enable recruitment
    departments: [
        { id: 'development', name: 'Development' },
        { id: 'ui_ux', name: 'UI/UX' },
        { id: 'cybersec_testing', name: 'Cybersec and Testing' },
        { id: 'design_content', name: 'Design and Content' },
        { id: 'social_marketing', name: 'Social Media and Marketing' },
        { id: 'management', name: 'Management' } // Added as potential 6th based on context
    ],
    generalQuestions: [
        {
            id: 'why_zbc',
            label: 'Why do you want to join ZBC?',
            type: 'textarea',
            required: true,
            placeholder: 'Tell us about your motivation...'
        }
    ],
    domainQuestions: {
        development: [
            {
                id: 'tech_stack',
                label: 'What is your preferred tech stack?',
                type: 'text',
                required: true,
                placeholder: 'e.g., React, Node.js, Python...'
            },
            {
                id: 'github_link',
                label: 'GitHub Profile Link',
                type: 'url',
                required: true,
                placeholder: 'https://github.com/username'
            }
        ],
        ui_ux: [
            {
                id: 'tools',
                label: 'Which design tools do you use?',
                type: 'text',
                required: true,
                placeholder: 'Figma, Adobe XD, etc.'
            },
            {
                id: 'portfolio',
                label: 'Portfolio Link',
                type: 'url',
                required: false,
                placeholder: 'Behance, Dribbble, or personal site'
            }
        ],
        cybersec_testing: [
            {
                id: 'experience',
                label: 'Do you have any experience with CTFs or Bug Bounties?',
                type: 'textarea',
                required: true,
                placeholder: 'Share your achievements or participation...'
            }
        ],
        design_content: [
            {
                id: 'content_type',
                label: 'What type of content do you enjoy creating?',
                type: 'text',
                required: true,
                placeholder: 'Blogs, Video scripts, Social media posts...'
            },
            {
                id: 'portfolio',
                label: 'Portfolio/Work Samples',
                type: 'url',
                required: true,
                placeholder: 'Link to your work'
            }
        ],
        social_marketing: [
            {
                id: 'campaign_idea',
                label: 'Pitch a quick marketing idea for a tech club event.',
                type: 'textarea',
                required: true,
                placeholder: 'Keep it short and creative...'
            }
        ],
        management: [ // Hypothetical 6th
            {
                id: 'event_exp',
                label: 'Have you organized any events before?',
                type: 'textarea',
                required: true,
                placeholder: 'Describe your role and the event...'
            }
        ]
    }
};
