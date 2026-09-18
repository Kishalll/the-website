import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { recruitmentConfig } from '../config/recruitment.config';
import { supabase } from '../lib/supabase';
import { Send, User, Hash, Mail, Calendar, ChevronDown, Check, Layers, ArrowLeft } from 'lucide-react';
import LightRays from '../components/ui/LightRays';

const CustomSelect = ({ name, value, options, placeholder, onChange, icon: Icon, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(o => (o.value || o.id) === value);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange({ target: { name, value: val } });
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-black/60 border rounded-lg px-4 py-3 text-left text-white flex items-center justify-between transition-all duration-200 cursor-pointer shadow-sm ${
                    error ? 'border-red-500' : 'border-white/20 hover:border-white/40'
                }`}
            >
                <div className="flex items-center gap-2 text-sm font-medium">
                    {Icon && <Icon size={16} className="text-gray-400 shrink-0" />}
                    <span className={selectedOption ? 'text-white font-semibold' : 'text-gray-400'}>
                        {selectedOption ? selectedOption.label || selectedOption.name : placeholder}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-neutral-900/98 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl z-50 py-1.5 overflow-y-auto max-h-56 ring-1 ring-white/10">
                    {options.map((opt) => {
                        const optVal = opt.value || opt.id;
                        const optLabel = opt.label || opt.name;
                        const isSelected = optVal === value;

                        return (
                            <button
                                key={optVal}
                                type="button"
                                onClick={() => handleSelect(optVal)}
                                className={`w-full px-4 py-2.5 text-sm font-medium flex items-center justify-between transition-colors cursor-pointer text-left ${
                                    isSelected
                                        ? 'bg-white/15 text-white font-semibold'
                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <span>{optLabel}</span>
                                {isSelected && <Check size={16} className="text-white shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

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
        vitEmail: '',
        year: '',
        department: '',
        answers: {}
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const yearOptions = [
        { value: '1', label: '1st Year' },
        { value: '2', label: '2nd Year' },
        { value: '3', label: '3rd Year' },
        { value: '4', label: '4th Year' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
        if (errors[questionId]) {
            setErrors(prev => ({ ...prev, [questionId]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";

        if (!formData.regNo.trim()) {
            newErrors.regNo = "Registration Number is required";
        } else {
            const regNoPattern = /^\d{2}[a-zA-Z]{3}\d{4}$/;
            if (!regNoPattern.test(formData.regNo)) {
                newErrors.regNo = "Format must be XXYYYXXXX (e.g., 24BCE0000)";
            }
        }

        if (!formData.vitEmail.trim()) {
            newErrors.vitEmail = "VIT Email ID is required";
        } else {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@vit\.ac\.in$/;
            if (!emailPattern.test(formData.vitEmail)) {
                newErrors.vitEmail = "Email must end with @vit.ac.in";
            }
        }

        if (!formData.year) newErrors.year = "Year is required";
        if (!formData.department) newErrors.department = "Department is required";

        generalQuestions.forEach(q => {
            const answer = formData.answers[q.id];
            if (q.required && !answer?.trim()) {
                newErrors[q.id] = "This field is required";
            } else if (answer && q.wordLimit) {
                const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
                if (wordCount > q.wordLimit) {
                    newErrors[q.id] = `Maximum limit of ${q.wordLimit} words exceeded (${wordCount}/${q.wordLimit} words)`;
                }
            } else if (answer && q.validation && q.validation.pattern) {
                const regex = new RegExp(q.validation.pattern);
                if (!regex.test(answer)) {
                    newErrors[q.id] = q.validation.message || "Invalid format";
                }
            }
        });

        if (formData.department && domainQuestions[formData.department]) {
            domainQuestions[formData.department].forEach(q => {
                const answer = formData.answers[q.id];
                if (q.required && !answer?.trim()) {
                    newErrors[q.id] = "This field is required";
                } else if (answer && q.wordLimit) {
                    const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
                    if (wordCount > q.wordLimit) {
                        newErrors[q.id] = `Maximum limit of ${q.wordLimit} words exceeded (${wordCount}/${q.wordLimit} words)`;
                    }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length === 0) {
            setIsSubmitting(true);
            try {
                if (!supabase) {
                    console.warn('Supabase is not configured. Submission cannot be processed.');
                    alert('Submission failed: Supabase is not configured. Please check your environment configuration.');
                    return;
                }

                const { error } = await supabase
                    .from('recruitment_applications')
                    .insert([
                        {
                            name: formData.name,
                            reg_no: formData.regNo,
                            vit_email: formData.vitEmail,
                            year: formData.year,
                            department: formData.department,
                            answers: formData.answers
                        }
                    ]);

                if (error) {
                    console.error('Supabase insertion error:', error);
                    alert('Submission failed. Please check your details and try again.');
                } else {
                    setIsSubmitted(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                alert('Submission failed. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            const firstErrorField = Object.keys(formErrors)[0];
            setErrors({ [firstErrorField]: formErrors[firstErrorField] });

            const element = document.getElementsByName(firstErrorField)[0];
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus({ preventScroll: true });
            }

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
            className="min-h-screen bg-black pt-24 pb-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
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
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black text-gray-300 font-medium text-sm transition-all duration-300 group cursor-pointer shadow-md"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Home</span>
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white uppercase glitch-wrapper" data-text="ZBC Recruitments 2025 -26">
                        ZBC Recruitments 2025 -26
                    </h1>
                    <p className="text-gray-400">Join the community. Build the future.</p>
                </div>

                    {/* Form Container or Success View */}
                    {isSubmitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-950/75 backdrop-blur-md p-8 sm:p-12 rounded-2xl border border-white/15 shadow-2xl text-center space-y-6 relative z-30"
                        >
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto text-white">
                                <Check size={36} />
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight uppercase">
                                Application Submitted!
                            </h2>
                            <p className="text-gray-300 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                                Thank you for applying to ZBC. <span className="text-white font-semibold border-b border-white/30 pb-0.5">We will review your application and reach out to you via your email.</span>
                            </p>
                            <div className="pt-4 flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="w-full sm:w-auto px-6 py-3 bg-white text-black font-bold uppercase tracking-wider text-xs sm:text-sm rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Return to Home
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 bg-zinc-950/75 backdrop-blur-md p-5 sm:p-8 rounded-2xl border border-white/15 shadow-2xl relative z-30" noValidate>

                            {/* Basic Details */}
                            <div className="space-y-5 sm:space-y-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-white border-b border-white/10 pb-2">Basic Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-1.5">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter your full name"
                                                className={`w-full bg-black/60 border ${errors.name ? 'border-red-500' : 'border-white/15 focus:border-white'} rounded-lg pl-9 sm:pl-10 pr-3.5 sm:pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors`}
                                            />
                                        </div>
                                        {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>}
                                    </div>

                                    {/* Registration Number */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-1.5">
                                            Registration Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                            <input
                                                type="text"
                                                name="regNo"
                                                value={formData.regNo}
                                                onChange={handleInputChange}
                                                placeholder="e.g. 24BCE0000"
                                                className={`w-full bg-black/60 border ${errors.regNo ? 'border-red-500' : 'border-white/15 focus:border-white'} rounded-lg pl-9 sm:pl-10 pr-3.5 sm:pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white uppercase placeholder-gray-500 focus:outline-none transition-colors`}
                                            />
                                        </div>
                                        {errors.regNo && <span className="text-xs text-red-500 mt-1 block">{errors.regNo}</span>}
                                    </div>

                                    {/* VIT Email */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-1.5">
                                            VIT Email ID <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                            <input
                                                type="email"
                                                name="vitEmail"
                                                value={formData.vitEmail}
                                                onChange={handleInputChange}
                                                placeholder="name.number@vit.ac.in"
                                                className={`w-full bg-black/60 border ${errors.vitEmail ? 'border-red-500' : 'border-white/15 focus:border-white'} rounded-lg pl-9 sm:pl-10 pr-3.5 sm:pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors`}
                                            />
                                        </div>
                                        {errors.vitEmail && <span className="text-xs text-red-500 mt-1 block">{errors.vitEmail}</span>}
                                    </div>

                                    {/* Academic Year */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-1.5">
                                            Academic Year <span className="text-red-500">*</span>
                                        </label>
                                        <CustomSelect
                                            name="year"
                                            value={formData.year}
                                            options={yearOptions}
                                            placeholder="Select your year"
                                            onChange={handleInputChange}
                                            icon={Calendar}
                                            error={errors.year}
                                        />
                                    </div>
                                </div>

                                {/* Preferred Department */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-1.5">
                                        Preferred Department <span className="text-red-500">*</span>
                                    </label>
                                    <CustomSelect
                                        name="department"
                                        value={formData.department}
                                        options={departments}
                                        placeholder="Select department"
                                        onChange={handleInputChange}
                                        icon={Layers}
                                        error={errors.department}
                                    />
                                </div>
                            </div>

                            {/* General Questions */}
                            {generalQuestions.length > 0 && (
                                <div className="space-y-5 sm:space-y-6 pt-4 border-t border-white/10">
                                    <h2 className="text-xl sm:text-2xl font-bold text-white">General Questions</h2>
                                    {generalQuestions.map((q) => (
                                        <div key={q.id}>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-1.5">
                                                {q.label} {q.required && <span className="text-red-500">*</span>}
                                            </label>
                                            {q.type === 'textarea' ? (
                                                <textarea
                                                    name={q.id}
                                                    rows={4}
                                                    value={formData.answers[q.id] || ''}
                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    placeholder={q.placeholder}
                                                    className={`w-full bg-black/60 border ${errors[q.id] ? 'border-red-500' : 'border-white/15 focus:border-white'} rounded-lg p-3 sm:p-3.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors resize-y min-h-[100px]`}
                                                />
                                            ) : (
                                                <input
                                                    type={q.type || 'text'}
                                                    name={q.id}
                                                    value={formData.answers[q.id] || ''}
                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    placeholder={q.placeholder}
                                                    className={`w-full bg-black/60 border ${errors[q.id] ? 'border-red-500' : 'border-white/15 focus:border-white'} rounded-lg px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors`}
                                                />
                                            )}
                                            {errors[q.id] && (
                                                <span className="text-xs text-red-500 mt-1 block">
                                                    {errors[q.id]}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Domain-Specific Questions */}
                            {formData.department && domainQuestions[formData.department] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-5 sm:space-y-6 pt-4 border-t border-white/10"
                                >
                                    <h2 className="text-xl sm:text-2xl font-bold text-white capitalize">
                                        {formData.department} Department Questions
                                    </h2>
                                    {domainQuestions[formData.department].map((q) => (
                                        <div key={q.id}>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-1.5">
                                                {q.label} {q.required && <span className="text-red-500">*</span>}
                                            </label>
                                            {q.type === 'textarea' ? (
                                                <textarea
                                                    name={q.id}
                                                    rows={4}
                                                    value={formData.answers[q.id] || ''}
                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    placeholder={q.placeholder}
                                                    className={`w-full bg-black/60 border ${errors[q.id] ? 'border-red-500' : 'border-white/15 focus:border-white'} rounded-lg p-3 sm:p-3.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors resize-y min-h-[100px]`}
                                                />
                                            ) : (
                                                <input
                                                    type={q.type || 'text'}
                                                    name={q.id}
                                                    value={formData.answers[q.id] || ''}
                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    placeholder={q.placeholder}
                                                    className={`w-full bg-black/60 border ${errors[q.id] ? 'border-red-500' : 'border-white/15 focus:border-white'} rounded-lg px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-colors`}
                                                />
                                            )}
                                            {errors[q.id] && (
                                                <span className="text-xs text-red-500 mt-1 block">
                                                    {errors[q.id]}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Animated Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={!isSubmitting ? {
                                    scale: 1.02,
                                    y: -4,
                                    boxShadow: "0px 12px 35px 2px rgba(255, 255, 255, 0.35)",
                                    backgroundColor: "#ffffff"
                                } : {}}
                                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 22
                                }}
                                className="group w-full bg-white text-black font-bold uppercase tracking-widest py-3.5 sm:py-4 rounded-lg cursor-pointer flex items-center justify-center gap-2 relative overflow-hidden transition-colors text-xs sm:text-sm disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span>Submitting Application...</span>
                                ) : (
                                    <>
                                        <span>Submit Application</span>
                                        <motion.div
                                            className="flex items-center justify-center"
                                            variants={{
                                                hover: { x: 4, rotate: -10 }
                                            }}
                                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                        >
                                            <Send size={18} className="group-hover:translate-x-1 group-hover:-rotate-12 transition-transform duration-200" />
                                        </motion.div>
                                    </>
                                )}
                            </motion.button>

                        </form>
                    )}
                </div>
        </motion.div>
    );
};

export default RecruitmentPage;