import React from 'react';
import { Eye, EyeOff, Copy } from 'lucide-react';

const inputClass = 'w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-colors duration-200 bg-muted text-foreground';

interface StudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentData: any;
    setStudentData: (data: any) => void;
    onSubmit: () => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    copyToClipboard: (text: string) => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
    isOpen,
    onClose,
    studentData,
    setStudentData,
    onSubmit,
    showPassword,
    setShowPassword,
    copyToClipboard
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="max-w-2xl w-full mx-4 p-6 rounded-xl shadow-lg bg-card transition-colors duration-200">
                <h3 className="text-lg font-bold mb-4 text-foreground transition-colors duration-200">
                    Add New Student
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={studentData.name}
                            onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Email
                        </label>
                        <input
                            type="email"
                            value={studentData.email}
                            onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={studentData.phone}
                            onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={studentData.password}
                                readOnly
                                className={`${inputClass} pr-20`}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-1 text-muted-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(studentData.password)}
                                    className="p-1 ml-1 text-muted-foreground"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Institute
                        </label>
                        <input
                            type="text"
                            value={studentData.institute}
                            onChange={(e) => setStudentData({ ...studentData, institute: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground transition-colors duration-200">
                            Year
                        </label>
                        <select
                            value={studentData.year}
                            onChange={(e) => setStudentData({ ...studentData, year: e.target.value })}
                            className={inputClass}
                        >
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="5th Year">5th Year</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onSubmit}
                        className="flex-1 py-2 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
                    >
                        Add Student
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors bg-muted hover:bg-accent text-muted-foreground"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
