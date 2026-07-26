export const boardMembers = [
    {
        slug: 'manvi-chadha',
        name: 'Manvi Chadha',
        role: 'Chairperson',
        image: '',
        noteFrom: 'Faculty Coordinator',
        note: 'Outstanding strategic vision and executive leadership, driving innovation and guiding Zero Bugs Club across all technical and community initiatives.',
        contributions: [
            'Spearheaded overall club vision and executive roadmap for the academic year.',
            'Organized national-level tech events, hackathons, and community workshops.',
            'Mentored leadership teams and facilitated inter-departmental collaboration.'
        ],
        socials: [
            { platform: 'linkedin', url: '#' },
            { platform: 'github', url: '#' },
            { platform: 'instagram', url: '#' }
        ]
    },
    {
        slug: 'kishal-p',
        name: 'Kishal P',
        role: 'Vice Chairperson',
        image: '',
        noteFrom: 'Faculty Coordinator',
        note: 'Exceptional operational execution and technical leadership, ensuring seamless execution across all projects.',
        contributions: [
            'Managed internal club operations and project delivery milestones.',
            'Coordinated between executive board members and department leads.',
            'Facilitated industry partnerships and technical collaborations.'
        ],
        socials: [
            { platform: 'linkedin', url: '#' },
            { platform: 'github', url: '#' },
            { platform: 'instagram', url: '#' }
        ]
    },
    {
        slug: 'm-mano-karthik',
        name: 'M Mano Karthik',
        role: 'Secretary',
        image: '',
        noteFrom: 'Faculty Coordinator',
        note: 'Meticulous administration, documentation, and official communication across university channels.',
        contributions: [
            'Handled official documentation, permissions, and administrative workflows.',
            'Maintained clear communication channels across all team departments.',
            'Oversaw recruitment drives and member onboarding logistics.'
        ],
        socials: [
            { platform: 'linkedin', url: '#' },
            { platform: 'github', url: '#' },
            { platform: 'instagram', url: '#' }
        ]
    },
    {
        slug: 'divyashri-rajaraman',
        name: 'Divyashri Rajaraman',
        role: 'Co-secretary',
        image: '',
        noteFrom: 'Faculty Coordinator',
        note: 'Dedicated governance and organizational efficiency, ensuring smooth scheduling and official correspondence.',
        contributions: [
            'Co-managed administrative records, official schedules, and event clearances.',
            'Supported cross-team logistics and event operations.',
            'Assisted in managing club outreach and official communications.'
        ],
        socials: [
            { platform: 'linkedin', url: '#' },
            { platform: 'github', url: '#' },
            { platform: 'instagram', url: '#' }
        ]
    }
];

export const facultyCoordinator = {
    slug: 'dr-punitha-k',
    name: 'Dr.Punitha K',
    role: 'Faculty Coordinator',
    image: '',
    noteFrom: 'Zero Bugs Club Board',
    note: 'Faculty Advisor guiding Zero Bugs Club towards technical mastery, academic rigor, and impactful student projects.',
    contributions: [
        'Academic oversight and institutional guidance for student initiatives.',
        'Facilitated university approvals and lab resource allocations.',
        'Mentored club leadership in project governance and event compliance.'
    ],
    socials: [
        { platform: 'linkedin', url: '#' },
        { platform: 'mail', url: 'mailto:zbcvitc@gmail.com' }
    ]
};

export const departments = [
    {
        slug: 'projects',
        name: 'Projects',
        lead: {
            slug: 'joel-panjimaram-mathew',
            name: 'Joel Panjimaram Mathew',
            role: 'Project Lead',
            image: '',
            noteFrom: 'Board',
            note: 'Demonstrates outstanding project management and technical oversight, driving complex software builds to production.',
            contributions: [
                'Architected core ZBC software projects and deployment pipelines.',
                'Supervised team sprint goals, code reviews, and release cycles.',
                'Guided developers in building resilient full-stack applications.'
            ],
            socials: [
                { platform: 'linkedin', url: '#' },
                { platform: 'github', url: '#' },
                { platform: 'instagram', url: '#' }
            ]
        },
        members: [
            {
                slug: 'alex-morgan',
                name: 'Alex Morgan',
                role: 'Full Stack Engineer',
                image: '',
                noteFrom: 'Lead',
                note: 'Consistently delivers clean, performant microservices and responsive web applications.',
                contributions: [
                    'Built scalable backend endpoints and database models.',
                    'Implemented real-time data sync for club dashboard.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'github', url: '#' }
                ]
            },
            {
                slug: 'rohan-sharma',
                name: 'Rohan Sharma',
                role: 'Frontend Specialist',
                image: '',
                noteFrom: 'Lead',
                note: 'Expert in state management and crafting buttery smooth user interactions.',
                contributions: [
                    'Created dynamic UI components using Framer Motion.',
                    'Optimized front-end build bundles for speed.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'github', url: '#' }
                ]
            },
            {
                slug: 'ananya-verma',
                name: 'Ananya Verma',
                role: 'DevOps Engineer',
                image: '',
                noteFrom: 'Lead',
                note: 'Streamlined deployment workflows and server monitoring for all club projects.',
                contributions: [
                    'Configured CI/CD pipelines and automated Docker deployments.',
                    'Maintained uptime monitoring and logging infrastructure.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'github', url: '#' }
                ]
            }
        ]
    },
    {
        slug: 'technical',
        name: 'Technical',
        lead: {
            slug: 'tharun-gopinath',
            name: 'Tharun Gopinath',
            role: 'Technical Lead',
            image: '',
            noteFrom: 'Board',
            note: 'Technical powerhouse mentoring members in modern frameworks, system architecture, and clean code principles.',
            contributions: [
                'Led technical workshops and hands-on coding bootcamps.',
                'Maintained open-source repositories and infrastructure for ZBC.',
                'Enforced testing and security best practices across projects.'
            ],
            socials: [
                { platform: 'linkedin', url: '#' },
                { platform: 'github', url: '#' },
                { platform: 'instagram', url: '#' }
            ]
        },
        members: [
            {
                slug: 'sam-wilson',
                name: 'Sam Wilson',
                role: 'Systems Architect',
                image: '',
                noteFrom: 'Lead',
                note: 'Reliable developer focused on high-concurrency backend services and database optimization.',
                contributions: [
                    'Engineered REST APIs and database schema migrations.',
                    'Wrote automated test suites for club applications.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'github', url: '#' }
                ]
            },
            {
                slug: 'priya-nair',
                name: 'Priya Nair',
                role: 'Cloud Developer',
                image: '',
                noteFrom: 'Lead',
                note: 'Passionate about serverless computing and cloud infrastructure.',
                contributions: [
                    'Integrated AWS services and serverless functions.',
                    'Authored technical documentation for developer onboarding.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'github', url: '#' }
                ]
            },
            {
                slug: 'vikram-aditya',
                name: 'Vikram Aditya',
                role: 'Security Analyst',
                image: '',
                noteFrom: 'Lead',
                note: 'Sharp eye for vulnerability research and secure coding practices.',
                contributions: [
                    'Conducted vulnerability audits across active web endpoints.',
                    'Wrote automated integration test checks.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'github', url: '#' }
                ]
            }
        ]
    },
    {
        slug: 'design',
        name: 'Design',
        lead: {
            slug: 'aryan-pillai',
            name: 'Aryan Pillai',
            role: 'Design Lead',
            image: '',
            noteFrom: 'Board',
            note: 'Brings extraordinary design aesthetics, visual identity, and user-centric interfaces to all ZBC products.',
            contributions: [
                'Created comprehensive design systems and visual brand guidelines.',
                'Designed UI layouts and interactive prototypes for club web platforms.',
                'Guided design members in UI/UX research and asset creation.'
            ],
            socials: [
                { platform: 'linkedin', url: '#' },
                { platform: 'github', url: '#' },
                { platform: 'instagram', url: '#' }
            ]
        },
        members: [
            {
                slug: 'jordan-lee',
                name: 'Jordan Lee',
                role: 'UI/UX Designer',
                image: '',
                noteFrom: 'Lead',
                note: 'Talented designer crafting responsive graphics and high-fidelity UI layouts.',
                contributions: [
                    'Designed high-fidelity mockups for flagship event websites.',
                    'Crafted custom vector graphics and icon sets.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'instagram', url: '#' }
                ]
            },
            {
                slug: 'sneha-patel',
                name: 'Sneha Patel',
                role: 'Motion Designer',
                image: '',
                noteFrom: 'Lead',
                note: 'Specializes in eye-catching motion graphics and brand animations.',
                contributions: [
                    'Produced animated trailers for club tech symposiums.',
                    'Designed dark mode UI micro-interactions.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'instagram', url: '#' }
                ]
            },
            {
                slug: 'kavya-reddy',
                name: 'Kavya Reddy',
                role: 'Brand Designer',
                image: '',
                noteFrom: 'Lead',
                note: 'Focuses on visual storytelling and consistent brand collateral.',
                contributions: [
                    'Designed merchandise and event badges.',
                    'Created social media poster design systems.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'instagram', url: '#' }
                ]
            }
        ]
    },
    {
        slug: 'events',
        name: 'Events',
        lead: {
            slug: 'shanjay-ravikumar',
            name: 'Shanjay Ravikumar',
            role: 'Event Lead',
            image: '',
            noteFrom: 'Board',
            note: 'Master of event planning and logistics, executing flagship hackathons and workshops seamlessly.',
            contributions: [
                'Directed logistics, venue setups, and schedules for major symposiums.',
                'Coordinated with university administration for event approvals.',
                'Managed volunteer squads during live hackathons.'
            ],
            socials: [
                { platform: 'linkedin', url: '#' },
                { platform: 'instagram', url: '#' }
            ]
        },
        members: [
            {
                slug: 'taylor-reed',
                name: 'Taylor Reed',
                role: 'Event Coordinator',
                image: '',
                noteFrom: 'Lead',
                note: 'Proactive coordinator managing on-ground event operations and participant desks.',
                contributions: [
                    'Handled participant registrations and desk support.',
                    'Managed event stage logistics and technical checks.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'instagram', url: '#' }
                ]
            },
            {
                slug: 'aditya-kumar',
                name: 'Aditya Kumar',
                role: 'Logistics Manager',
                image: '',
                noteFrom: 'Lead',
                note: 'Ensures flawless equipment allocation and venue coordination.',
                contributions: [
                    'Coordinated audiovisual setups for hackathons.',
                    'Managed speaker hospitality and scheduling.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'instagram', url: '#' }
                ]
            },
            {
                slug: 'meera-joshi',
                name: 'Meera Joshi',
                role: 'Volunteer Lead',
                image: '',
                noteFrom: 'Lead',
                note: 'Organizes volunteer shifts and manages real-time event assistance.',
                contributions: [
                    'Trained student volunteers for major campus workshops.',
                    'Handled attendee query desks during sessions.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'instagram', url: '#' }
                ]
            }
        ]
    },
    {
        slug: 'hr',
        name: 'HR',
        lead: {
            slug: 'v-thipthi-shree',
            name: 'V Thipthi Shree',
            role: 'HR Lead',
            image: '',
            noteFrom: 'Board',
            note: 'Fosters team culture, recruitment, and internal engagement to maintain a vibrant developer community.',
            contributions: [
                'Spearheaded recruitment campaigns and interview evaluation pipelines.',
                'Organized internal team bonding sessions and performance tracking.',
                'Managed member attendance and performance reviews.'
            ],
            socials: [
                { platform: 'linkedin', url: '#' },
                { platform: 'instagram', url: '#' }
            ]
        },
        members: [
            {
                slug: 'casey-taylor',
                name: 'Casey Taylor',
                role: 'HR Executive',
                image: '',
                noteFrom: 'Lead',
                note: 'Friendly team member facilitating onboarding and member communication.',
                contributions: [
                    'Managed recruitment documentation and communication.',
                    'Coordinated team surveys and feedback collection.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'instagram', url: '#' }
                ]
            },
            {
                slug: 'deepak-singh',
                name: 'Deepak Singh',
                role: 'Talent Acquisition',
                image: '',
                noteFrom: 'Lead',
                note: 'Drives candidate outreach and structures interview schedules.',
                contributions: [
                    'Streamlined candidate interview scheduling.',
                    'Maintained active member directory records.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'instagram', url: '#' }
                ]
            },
            {
                slug: 'ritika-gupta',
                name: 'Ritika Gupta',
                role: 'Culture Specialist',
                image: '',
                noteFrom: 'Lead',
                note: 'Focuses on team building, rewards, and inclusive community initiatives.',
                contributions: [
                    'Organized internal games and team appreciation awards.',
                    'Collected feedback to improve club culture.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'instagram', url: '#' }
                ]
            }
        ]
    },
    {
        slug: 'outreach',
        name: 'Outreach',
        lead: {
            slug: 'sam-stephen-prince',
            name: 'Sam Stephen Prince',
            role: 'Outreach Lead',
            image: '',
            noteFrom: 'Board',
            note: 'Expands ZBC brand reach, building strategic campus partnerships and social media engagement.',
            contributions: [
                'Spearheaded external outreach campaigns and brand promotion.',
                'Built partnerships with other tech societies and sponsors.',
                'Directed social media marketing strategies.'
            ],
            socials: [
                { platform: 'linkedin', url: '#' },
                { platform: 'instagram', url: '#' }
            ]
        },
        members: [
            {
                slug: 'morgan-davis',
                name: 'Morgan Davis',
                role: 'Social Media Strategist',
                image: '',
                noteFrom: 'Lead',
                note: 'Energetic marketer creating engaging social content and media assets.',
                contributions: [
                    'Created promotional reels and graphic posts.',
                    'Managed active community engagement across channels.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'instagram', url: '#' }
                ]
            },
            {
                slug: 'aravind-swamy',
                name: 'Aravind Swamy',
                role: 'PR Officer',
                image: '',
                noteFrom: 'Lead',
                note: 'Handles media communications and press releases for ZBC events.',
                contributions: [
                    'Drafted press notes and campus newsletter features.',
                    'Coordinated sponsor visibility across media channels.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'instagram', url: '#' }
                ]
            },
            {
                slug: 'tanya-kapoor',
                name: 'Tanya Kapoor',
                role: 'Community Manager',
                image: '',
                noteFrom: 'Lead',
                note: 'Engages with external developer communities and manages Discord channels.',
                contributions: [
                    'Moderated ZBC Discord and online discussion forums.',
                    'Hosted live Q&A sessions for prospective applicants.'
                ],
                socials: [
                    { platform: 'linkedin', url: '#' },
                    { platform: 'instagram', url: '#' }
                ]
            }
        ]
    }
];

export const getBoardMemberBySlug = (slug) => {
    if (slug === facultyCoordinator.slug) return facultyCoordinator;
    return boardMembers.find(m => m.slug === slug);
};

export const getDepartmentBySlug = (slug) => {
    return departments.find(d => d.slug === slug);
};

export const getPersonByDeptAndSlug = (deptSlug, personSlug) => {
    const dept = getDepartmentBySlug(deptSlug);
    if (!dept) return null;

    if (dept.lead.slug === personSlug) {
        return { ...dept.lead, department: dept.name, deptSlug: dept.slug };
    }

    const member = dept.members.find(m => m.slug === personSlug);
    if (member) {
        return { ...member, department: dept.name, deptSlug: dept.slug };
    }

    return null;
};
