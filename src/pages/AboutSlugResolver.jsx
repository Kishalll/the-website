import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DepartmentPage from './DepartmentPage';
import { getDepartmentBySlug } from '../data/teamData';

const AboutSlugResolver = () => {
    const { slug } = useParams();
    const department = getDepartmentBySlug(slug);

    if (department) {
        return <DepartmentPage />;
    }

    // Personal slugs temporarily disabled - redirect to /about
    return <Navigate to="/about" replace />;
};

export default AboutSlugResolver;
