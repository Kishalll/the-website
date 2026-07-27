import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { recruitmentConfig } from '../config/recruitment.config';
import { Send, User, Hash, Mail, Calendar, ChevronDown, Check, Layers } from 'lucide-react';
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (Object.keys(formErrors).length === 0) {
            console.log('Form Submitted:', formData);
            alert('Application Submitted! (This is a demo)');
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
                                    placeholder="Pattasu Balu"
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
                                    placeholder="24BCE6767"
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
                                    placeholder="pattasu.balu2024@vitstudent.ac.in"
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

                            {/* Custom Year Dropdown */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Calendar size={16} /> Year
                                </label>
                                <CustomSelect
                                    name="year"
                                    value={formData.year}
                                    options={yearOptions}
                                    placeholder="Select Year"
                                    onChange={handleInputChange}
                                    icon={Calendar}
                                    error={errors.year}
                                />
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
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Layers size={16} /> Select Department
                            </label>
                            <CustomSelect
                                name="department"
                                value={formData.department}
                                options={departments}
                                placeholder="Select Department"
                                onChange={handleInputChange}
                                icon={Layers}
                                error={errors.department}
                            />
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
                                        <div className="space-y-1">
                                            <textarea
                                                name={q.id}
                                                value={formData.answers[q.id] || ''}
                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                placeholder={q.placeholder}
                                                className={`w-full bg-black/50 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors h-36 ${errors[q.id] ? 'border-red-500' : 'border-white/20'}`}
                                            />
                                            {q.wordLimit && (
                                                <div className="flex justify-end text-xs text-gray-400 font-mono">
                                                    Word count: {formData.answers[q.id] ? formData.answers[q.id].trim().split(/\s+/).filter(Boolean).length : 0} / {q.wordLimit} words
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            type={q.type}
                                            name={q.id}
                                            value={formData.answers[q.id] || ''}
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
                                        <div className="space-y-1">
                                            <textarea
                                                name={q.id}
                                                value={formData.answers[q.id] || ''}
                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                placeholder={q.placeholder}
                                                className={`w-full bg-black/50 border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors h-36 ${errors[q.id] ? 'border-red-500' : 'border-white/20'}`}
                                            />
                                            {q.wordLimit && (
                                                <div className="flex justify-end text-xs text-gray-400 font-mono">
                                                    Word count: {formData.answers[q.id] ? formData.answers[q.id].trim().split(/\s+/).filter(Boolean).length : 0} / {q.wordLimit} words
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <input
                                            type={q.type}
                                            name={q.id}
                                            value={formData.answers[q.id] || ''}
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

                    {/* Animated Submit Button */}
                    <motion.button
                        type="submit"
                        whileHover={{
                            scale: 1.02,
                            y: -4,
                            boxShadow: "0px 12px 35px 2px rgba(255, 255, 255, 0.35)",
                            backgroundColor: "#ffffff"
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 22
                        }}
                        className="group w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-lg cursor-pointer flex items-center justify-center gap-2 relative overflow-hidden transition-colors"
                    >
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
                    </motion.button>

                </form>
            </div>
        </motion.div>
    );
};

export default RecruitmentPage;