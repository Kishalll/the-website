import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, Plus, Trash2, Edit2, X, AlertTriangle, Check, 
    BookOpen, User, Layers, Sparkles, Copy, Eye, Clock, 
    ChevronDown, CheckCircle2, ArrowRight
} from 'lucide-react';
import {
    DAYS,
    MORNING_THEORY_HOURS,
    MORNING_LAB_HOURS,
    AFTERNOON_THEORY_HOURS,
    AFTERNOON_LAB_HOURS,
    TIMETABLE_GRID,
    LAB_PAIRS,
    THEORY_SLOT_GROUPS,
    parseSlotString,
    getGridPositionsForSlots,
    checkSlotClash,
    getAvailableOptionsForCell,
    validateSlotString,
} from '../data/timetableData';

const STORAGE_KEY = 'zbc_ffcs_timetables_v1';
const ACTIVE_TIMETABLE_KEY = 'zbc_ffcs_active_id_v1';

const defaultInitialTimetable = {
    id: 'default-tt-1',
    name: 'Primary Timetable',
    createdAt: Date.now(),
    courses: []
};

const FFCSPlanner = () => {
    // 1. Timetables state (persisted in localStorage)
    const [timetables, setTimetables] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.warn('Failed to parse saved timetables:', e);
        }
        return [defaultInitialTimetable];
    });

    const [activeTimetableId, setActiveTimetableId] = useState(() => {
        try {
            const savedId = localStorage.getItem(ACTIVE_TIMETABLE_KEY);
            if (savedId) return savedId;
        } catch (e) {
            // ignore
        }
        return 'default-tt-1';
    });

    // Comparison modal state
    const [compareModalOpen, setCompareModalOpen] = useState(false);
    const [compareTargetId, setCompareTargetId] = useState('');

    // Active timetable
    const activeTimetable = useMemo(() => {
        return timetables.find(t => t.id === activeTimetableId) || timetables[0] || defaultInitialTimetable;
    }, [timetables, activeTimetableId]);

    const activeCourses = activeTimetable.courses || [];

    // Sync to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(timetables));
        } catch (e) {
            console.error('Failed to save timetables to localStorage:', e);
        }
    }, [timetables]);

    useEffect(() => {
        try {
            localStorage.setItem(ACTIVE_TIMETABLE_KEY, activeTimetableId);
        } catch (e) {
            // ignore
        }
    }, [activeTimetableId]);

    // Modal state for Add/Edit/Inspect Course
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit' | 'inspect'
    const [editingCourseId, setEditingCourseId] = useState(null);

    // Form fields in the modal
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        slot: '',
        credits: '3',
        teachers: ['']
    });

    const [formErrors, setFormErrors] = useState({});

    // Map each grid coordinate "DAY-COL" to occupied course info for fast lookups
    // key: "MON-0", val: { course, isTheoryOccupied, isLabOccupied, slotName }
    const cellOccupancy = useMemo(() => {
        const map = {};
        activeCourses.forEach(course => {
            const slots = parseSlotString(course.slot);
            const positions = getGridPositionsForSlots(slots);
            positions.forEach(pos => {
                const key = `${pos.day}-${pos.col}`;
                map[key] = {
                    course,
                    slot: course.slot
                };
            });
        });
        return map;
    }, [activeCourses]);

    // Quick summary stats
    const totalCredits = useMemo(() => {
        return activeCourses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
    }, [activeCourses]);

    // Handlers for Timetable management
    const handleCreateTimetable = () => {
        const newName = prompt('Enter a name for the new timetable:', `Timetable Option ${timetables.length + 1}`);
        if (!newName || !newName.trim()) return;
        const newTt = {
            id: 'tt-' + Date.now(),
            name: newName.trim(),
            createdAt: Date.now(),
            courses: []
        };
        setTimetables(prev => [...prev, newTt]);
        setActiveTimetableId(newTt.id);
    };

    const handleDuplicateTimetable = (ttId) => {
        const source = timetables.find(t => t.id === ttId);
        if (!source) return;
        const copy = {
            ...source,
            id: 'tt-' + Date.now(),
            name: `${source.name} (Copy)`,
            createdAt: Date.now(),
            courses: JSON.parse(JSON.stringify(source.courses || []))
        };
        setTimetables(prev => [...prev, copy]);
        setActiveTimetableId(copy.id);
    };

    const handleDeleteTimetable = (ttId) => {
        if (timetables.length <= 1) {
            alert('You must have at least one timetable.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this timetable?')) return;
        const nextList = timetables.filter(t => t.id !== ttId);
        setTimetables(nextList);
        if (activeTimetableId === ttId) {
            setActiveTimetableId(nextList[0].id);
        }
    };

    const handleRenameTimetable = (ttId) => {
        const current = timetables.find(t => t.id === ttId);
        if (!current) return;
        const newName = prompt('Rename timetable:', current.name);
        if (!newName || !newName.trim()) return;
        setTimetables(prev => prev.map(t => t.id === ttId ? { ...t, name: newName.trim() } : t));
    };

    // State for suggested slot options in modal
    const [modalSlotOptions, setModalSlotOptions] = useState([]);

    // Open modal to add or inspect course
    const handleCellClick = (day, col, cell) => {
        if (cell.isExtramural) return;

        const key = `${day}-${col}`;
        const existing = cellOccupancy[key];

        if (existing) {
            // Course is already present here: open inspect/edit/delete modal for the entire course
            const course = existing.course;
            setEditingCourseId(course.id);
            setFormData({
                code: course.code || '',
                name: course.name || '',
                slot: course.slot || '',
                credits: course.credits || '3',
                teachers: Array.isArray(course.teachers) && course.teachers.length > 0 ? [...course.teachers] : ['']
            });
            const cellOptions = getAvailableOptionsForCell(cell.theorySlot, cell.labSlot);
            setModalSlotOptions(cellOptions);
            setFormErrors({});
            setModalMode('inspect');
            setModalOpen(true);
        } else {
            // Empty cell: calculate options that specifically contain the clicked slot or its group and lab pair
            const cellOptions = getAvailableOptionsForCell(cell.theorySlot, cell.labSlot);
            const defaultSlot = cellOptions.length > 0 ? cellOptions[0].value : (cell.theorySlot || cell.labSlot || '');
            
            setEditingCourseId(null);
            setFormData({
                code: '',
                name: '',
                slot: defaultSlot,
                credits: defaultSlot.startsWith('L') ? '1' : '3',
                teachers: ['']
            });
            setModalSlotOptions(cellOptions);
            setFormErrors({});
            setModalMode('add');
            setModalOpen(true);
        }
    };

    const handleOpenAddModalManual = () => {
        setEditingCourseId(null);
        setFormData({
            code: '',
            name: '',
            slot: 'A1+TA1+TAA1',
            credits: '3',
            teachers: ['']
        });
        setModalSlotOptions([]);
        setFormErrors({});
        setModalMode('add');
        setModalOpen(true);
    };

    // Teacher input array helpers
    const handleAddTeacherField = () => {
        setFormData(prev => ({ ...prev, teachers: [...prev.teachers, ''] }));
    };

    const handleTeacherChange = (index, value) => {
        setFormData(prev => {
            const next = [...prev.teachers];
            next[index] = value;
            return { ...prev, teachers: next };
        });
    };

    const handleRemoveTeacherField = (index) => {
        setFormData(prev => {
            const next = prev.teachers.filter((_, i) => i !== index);
            return { ...prev, teachers: next.length === 0 ? [''] : next };
        });
    };

    // Save or Update Course
    const handleSaveCourse = (e) => {
        e.preventDefault();
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Course name is required';
        if (!formData.slot.trim()) {
            errors.slot = 'Slot selection is required';
        } else {
            const validation = validateSlotString(formData.slot);
            if (!validation.isValid) {
                errors.slot = validation.message;
            }
        }

        // Clash check if valid
        if (!errors.slot) {
            const clashCheck = checkSlotClash(formData.slot, activeCourses, editingCourseId);
            if (clashCheck.hasClash) {
                const conflictCourseNames = [...new Set(clashCheck.conflicts.map(c => `${c.courseName} (${c.slot})`))].join(', ');
                errors.slot = `Slot clash! Conflicts with: ${conflictCourseNames}`;
            }
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const cleanedTeachers = formData.teachers.map(t => t.trim()).filter(Boolean);

        if (editingCourseId) {
            // Update existing
            setTimetables(prev => prev.map(tt => {
                if (tt.id !== activeTimetableId) return tt;
                return {
                    ...tt,
                    courses: (tt.courses || []).map(c => {
                        if (c.id !== editingCourseId) return c;
                        return {
                            ...c,
                            code: formData.code.trim(),
                            name: formData.name.trim(),
                            slot: formData.slot.trim().toUpperCase(),
                            credits: formData.credits,
                            teachers: cleanedTeachers
                        };
                    })
                };
            }));
        } else {
            // Add new
            const newCourse = {
                id: 'course-' + Date.now(),
                code: formData.code.trim(),
                name: formData.name.trim(),
                slot: formData.slot.trim().toUpperCase(),
                credits: formData.credits,
                teachers: cleanedTeachers
            };

            setTimetables(prev => prev.map(tt => {
                if (tt.id !== activeTimetableId) return tt;
                return {
                    ...tt,
                    courses: [...(tt.courses || []), newCourse]
                };
            }));
        }

        setModalOpen(false);
    };

    // Delete Course (deletes entire course and all its slot combinations)
    const handleDeleteCourse = (courseId) => {
        setTimetables(prev => prev.map(tt => {
            if (tt.id !== activeTimetableId) return tt;
            return {
                ...tt,
                courses: (tt.courses || []).filter(c => c.id !== courseId)
            };
        }));
        setModalOpen(false);
    };

    // All available selectable slots categorized
    const allSelectableSlots = useMemo(() => {
        const theorySlots = [];
        Object.values(THEORY_SLOT_GROUPS).forEach(list => {
            list.forEach(slotCombo => {
                if (!theorySlots.includes(slotCombo)) theorySlots.push(slotCombo);
            });
        });
        return {
            theory: theorySlots,
            lab: LAB_PAIRS
        };
    }, []);

    return (
        <div className="flex-1 flex flex-col w-full text-white">
            {/* Top Toolbar: Flexible and responsive, no horizontal scrolling for buttons */}
            <div className="w-full mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 bg-black/75 border border-white/10 p-2.5 sm:p-3.5 rounded-[4px] backdrop-blur-md shadow-xl">
                    {/* Left: Timetable Selector & Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 hidden xs:inline">Timetable:</span>

                        <select
                            value={activeTimetableId}
                            onChange={(e) => setActiveTimetableId(e.target.value)}
                            className="bg-black border border-white/20 text-white rounded-[2px] px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-white cursor-pointer max-w-[140px] sm:max-w-[200px] truncate"
                        >
                            {timetables.map(tt => (
                                <option key={tt.id} value={tt.id} className="bg-neutral-900 text-white">
                                    {tt.name} ({tt.courses?.length || 0})
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={() => handleRenameTimetable(activeTimetableId)}
                            className="p-1.5 hover:bg-white/10 rounded-[2px] text-gray-400 hover:text-white transition-colors"
                            title="Rename timetable"
                        >
                            <Edit2 size={14} />
                        </button>

                        <button
                            type="button"
                            onClick={() => handleDuplicateTimetable(activeTimetableId)}
                            className="p-1.5 hover:bg-white/10 rounded-[2px] text-gray-400 hover:text-white transition-colors"
                            title="Duplicate timetable"
                        >
                            <Copy size={14} />
                        </button>

                        {timetables.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleDeleteTimetable(activeTimetableId)}
                                className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-[2px] transition-colors"
                                title="Delete timetable"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleCreateTimetable}
                            className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-[2px] bg-black border border-[#525252] text-[#8a8a8a] hover:text-white hover:border-[#a3a3a3] hover:bg-white/[0.08] active:bg-white/[0.15] hover:shadow-[0_0_8px_rgba(255,255,255,0.12)] font-semibold text-xs tracking-wide uppercase transition-all duration-150 ease-in-out cursor-pointer shrink-0"
                            title="New Timetable"
                            aria-label="New Timetable"
                        >
                            <Plus size={14} />
                            <span className="hidden sm:inline">New Timetable</span>
                        </button>
                    </div>

                    {/* Right: Two separate stats buttons, Compare button, Add Course button */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
                        {/* Separate Courses button */}
                        <div className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-[2px] bg-black border border-[#525252] text-[#8a8a8a] hover:text-[#d4d4d4] hover:border-[#737373] hover:bg-white/[0.04] font-semibold text-xs tracking-wide uppercase shadow-sm transition-all duration-150 ease-in-out select-none shrink-0" title="Enrolled Courses">
                            <BookOpen size={13} />
                            <span>{activeCourses.length} <span className="hidden sm:inline">{activeCourses.length === 1 ? 'Course' : 'Courses'}</span></span>
                        </div>

                        {/* Separate Credits button */}
                        <div className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-[2px] bg-black border border-[#525252] text-[#8a8a8a] hover:text-[#d4d4d4] hover:border-[#737373] hover:bg-white/[0.04] font-semibold text-xs tracking-wide uppercase shadow-sm transition-all duration-150 ease-in-out select-none shrink-0" title="Total Credits">
                            <Clock size={13} />
                            <span>{totalCredits} <span className="hidden sm:inline">Credits</span><span className="sm:hidden">Cr</span></span>
                        </div>

                        {/* Compare button */}
                        {timetables.length > 1 && (
                            <button
                                type="button"
                                onClick={() => {
                                    const other = timetables.find(t => t.id !== activeTimetableId);
                                    if (other) setCompareTargetId(other.id);
                                    setCompareModalOpen(true);
                                }}
                                className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-[2px] bg-black border border-[#525252] text-[#8a8a8a] hover:text-white hover:border-[#a3a3a3] hover:bg-white/[0.08] active:bg-white/[0.15] hover:shadow-[0_0_8px_rgba(255,255,255,0.12)] font-semibold text-xs tracking-wide uppercase transition-all duration-150 ease-in-out cursor-pointer shrink-0"
                                title="Compare Timetables"
                                aria-label="Compare Timetables"
                            >
                                <Eye size={13} />
                                <span className="hidden sm:inline">Compare Timetables</span>
                            </button>
                        )}

                        {/* Add Course button */}
                        <button
                            type="button"
                            onClick={handleOpenAddModalManual}
                            className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-[2px] bg-black border border-[#525252] text-[#8a8a8a] hover:text-white hover:border-[#a3a3a3] hover:bg-white/[0.08] active:bg-white/[0.15] hover:shadow-[0_0_8px_rgba(255,255,255,0.12)] font-semibold text-xs tracking-wide uppercase transition-all duration-150 ease-in-out cursor-pointer shrink-0"
                            title="Add Course"
                            aria-label="Add Course"
                        >
                            <Plus size={14} />
                            <span className="hidden sm:inline">Add Course</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Timetable Matrix: Translucent 75% black background with spiky corners (rounded-[2px]) */}
            <div className="w-full overflow-x-auto rounded-[2px] border border-white/15 shadow-2xl bg-black/75 backdrop-blur-md">
                <table className="w-full border-collapse text-left min-w-[1080px] select-none">
                    <thead>
                        {/* Row 1: Theory Hours Header */}
                        <tr className="border-b border-white/15 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-950/40 text-[11px]">
                            <th className="p-2 border-r border-white/15 font-bold text-gray-300 text-center w-16 uppercase tracking-wider bg-black/40">
                                THEORY<br />HOURS
                            </th>
                            {/* Morning Theory 5 hours */}
                            {MORNING_THEORY_HOURS.map((h, i) => (
                                <th key={`m-th-${i}`} className="p-2 border-r border-white/10 text-center  text-purple-200/90 whitespace-pre-line leading-tight">
                                    {h.start}<br /><span className="text-gray-500 text-[9px]">to</span><br />{h.end}
                                </th>
                            ))}
                            {/* 6th lab period in morning: no theory lecture */}
                            <th className="p-2 border-r border-white/10 text-center text-gray-600  text-[10px] bg-black/40">
                                —
                            </th>
                            {/* Lunch Column Header after previous lab ends (after morning 6th lab 01:20 PM) */}
                            <th rowSpan={2} className="p-1 border-r border-white/15 bg-neutral-900/80 text-center text-xs font-bold tracking-widest text-gray-400 w-10">
                                <div className="flex flex-col items-center justify-center py-2 space-y-1  text-[11px] text-amber-400/80">
                                    <span>L</span><span>U</span><span>N</span><span>C</span><span>H</span>
                                </div>
                            </th>
                            {/* Afternoon Theory 5 hours */}
                            {AFTERNOON_THEORY_HOURS.map((h, i) => (
                                <th key={`a-th-${i}`} className="p-2 border-r border-white/10 text-center  text-purple-200/90 whitespace-pre-line leading-tight">
                                    {h.start}<br /><span className="text-gray-500 text-[9px]">to</span><br />{h.end}
                                </th>
                            ))}
                            {/* Evening 6th lab hour theory empty cell */}
                            <th className="p-2 border-r border-white/15 text-center text-gray-600  text-[10px] bg-black/40">
                                —
                            </th>
                        </tr>

                        {/* Row 2: Lab Hours Header */}
                        <tr className="border-b border-white/15 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-cyan-950/40 text-[11px]">
                            <th className="p-2 border-r border-white/15 font-bold text-gray-300 text-center uppercase tracking-wider bg-black/40">
                                LAB<br />HOURS
                            </th>
                            {/* Morning Lab 6 hours */}
                            {MORNING_LAB_HOURS.map((h, i) => (
                                <th key={`m-lh-${i}`} className="p-2 border-r border-white/10 text-center  text-cyan-200/90 whitespace-pre-line leading-tight">
                                    {h.start}<br /><span className="text-gray-500 text-[9px]">to</span><br />{h.end}
                                </th>
                            ))}
                            {/* Afternoon Lab 6 hours */}
                            {AFTERNOON_LAB_HOURS.map((h, i) => (
                                <th key={`a-lh-${i}`} className="p-2 border-r border-white/10 text-center  text-cyan-200/90 whitespace-pre-line leading-tight">
                                    {h.start}<br /><span className="text-gray-500 text-[9px]">to</span><br />{h.end}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10 text-xs">
                        {TIMETABLE_GRID.map((row) => (
                            <tr key={row.day} className="hover:bg-white/[0.02] transition-colors">
                                {/* Day Label */}
                                <td className="p-3 border-r border-white/15 font-bold text-white text-center  text-sm bg-black/60 tracking-wider">
                                    {row.day}
                                </td>

                                {/* Morning Slots (cols 0 to 5) - all 6 morning periods */}
                                {row.slots.filter(s => s.session === 'morning').map((cell) => {
                                    if (cell.isExtramural) {
                                        return (
                                            <td
                                                key={`${row.day}-${cell.col}`}
                                                colSpan={cell.colSpan || 2}
                                                className="p-2.5 text-center border-r border-white/10 bg-[#3b2318]/40 text-amber-300/90 font-semibold italic text-xs tracking-wider border-dashed border-amber-600/30"
                                            >
                                                Extramural
                                            </td>
                                        );
                                    }

                                    const key = `${row.day}-${cell.col}`;
                                    const occupied = cellOccupancy[key];
                                    const isBooked = Boolean(occupied);

                                    return (
                                        <td
                                            key={`${row.day}-${cell.col}`}
                                            onClick={() => handleCellClick(row.day, cell.col, cell)}
                                            className={`p-2 border-r border-white/10 text-center transition-all duration-200 cursor-pointer relative group ${
                                                isBooked 
                                                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-100 hover:bg-emerald-900/80 shadow-inner' 
                                                    : 'bg-[#2a1d17]/30 hover:bg-[#3d2a20]/50 text-gray-200 hover:text-white'
                                            }`}
                                        >
                                            {isBooked ? (
                                                <div className="flex flex-col items-center justify-center py-0.5 space-y-0.5">
                                                    <span className="font-bold text-xs text-white tracking-tight line-clamp-1" title={occupied.course.name || occupied.course.code}>
                                                        {occupied.course.name || occupied.course.code}
                                                    </span>
                                                    {occupied.course.name && occupied.course.code && (
                                                        <span className="text-[9px]  text-gray-300 line-clamp-1 leading-none">
                                                            {occupied.course.code}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px]  text-emerald-300 bg-emerald-950/90 px-1.5 py-0.2 rounded-[2px] border border-emerald-500/40">
                                                        {occupied.slot}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-0.5 space-y-0.5">
                                                    <span className="font-bold text-xs text-white/90">
                                                        {cell.theorySlot || '—'}
                                                    </span>
                                                    <span className="text-[10px]  text-[#d6b49c] group-hover:text-amber-200 transition-colors">
                                                        {cell.labSlot}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}

                                {/* Lunch Divider Column - exactly after previous lab ends (after 6th lab L6, L12, L18, L24, L30) */}
                                <td className="p-1 border-r border-white/15 bg-neutral-900/60 text-center text-gray-600  text-xs">
                                    •
                                </td>

                                {/* Afternoon Slots (cols 6 to 11) */}
                                {row.slots.filter(s => s.session === 'afternoon').map((cell) => {
                                    const key = `${row.day}-${cell.col}`;
                                    const occupied = cellOccupancy[key];
                                    const isBooked = Boolean(occupied);

                                    return (
                                        <td
                                            key={`${row.day}-${cell.col}`}
                                            onClick={() => handleCellClick(row.day, cell.col, cell)}
                                            className={`p-2 border-r border-white/10 text-center transition-all duration-200 cursor-pointer relative group ${
                                                isBooked 
                                                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-100 hover:bg-emerald-900/80 shadow-inner' 
                                                    : 'bg-[#2a1d17]/30 hover:bg-[#3d2a20]/50 text-gray-200 hover:text-white'
                                            }`}
                                        >
                                            {isBooked ? (
                                                <div className="flex flex-col items-center justify-center py-0.5 space-y-0.5">
                                                    <span className="font-bold text-xs text-white tracking-tight line-clamp-1" title={occupied.course.name || occupied.course.code}>
                                                        {occupied.course.name || occupied.course.code}
                                                    </span>
                                                    {occupied.course.name && occupied.course.code && (
                                                        <span className="text-[9px]  text-gray-300 line-clamp-1 leading-none">
                                                            {occupied.course.code}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px]  text-emerald-300 bg-emerald-950/90 px-1.5 py-0.2 rounded-[2px] border border-emerald-500/40">
                                                        {occupied.slot}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-0.5 space-y-0.5">
                                                    <span className="font-bold text-xs text-white/90">
                                                        {cell.theorySlot || '—'}
                                                    </span>
                                                    <span className="text-[10px]  text-[#d6b49c] group-hover:text-amber-200 transition-colors">
                                                        {cell.labSlot}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Enrolled Courses Drawer / List */}
            <div className="mt-8 bg-black/75 border border-white/10 rounded-[2px] p-5 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-white" />
                        <h3 className="text-base font-bold text-white tracking-tight">
                            Enrolled Courses ({activeCourses.length})
                        </h3>
                    </div>
                    <span className="text-xs text-gray-400 ">Total Credits: {totalCredits}</span>
                </div>

                {activeCourses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No courses added to this timetable yet. Click any slot in the timetable above to add a course.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {activeCourses.map((c) => (
                            <div 
                                key={c.id} 
                                className="bg-black/80 border border-white/10 hover:border-emerald-500/50 p-3.5 rounded-[2px] flex flex-col justify-between transition-colors shadow-sm relative group"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                        <h4 className="font-semibold text-sm text-white line-clamp-1">{c.name}</h4>
                                        <span className="px-2 py-0.5 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300  text-[11px] rounded-[2px] shrink-0">
                                            {c.slot}
                                        </span>
                                    </div>
                                    {c.code && (
                                        <span className="text-xs  text-gray-400 block mb-1">
                                            {c.code}
                                        </span>
                                    )}
                                    {Array.isArray(c.teachers) && c.teachers.length > 0 && (
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                            <User size={13} className="shrink-0 text-gray-500" />
                                            <span className="line-clamp-1">{c.teachers.join(', ')}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-xs text-gray-400">
                                    <span>{c.credits} Credits</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingCourseId(c.id);
                                                setFormData({
                                                    code: c.code || '',
                                                    name: c.name || '',
                                                    slot: c.slot || '',
                                                    credits: c.credits || '3',
                                                    teachers: c.teachers?.length ? [...c.teachers] : ['']
                                                });
                                                setModalSlotOptions(allSelectableSlots.theory.slice(0, 8).map(s => ({ value: s, label: s, type: 'Theory' })));
                                                setFormErrors({});
                                                setModalMode('edit');
                                                setModalOpen(true);
                                            }}
                                            className="text-gray-400 hover:text-white p-1"
                                            title="Edit course"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteCourse(c.id)}
                                            className="text-gray-400 hover:text-red-400 p-1"
                                            title="Delete course"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Course Modal (Add / Edit / Inspect) */}
            <AnimatePresence>
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 5 }}
                            className="bg-neutral-950 border border-white/20 rounded-[4px] w-full max-w-lg overflow-hidden shadow-2xl relative"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/[0.02]">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-[2px] bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                        <Calendar size={16} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-base">
                                            {modalMode === 'inspect' ? 'Course Details' : modalMode === 'edit' ? 'Edit Course' : 'Add Course'}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            {modalMode === 'inspect' ? 'View or delete this enrolled course combination' : 'Configure slot and teachers'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="p-1 text-gray-400 hover:text-white rounded-[2px] hover:bg-white/10 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSaveCourse} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                                {/* Course Name */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Course Title / Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g. Operating Systems"
                                        className="w-full bg-black/70 border border-white/20 rounded-[2px] px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                                    />
                                    {formErrors.name && (
                                        <span className="text-xs text-red-400 mt-1 block">{formErrors.name}</span>
                                    )}
                                </div>

                                {/* Course Code & Credits */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            Course Code
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                            placeholder="e.g. CSE2005"
                                            className="w-full bg-black/70 border border-white/20 rounded-[2px] px-3 py-2 text-sm text-white placeholder-gray-500 uppercase focus:outline-none focus:border-white transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">
                                            Credits
                                        </label>
                                        <div className="grid grid-cols-4 gap-1.5 h-[38px]">
                                            {['1', '2', '3', '4'].map((cr) => {
                                                const isSelected = String(formData.credits) === cr;
                                                return (
                                                    <button
                                                        key={cr}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, credits: cr }))}
                                                        className={`flex items-center justify-center rounded-[2px] text-xs  font-bold transition-all duration-150 ease-in-out cursor-pointer ${
                                                            isSelected
                                                                ? 'bg-emerald-950/90 border border-emerald-500 text-emerald-200 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                                                                : 'bg-black border border-[#525252] text-[#8a8a8a] hover:text-white hover:border-[#a3a3a3] hover:bg-white/[0.08] active:bg-white/[0.15]'
                                                        }`}
                                                    >
                                                        {cr}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Slot Selection */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Slot / Slot Combination <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slot}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slot: e.target.value.toUpperCase() }))}
                                        placeholder="e.g. C1+TC1+TCC1 or L13+L14"
                                        className="w-full bg-black/70 border border-white/20 rounded-[2px] px-3.5 py-2 text-sm text-white  uppercase placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                                    />
                                    
                                    {/* Slot suggestions specifically for the clicked cell */}
                                    <div className="mt-2.5">
                                        <span className="text-[11px] text-gray-400 block mb-1.5 font-medium">
                                            {modalSlotOptions.length > 0 ? 'Combinations for this slot:' : 'Available Slot Combinations:'}
                                        </span>
                                        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                                            {(modalSlotOptions.length > 0 ? modalSlotOptions : allSelectableSlots.theory.slice(0, 10).map(s => ({ value: s, label: s, type: 'Theory' }))).map(opt => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ 
                                                        ...prev, 
                                                        slot: opt.value,
                                                        credits: opt.type === 'Lab' ? '1' : prev.credits
                                                    }))}
                                                    className={`px-2.5 py-1 rounded-[2px] text-xs  border transition-colors cursor-pointer ${
                                                        formData.slot === opt.value 
                                                            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-bold shadow-sm' 
                                                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {formErrors.slot && (
                                        <div className="flex items-center gap-1.5 text-xs text-red-400 mt-2 bg-red-950/40 border border-red-500/30 p-2 rounded-[2px]">
                                            <AlertTriangle size={14} className="shrink-0" />
                                            <span>{formErrors.slot}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Multiple Teachers */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-medium text-gray-300">
                                            Teacher / Faculty Options
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddTeacherField}
                                            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium cursor-pointer"
                                        >
                                            <Plus size={13} />
                                            <span>Add Teacher</span>
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.teachers.map((t, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                                    <input
                                                        type="text"
                                                        value={t}
                                                        onChange={(e) => handleTeacherChange(idx, e.target.value)}
                                                        placeholder={`Faculty name ${idx + 1}`}
                                                        className="w-full bg-black/70 border border-white/20 rounded-[2px] pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                                                    />
                                                </div>
                                                {formData.teachers.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveTeacherField(idx)}
                                                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                                                        title="Remove faculty"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Modal Actions */}
                                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                                    {editingCourseId ? (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteCourse(editingCourseId)}
                                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-950/70 border border-red-500/40 text-red-300 hover:bg-red-900 rounded-[2px] text-xs font-medium transition-colors cursor-pointer"
                                        >
                                            <Trash2 size={14} />
                                            <span>Delete Course</span>
                                        </button>
                                    ) : (
                                        <div />
                                    )}

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setModalOpen(false)}
                                            className="px-4 py-2 border border-white/15 hover:bg-white/10 text-gray-300 rounded-[2px] text-xs font-medium transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2 bg-white text-black font-semibold rounded-[2px] text-xs tracking-wide uppercase hover:bg-gray-200 transition-colors cursor-pointer shadow-md"
                                        >
                                            {editingCourseId ? 'Save Changes' : 'Enroll Course'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Timetable Comparison Modal */}
            <AnimatePresence>
                {compareModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="bg-neutral-950 border border-white/20 rounded-[4px] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
                        >
                            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <Eye size={18} className="text-white" />
                                    <h3 className="font-bold text-white text-base">Compare Timetables</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCompareModalOpen(false)}
                                    className="p-1 text-gray-400 hover:text-white rounded-[2px] hover:bg-white/10 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-5 overflow-y-auto space-y-6">
                                <div className="flex items-center gap-4 bg-black/60 p-4 rounded-[2px] border border-white/10">
                                    <div className="flex-1">
                                        <span className="text-xs text-gray-400 block mb-1">Active Timetable:</span>
                                        <span className="font-bold text-sm text-white">{activeTimetable.name}</span>
                                        <span className="text-xs text-emerald-400 block  mt-0.5">
                                            {activeCourses.length} Courses • {totalCredits} Credits
                                        </span>
                                    </div>
                                    <span className="text-gray-500  text-sm">VS</span>
                                    <div className="flex-1">
                                        <span className="text-xs text-gray-400 block mb-1">Compare With:</span>
                                        <select
                                            value={compareTargetId}
                                            onChange={(e) => setCompareTargetId(e.target.value)}
                                            className="bg-black border border-white/20 text-white rounded-[2px] px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-white cursor-pointer w-full"
                                        >
                                            {timetables.filter(t => t.id !== activeTimetableId).map(t => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name} ({t.courses?.length || 0} courses)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Comparison Details */}
                                {(() => {
                                    const targetTt = timetables.find(t => t.id === compareTargetId);
                                    if (!targetTt) return null;
                                    const targetCourses = targetTt.courses || [];
                                    const targetCredits = targetCourses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);

                                    // Identify common combinations vs distinct courses
                                    // Normalize slots for matching (e.g. A1+TA1+TAA1)
                                    const activeSlotsMap = new Map();
                                    activeCourses.forEach(c => {
                                        const key = (c.slot || '').trim().toUpperCase();
                                        if (key) activeSlotsMap.set(key, c);
                                    });

                                    const targetSlotsMap = new Map();
                                    targetCourses.forEach(c => {
                                        const key = (c.slot || '').trim().toUpperCase();
                                        if (key) targetSlotsMap.set(key, c);
                                    });

                                    const commonSlots = [];
                                    activeSlotsMap.forEach((activeCourse, slot) => {
                                        if (targetSlotsMap.has(slot)) {
                                            commonSlots.push({
                                                slot,
                                                activeCourse,
                                                targetCourse: targetSlotsMap.get(slot)
                                            });
                                        }
                                    });

                                    const activeOnlyCourses = activeCourses.filter(c => {
                                        const key = (c.slot || '').trim().toUpperCase();
                                        return !targetSlotsMap.has(key);
                                    });

                                    const targetOnlyCourses = targetCourses.filter(c => {
                                        const key = (c.slot || '').trim().toUpperCase();
                                        return !activeSlotsMap.has(key);
                                    });

                                    return (
                                        <div className="space-y-6">
                                            {/* Section 1: Similar / Shared Slot Combinations */}
                                            <div className="border border-white/10 bg-black/40 rounded-[2px] p-4">
                                                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-emerald-400 rounded-none"></span>
                                                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                                                            Shared Slot Combinations ({commonSlots.length})
                                                        </h4>
                                                    </div>
                                                    <span className="text-[11px] text-gray-400 ">Both timetables share these slots</span>
                                                </div>

                                                {commonSlots.length === 0 ? (
                                                    <div className="py-4 text-center text-xs text-gray-500 ">
                                                        No overlapping slot combinations found between these two timetables.
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {commonSlots.map(({ slot, activeCourse, targetCourse }) => (
                                                            <div key={slot} className="border border-white/10 bg-black/60 rounded-[2px] p-3 text-xs">
                                                                <div className="inline-block mb-2 px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300  text-[11px] font-bold rounded-[2px]">
                                                                    Slot: {slot}
                                                                </div>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/5">
                                                                    {/* Active TT Course & Faculty */}
                                                                    <div className="bg-neutral-900/60 p-2.5 border-l-2 border-emerald-500 rounded-[2px]">
                                                                        <span className="text-[10px] text-gray-400  block uppercase">{activeTimetable.name}</span>
                                                                        <div className="font-bold text-white text-xs mt-0.5">{activeCourse.name || activeCourse.code}</div>
                                                                        {activeCourse.code && activeCourse.name && (
                                                                            <span className="text-[10px] text-gray-400  block">{activeCourse.code}</span>
                                                                        )}
                                                                        <div className="mt-1.5 text-[11px] text-gray-300">
                                                                            <span className="text-gray-500 font-medium">Faculty: </span>
                                                                            <span>{activeCourse.teachers?.filter(Boolean).join(', ') || 'Not specified'}</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Target TT Course & Faculty */}
                                                                    <div className="bg-neutral-900/60 p-2.5 border-l-2 border-cyan-500 rounded-[2px]">
                                                                        <span className="text-[10px] text-gray-400  block uppercase">{targetTt.name}</span>
                                                                        <div className="font-bold text-white text-xs mt-0.5">{targetCourse.name || targetCourse.code}</div>
                                                                        {targetCourse.code && targetCourse.name && (
                                                                            <span className="text-[10px] text-gray-400  block">{targetCourse.code}</span>
                                                                        )}
                                                                        <div className="mt-1.5 text-[11px] text-gray-300">
                                                                            <span className="text-gray-500 font-medium">Faculty: </span>
                                                                            <span>{targetCourse.teachers?.filter(Boolean).join(', ') || 'Not specified'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Section 2: Distinct / Uncommon Courses */}
                                            <div className="border border-white/10 bg-black/40 rounded-[2px] p-4">
                                                <div className="pb-2.5 mb-3 border-b border-white/10">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                                                        Distinct & Unique Courses
                                                    </h4>
                                                    <span className="text-[11px] text-gray-400 ">Courses taken uniquely in either timetable</span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Active Timetable Unique Courses */}
                                                    <div className="border border-white/10 bg-black/60 rounded-[2px] p-3">
                                                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
                                                            <span className="font-bold text-xs text-white">{activeTimetable.name} Only</span>
                                                            <span className="text-[10px]  text-gray-400">{activeOnlyCourses.length} unique</span>
                                                        </div>
                                                        {activeOnlyCourses.length === 0 ? (
                                                            <div className="py-4 text-center text-xs text-gray-500 ">No unique courses</div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {activeOnlyCourses.map(c => (
                                                                    <div key={c.id} className="p-2.5 bg-neutral-900/60 border border-white/5 rounded-[2px] text-xs">
                                                                        <div className="flex items-start justify-between gap-1">
                                                                            <span className="font-semibold text-white line-clamp-1">{c.name || c.code}</span>
                                                                            <span className="px-1.5 py-0.2 bg-white/10  text-[10px] text-emerald-300 rounded-[2px] shrink-0 border border-white/10">{c.slot}</span>
                                                                        </div>
                                                                        {c.code && c.name && <span className="text-[10px] text-gray-400  block mt-0.5">{c.code}</span>}
                                                                        <div className="mt-1 text-[11px] text-gray-400">
                                                                            <span className="text-gray-500">Faculty: </span>
                                                                            <span>{c.teachers?.filter(Boolean).join(', ') || 'Not specified'}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Target Timetable Unique Courses */}
                                                    <div className="border border-white/10 bg-black/60 rounded-[2px] p-3">
                                                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
                                                            <span className="font-bold text-xs text-white">{targetTt.name} Only</span>
                                                            <span className="text-[10px]  text-gray-400">{targetOnlyCourses.length} unique</span>
                                                        </div>
                                                        {targetOnlyCourses.length === 0 ? (
                                                            <div className="py-4 text-center text-xs text-gray-500 ">No unique courses</div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {targetOnlyCourses.map(c => (
                                                                    <div key={c.id} className="p-2.5 bg-neutral-900/60 border border-white/5 rounded-[2px] text-xs">
                                                                        <div className="flex items-start justify-between gap-1">
                                                                            <span className="font-semibold text-white line-clamp-1">{c.name || c.code}</span>
                                                                            <span className="px-1.5 py-0.2 bg-white/10  text-[10px] text-cyan-300 rounded-[2px] shrink-0 border border-white/10">{c.slot}</span>
                                                                        </div>
                                                                        {c.code && c.name && <span className="text-[10px] text-gray-400  block mt-0.5">{c.code}</span>}
                                                                        <div className="mt-1 text-[11px] text-gray-400">
                                                                            <span className="text-gray-500">Faculty: </span>
                                                                            <span>{c.teachers?.filter(Boolean).join(', ') || 'Not specified'}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FFCSPlanner;
