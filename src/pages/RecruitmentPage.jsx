import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { recruitmentConfig } from '../config/recruitment.config';
import { Send, User, Hash, Mail, Calendar, ChevronDown } from 'lucide-react';
import LightRays from '../components/ui/LightRays';

const RecruitmentPage = () => {
    const navigate = useNavigate();
    const { isRecruiting, departments, generalQuestions, domainQuestions } = recruitmentConfig;

    useEffect(() => {
        if (!isRecruiting) {
            alert("We aren't recruiting right now. Stay tuned for updates!");
            navigate('/about');
        }
    }, [isRecruiting, navigate]);

    const [formData, setFormData] = useState({
        name: '',
        regNo: '',
        info: '', // Changed 'vitEmail' to 'info' as generic or keeping it 'vitEmail' if explicitly asked
        // User asked for: name, regno, vit mailid
        vitEmail: '',
        year: '',
        department: '',
        answers: {}
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setFormData(prev => ({
            ...prev,
            answers: {
                ...prev.answers,
                [questionId]: value
            }
        }));
        // Clear error when user types
        if (errors[questionId]) {
            setErrors(prev => ({ ...prev, [questionId]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // 1. Name
        if (!formData.name.trim()) newErrors.name = "Name is required";

        // 2. Reg No
        if (!formData.regNo.trim()) {
            newErrors.regNo = "Registration Number is required";
        } else {
            const regNoPattern = /^\d{2}[a-zA-Z]{3}\d{4}$/;
            if (!regNoPattern.test(formData.regNo)) {
                newErrors.regNo = "Format must be XXYYYXXXX (e.g., 24BCE0000)";
            }
        }

        // 3. VIT Email
        if (!formData.vitEmail.trim()) {
            newErrors.vitEmail = "VIT Email ID is required";
        } else {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@vit\.ac\.in$/;
            if (!emailPattern.test(formData.vitEmail)) {
                newErrors.vitEmail = "Email must end with @vit.ac.in";
            }
        }

        // 4. Year
        if (!formData.year) newErrors.year = "Year is required";

        // 5. Department
        if (!formData.department) newErrors.department = "Department is required";

        // 6. General Questions
        generalQuestions.forEach(q => {
            const answer = formData.answers[q.id];
            if (q.required && !answer?.trim()) {
                newErrors[q.id] = "This field is required";
            } else if (answer && q.validation && q.validation.pattern) {
                const regex = new RegExp(q.validation.pattern);
                if (!regex.test(answer)) {
                    newErrors[q.id] = q.validation.message || "Invalid format";
                }
            }
        });

        // 7. Domain Questions
        if (formData.department && domainQuestions[formData.department]) {
            domainQuestions[formData.department].forEach(q => {
                const answer = formData.answers[q.id];
                if (q.required && !answer?.trim()) {
                    newErrors[q.id] = "This field is required";
                } else if (answer && q.validation && q.validation.pattern) {
                    const regex = new RegExp(q.validation.pattern);
                    if (!regex.test(answer)) {
                        newErrors[q.id] = q.validation.message || "Invalid format";
                    }
                }
            });
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length === 0) {
            console.log('Form Submitted:', formData);
            alert('Application Submitted! (This is a demo)');
            // Add actual submission logic here
        } else {
            // Get the first error field
            const firstErrorField = Object.keys(formErrors)[0];

            // Set only the first error to display
            setErrors({ [firstErrorField]: formErrors[firstErrorField] });

            // Scroll to the error
            const element = document.getElementsByName(firstErrorField)[0];
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus({ preventScroll: true });
            }

            // Auto-hide error after 3 seconds
            setTimeout(() => {
                setErrors(prev => {
                    const newState = { ...prev };
                    delete newState[firstErrorField];
                    return newState;
                });
            }, 3000);
        }
    };

    if (!isRecruiting) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        >
            <div className="absolute inset-0 z-0 pointer-events-none">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#444444"
                    raysSpeed={0.5}
                    lightSpread={0.6}
                    rayLength={0.8}
                />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white uppercase glitch-wrapper" data-text="ZBC Recruitments 2025 -26">
                        ZBC Recruitments 2025 -26
                    </h1>
                    <p className="text-gray-400">Join the community. Build the future.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10" noValidate>

                    {/* Basic Details */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Basic Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <User size={16} /> Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                    placeholder="John Doe"
                                />
                                {errors.name && (
                                    <span
                                        className="text-red-500 text-xs mt-1 cursor-pointer block"
                                        onClick={() => setErrors(prev => ({ ...prev, name: '' }))}
                                    >
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            {/* Reg No */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Hash size={16} /> Registration Number
                                </label>
                                <input
                                    type="text"
                                    name="regNo"
                                    value={formData.regNo}
                                    onChange={handleInputChange}
                                    className={`w-full bg-black/50 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors ${errors.regNo ? 'border-red-500' : 'border-white/20'}`}
                                    placeholder="24BCE0000"
                                />
                                {errors.regNo && (
                                    <span
                                        className="text-red-500 text-xs mt-1 cursor-pointer block"
                                        onClick={() => setErrors(prev => ({ ...prev, regNo: '' }))}
                                    >
                                        {errors.regNo}
                                    </span>
                                )}
                            </div>

                            {/* VIT Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Mail size={16} /> VIT Email ID
                                </label>
                                <input
                                    type="email"
                                    name="vitEmail"
                                    value={formData.vitEmail}
                                    onChange={handleInputChange}
                                    className={`w-full bg-black/50 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors ${errors.vitEmail ? 'border-red-500' : 'border-white/20'}`}
                                    placeholder="john.doe2024@vitstudent.ac.in"
                                />
                                {errors.vitEmail && (
                                    <span
                                        className="text-red-500 text-xs mt-1 cursor-pointer block"
                                        onClick={() => setErrors(prev => ({ ...prev, vitEmail: '' }))}
                                    >
                                        {errors.vitEmail}
                                    </span>
                                )}
                            </div>

                            {/* Year Dropdown */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Calendar size={16} /> Year
                                </label>
                                <div className="relative">
                                    <select
                                        name="year"
                                        value={formData.year}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-white transition-colors cursor-pointer"
                                    >
                                        <option value="" disabled>Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                                {errors.year && (
                                    <span
                                        className="text-red-500 text-xs mt-1 cursor-pointer block"
                                        onClick={() => setErrors(prev => ({ ...prev, year: '' }))}
                                    >
                                        {errors.year}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Department Selection */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Department</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Select Department</label>
                            <div className="relative">
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-white transition-colors cursor-pointer"
                                >
                                    <option value="" disabled>Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                            {errors.department && (
                                <span
                                    className="text-red-500 text-xs mt-1 cursor-pointer block"
                                    onClick={() => setErrors(prev => ({ ...prev, department: '' }))}
                                >
                                    {errors.department}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Questions */}
                    {formData.department && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Department Questions</h2>

                            {/* General Questions */}
                            {generalQuestions.map(q => (
                                <div key={q.id} className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        {q.label} {q.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {q.type === 'textarea' ? (
                                        <textarea
                                            name={q.id}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            placeholder={q.placeholder}
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors h-32"
                                        />
                                    ) : (
                                        <input
                                            type={q.type}
                                            name={q.id}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            placeholder={q.placeholder}
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                        />
                                    )}
                                    {errors[q.id] && (
                                        <span
                                            className="text-red-500 text-xs mt-1 cursor-pointer block"
                                            onClick={() => setErrors(prev => ({ ...prev, [q.id]: '' }))}
                                        >
                                            {errors[q.id]}
                                        </span>
                                    )}
                                </div>
                            ))}

                            {/* Specific Domain Questions */}
                            {domainQuestions[formData.department]?.map(q => (
                                <div key={q.id} className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">
                                        {q.label} {q.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {q.type === 'textarea' ? (
                                        <textarea
                                            name={q.id}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            placeholder={q.placeholder}
                                            className={`w-full bg-black/50 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors h-32 ${errors[q.id] ? 'border-red-500' : 'border-white/20'}`}
                                        />
                                    ) : (
                                        <input
                                            type={q.type}
                                            name={q.id}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            placeholder={q.placeholder}
                                            className={`w-full bg-black/50 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors ${errors[q.id] ? 'border-red-500' : 'border-white/20'}`}
                                        />
                                    )}
                                    {errors[q.id] && (
                                        <span
                                            className="text-red-500 text-xs mt-1 cursor-pointer block"
                                            onClick={() => setErrors(prev => ({ ...prev, [q.id]: '' }))}
                                        >
                                            {errors[q.id]}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        Submit Application <Send size={18} />
                    </button>

                </form>
            </div>
        </motion.div>
    );
};

export default RecruitmentPage;
