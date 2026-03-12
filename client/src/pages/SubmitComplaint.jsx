import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../services/api';
import {
    FileText,
    MapPin,
    Tag,
    Image as ImageIcon,
    CheckCircle,
    AlertTriangle,
    Send,
    Loader2,
    Target,
    X,
    Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubmitComplaint = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Roads',
        location: '',
        latitude: '',
        longitude: '',
        priority: 'Medium'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [locating, setLocating] = useState(false);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const categories = ['Roads', 'Garbage', 'Water Supply', 'Electricity', 'Street Lights', 'Public Safety', 'Others'];
    const priorities = [
        { name: 'Low', color: 'bg-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
        { name: 'Medium', color: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
        { name: 'High', color: 'bg-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
        { name: 'Emergency', color: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' }
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getCurrentLocation = () => {
        setLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        latitude: position.coords.latitude.toFixed(6),
                        longitude: position.coords.longitude.toFixed(6)
                    });
                    setLocating(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not get your location. Please enter it manually.");
                    setLocating(false);
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
            setLocating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('location', formData.location);
        data.append('latitude', formData.latitude);
        data.append('longitude', formData.longitude);
        data.append('priority', formData.priority);
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            await createComplaint(data);
            setSuccess(true);
            setTimeout(() => navigate('/citizen/dashboard'), 2500);
        } catch (err) {
            console.error('Submission Error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to submit complaint. Please check your connection.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center"
            >
                <div className="w-24 h-24 bg-accent/20 text-accent rounded-full flex items-center justify-center mb-8 relative">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                        <CheckCircle size={56} />
                    </motion.div>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-accent/10 -z-10"
                    />
                </div>
                <h2 className="text-4xl font-extrabold mb-4 text-slate-900 dark:text-white">Grievance Registered!</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg font-medium leading-relaxed">
                    Your complaint has been successfully submitted to the Smart City Command Center. You will receive real-time updates on your dashboard.
                </p>
                <div className="mt-8 flex items-center gap-2 text-primary font-bold">
                    <Loader2 className="animate-spin" size={18} />
                    Redirecting to portal...
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Grievance Redressal
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white">Record New Issue</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Provide detailed information to help our departments act quickly.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="card-premium space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white mb-4">
                                <FileText size={20} className="text-primary" />
                                Core Ticket Details
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Issue Summary</label>
                                    <input
                                        type="text"
                                        className="input-premium"
                                        placeholder="e.g., Massive pothole near central park..."
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Service Department</label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <select
                                                className="input-premium pl-12 appearance-none bg-surface"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Priority Level</label>
                                        <div className="flex gap-2">
                                            {priorities.map((p) => (
                                                <button
                                                    key={p.name}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, priority: p.name })}
                                                    className={`
                                                        flex-1 py-3 rounded-xl border-2 transition-all duration-200 text-xs font-bold
                                                        ${formData.priority === p.name
                                                            ? `border-primary ${p.bg} ${p.text}`
                                                            : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-primary/30'}
                                                    `}
                                                >
                                                    {p.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-premium space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white mb-4">
                                <MapPin size={20} className="text-primary" />
                                Location & Context
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Incident Location Address</label>
                                    <input
                                        type="text"
                                        className="input-premium"
                                        placeholder="Sector 14, Main Crossroad..."
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Latitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            className="input-premium"
                                            placeholder="e.g., 28.6139"
                                            value={formData.latitude}
                                            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Longitude</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                step="any"
                                                className="input-premium flex-1"
                                                placeholder="e.g., 77.2090"
                                                value={formData.longitude}
                                                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                onClick={getCurrentLocation}
                                                disabled={locating}
                                                className="btn btn-secondary aspect-square p-0 w-12 flex items-center justify-center shrink-0"
                                                title="Get Current Location"
                                            >
                                                {locating ? <Loader2 size={18} className="animate-spin" /> : <Target size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Full Description</label>
                                    <textarea
                                        className="input-premium min-h-[120px] resize-none"
                                        placeholder="Include landmarks or specific details that will help our officers find the issue..."
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn btn-ghost px-8"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary px-12 py-4 text-lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Transmitting...
                                    </>
                                ) : (
                                    <>
                                        Register Grievance
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="card-premium space-y-4">
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Visual Evidence</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-video rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 group cursor-pointer hover:border-primary/50 transition-colors overflow-hidden relative"
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                                        <Upload size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Upload Image</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">PNG, JPG up to 10MB</p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <p className="text-[10px] text-slate-400 text-center">Images help officers identify the issue faster and verify the resolution.</p>
                    </div>

                    <div className="card-premium">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4">Submission Terms</h4>
                        <ul className="space-y-4">
                            {[
                                'Ensure accurate location details.',
                                'Fake reports may lead to penalties.',
                                'Officers may contact you for details.'
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-500 font-medium">
                                    <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitComplaint;
