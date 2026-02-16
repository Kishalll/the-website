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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAnswerChange = (questionId, value) => {
        setFormData(prev => ({
            ...prev,
            answers: {
                ...prev.answers,
                [questionId]: value
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        alert('Application Submitted! (This is a demo)');
        // Add actual submission logic here
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

                <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10">

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
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Reg No */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Hash size={16} /> Registration Number
                                </label>
                                <input
                                    type="text"
                                    name="regNo"
                                    required
                                    value={formData.regNo}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                    placeholder="24BCE0000"
                                />
                            </div>

                            {/* VIT Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Mail size={16} /> VIT Email ID
                                </label>
                                <input
                                    type="email"
                                    name="vitEmail"
                                    required
                                    value={formData.vitEmail}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                    placeholder="john.doe2024@vitstudent.ac.in"
                                />
                            </div>

                            {/* Year Dropdown */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Calendar size={16} /> Year
                                </label>
                                <div className="relative">
                                    <select
                                        name="year"
                                        required
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
                                    required
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
                                            required={q.required}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            placeholder={q.placeholder}
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors h-32"
                                        />
                                    ) : (
                                        <input
                                            type={q.type}
                                            required={q.required}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            placeholder={q.placeholder}
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                        />
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
                                            required={q.required}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            placeholder={q.placeholder}
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors h-32"
                                        />
                                    ) : (
                                        <input
                                            type={q.type}
                                            required={q.required}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            placeholder={q.placeholder}
                                            className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                                        />
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
