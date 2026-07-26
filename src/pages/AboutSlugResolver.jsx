import React from 'react';
import { useParams } from 'react-router-dom';
import DepartmentPage from './DepartmentPage';
import PersonDetailPage from './PersonDetailPage';
import { getDepartmentBySlug } from '../data/teamData';

const AboutSlugResolver = () => {
    const { slug } = useParams();
    const department = getDepartmentBySlug(slug);

    if (department) {
        return <DepartmentPage />;
    }

    return <PersonDetailPage />;
};

export default AboutSlugResolver;
