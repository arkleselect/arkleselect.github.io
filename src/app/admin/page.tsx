'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    FiSave,
    FiTerminal,
    FiImage,
    FiEdit3,
    FiLock,
    FiAlertTriangle,
    FiHome,
    FiLogOut,
    FiCheck,
    FiPlus,
    FiList,
    FiTrash2,
    FiChevronRight,
    FiMessageSquare,
    FiCornerUpLeft
} from "react-icons/fi";



import { CustomAlertDialog } from "@/components/ui/custom-alert";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AdminType = 'post' | 'daily' | 'moment' | 'comment';


type PostData = {
    title: string;
    date: string;
    description: string;
    content: string;
    slug: string;
    category: string;
};

type DailyData = {
    date: string;
    imageUrl: string;
    content: string;
};

type MomentData = {
    title: string;
    date: string;
    imageUrl: string;
    content: string;
};

type AdminItem = {
    filename: string;
    date: string;
    title?: string;
    description?: string;
    content?: string;
    slug?: string;
    imageUrl?: string;
    category?: string;
    nickname?: string;
    contact?: string;
    articleTitle?: string;
};



type StatusMessage = { text: string; isError: boolean };

export default function AdminPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [type, setType] = useState<AdminType>('post');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<StatusMessage | null>(null);

    // Form states
    const today = new Date().toISOString().split('T')[0];
    const defaultSlug = today.replace(/-/g, '').slice(2); // YYMMDD

    const [postData, setPostData] = useState<PostData>({ title: '', date: today, description: '', content: '', slug: defaultSlug, category: '' });
    const [isSlugModified, setIsSlugModified] = useState(false);
    const [dailyData, setDailyData] = useState<DailyData>({ date: today, imageUrl: '', content: '' });
    const [momentData, setMomentData] = useState<MomentData>({ title: '', date: today, imageUrl: '', content: '' });
    const [existingPosts, setExistingPosts] = useState<AdminItem[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFilename, setCurrentFilename] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'edit' | 'list'>('edit');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Delete Confirmation State
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: AdminType; filename: string } | null>(null);

    // Helper to format date to slug
    const dateToSlug = (dateStr: string) => {
        return dateStr.replace(/-/g, '').slice(2);
    };

    // Handle Authentication
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setAuthError(false);

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                setIsAuthorized(true);
                localStorage.setItem('admin_key', password);
                fetchPosts(password);
            } else {
                setAuthError(true);
                setPassword('');
            }
        } catch (_error) {
            setAuthError(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchPosts = useCallback(async (token?: string) => {
        try {
            const adminKey = token || localStorage.getItem('admin_key') || '';
            const res = await fetch(`/api/admin/list?type=${type}`, {
                headers: { 'Authorization': adminKey }
            });
            if (res.ok) {
                const data = await res.json() as { items: AdminItem[] };
                setExistingPosts(data.items || []);
            } else {
                if (res.status === 401) setIsAuthorized(false);
            }
        } catch (error) {
            console.error('Failed to fetch posts', error);
        }
    }, [type]);

    useEffect(() => {
        const key = localStorage.getItem('admin_key');
        if (key) {
            setIsAuthorized(true);
            fetchPosts(key);
        }
        setCheckingAuth(false);
    }, [fetchPosts]);

    useEffect(() => {
        if (viewMode === 'list' && isAuthorized) {
            fetchPosts();
        }
    }, [viewMode, isAuthorized, fetchPosts]);

    const handleEditPost = (item: AdminItem) => {
        if (type === 'post') {
            setPostData({
                title: item.title || '',
                date: item.date,
                description: item.description || '',
                content: item.content || '',
                slug: item.slug || defaultSlug,
                category: item.category || ''
            });
        } else if (type === 'daily') {
            setDailyData({
                date: item.date,
                content: item.content || '',
                imageUrl: item.imageUrl || ''
            });
        } else if (type === 'moment') {
            setMomentData({
                title: item.title || '',
                date: item.date,
                imageUrl: item.imageUrl || '',
                content: item.content || ''
            });
        }

        setCurrentFilename(item.filename);
        setIsEditing(true);
        setViewMode('edit');
    };

    const handleNewPost = () => {
        setPostData({ title: '', date: today, description: '', content: '', slug: defaultSlug, category: '' });
        setIsSlugModified(false);
        setIsEditing(false);
        setCurrentFilename(null);
        setViewMode('edit');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        let data: any = {};
        if (type === 'post') {
            data = { ...postData, filename: currentFilename };
        }
        else if (type === 'daily') data = dailyData;
        else if (type === 'moment') data = momentData;

        try {
            const adminKey = localStorage.getItem('admin_key') || '';
            const res = await fetch('/api/admin/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': adminKey
                },
                body: JSON.stringify({ type, data }),
            });

            if (res.status === 401) {
                localStorage.removeItem('admin_key');
                setIsAuthorized(false);
                setMessage({ text: 'PERMISSION_DENIED: AUTH_EXPIRED', isError: true });
                return;
            }

            const result = await res.json() as { success?: boolean; error?: string };
            if (result.success) {
                setMessage({ text: `SUCCESS: ${type.toUpperCase()} SAVED`, isError: false });
                if (type === 'post') {
                    handleNewPost();
                    fetchPosts();
                }
                else if (type === 'daily') setDailyData({ date: today, imageUrl: '', content: '' });
                else if (type === 'moment') setMomentData({ title: '', date: today, imageUrl: '', content: '' });

                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ text: `ERROR: ${result.error}`, isError: true });
            }
        } catch (error) {
            setMessage({ text: 'NETWORK ERROR: CONNECTION LOST', isError: true });
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e: React.MouseEvent, item: AdminItem) => {
        e.stopPropagation();
        const reply = window.prompt(`Reply to @${item.nickname}:`);
        if (!reply) return;

        const parentId = `${(item as any).created_at}-${item.nickname}`;

        setLoading(true);
        try {
            const adminKey = localStorage.getItem('admin_key') || '';
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug: item.slug,
                    nickname: 'Admin',
                    content: reply,
                    parent_id: parentId,
                    adminPassword: adminKey
                }),
            });
            if (res.ok) {
                setMessage({ text: 'SUCCESS: REPLY_SENT', isError: false });
                fetchPosts();
            } else {
                setMessage({ text: 'ERROR: FAILED_TO_REPLY', isError: true });
            }
        } catch (error) {
            console.error('Reply error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (e: React.MouseEvent, targetType: AdminType, filename: string) => {
        e.stopPropagation();
        setDeleteTarget({ type: targetType, filename });
        setDeleteConfirmOpen(true);
    };


    const confirmDelete = async () => {
        if (!deleteTarget) return;

        setLoading(true);
        setMessage(null);

        try {
            const adminKey = localStorage.getItem('admin_key') || '';
            const res = await fetch('/api/admin/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': adminKey
                },
                body: JSON.stringify({
                    type: deleteTarget.type,
                    filename: deleteTarget.filename
                })
            });

            if (res.ok) {
                setExistingPosts(prev => prev.filter(p => p.filename !== deleteTarget.filename));
                setMessage({ text: 'SUCCESS: ITEM_DELETED', isError: false });
                setDeleteConfirmOpen(false);
                setDeleteTarget(null);
            } else {
                const err = await res.json() as { error?: string };
                setMessage({ text: `ERROR: ${err.error || 'Failed to delete'}`, isError: true });
            }
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">Checking access...</div>;
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 selection:bg-white selection:text-black font-sans">
                <Card className="w-full max-w-[320px] border-neutral-800 bg-neutral-900/50 shadow-2xl">
                    <CardHeader className="space-y-1 text-center pb-2 pt-6">
                        <div className="flex justify-center mb-3">
                            <div className="h-8 w-8 rounded-full border border-neutral-800 flex items-center justify-center bg-neutral-950 shadow-inner">
                                <FiLock className="text-neutral-500 w-3 h-3" />
                            </div>
                        </div>
                        <CardTitle className="text-sm font-semibold tracking-tight text-white uppercase">Console Access</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 space-y-4">
                        <form onSubmit={handleLogin} className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="password" title="Security_Key" className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
                                    Security_Key
                                </Label>
                                <Input
                                    id="password"
                                    autoFocus
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`bg-neutral-950 border-neutral-800 text-center tracking-[0.4em] focus:border-white/20 transition-all h-9 text-xs py-2 ${authError ? 'border-red-900/50' : ''}`}
                                />
                                {authError && (
                                    <p className="text-[9px] text-red-500 font-mono flex items-center justify-center gap-1 mt-1.5 uppercase tracking-tighter">
                                        <FiAlertTriangle className="w-2.5 h-2.5" />
                                        Access Denied
                                    </p>
                                )}
                            </div>
                            <Button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-white text-black hover:bg-neutral-200 transition-colors font-mono text-[10px] tracking-widest h-9"
                            >
                                {loading ? '...' : 'ENTER'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-neutral-800/50 py-3">
                        <p className="text-[8px] text-neutral-600 font-mono uppercase tracking-[0.2em]">
                            Admin_V.2.1
                        </p>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-white selection:text-black overflow-hidden">
            <aside
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`${isSidebarCollapsed ? 'w-16' : 'w-60'} border-r border-neutral-900 bg-neutral-950 flex flex-col h-full transition-all duration-300 relative group cursor-pointer`}
            >
                <div className="p-4" onClick={(e) => e.stopPropagation()}>
                    <nav className="space-y-1">
                        {!isSidebarCollapsed && (
                            <Label className="text-[9px] text-neutral-600 uppercase tracking-widest px-2 font-mono mb-2 block animate-in fade-in duration-300">Content Type</Label>
                        )}
                        {(['post', 'daily', 'moment', 'comment'] as const).map((t) => (

                            <button
                                key={t}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setType(t);
                                    setViewMode(t === 'comment' ? 'list' : 'edit');
                                }}

                                className={`w-full flex items-center gap-3 ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-3'} py-2 rounded-md text-xs transition-all cursor-pointer ${type === t
                                    ? 'bg-neutral-900 text-white shadow-sm border border-neutral-800'
                                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50'
                                    }`}
                            >
                                <span className={`p-1 rounded text-[10px] shrink-0 ${type === t ? 'bg-neutral-950 text-white shadow-inner' : 'bg-transparent text-neutral-600'}`}>
                                    {t === 'post' && <FiEdit3 className="w-3 h-3" />}
                                    {t === 'daily' && <FiTerminal className="w-3 h-3" />}
                                    {t === 'moment' && <FiImage className="w-3 h-3" />}
                                    {t === 'comment' && <FiMessageSquare className="w-3 h-3" />}
                                </span>

                                {!isSidebarCollapsed && (
                                    <span className="font-medium capitalize tracking-wide truncate animate-in fade-in duration-300">{t}</span>
                                )}
                                {!isSidebarCollapsed && type === t && <FiCheck className="ml-auto w-3 h-3 text-neutral-500 shrink-0" />}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                    <Separator className="bg-neutral-900" />
                    <nav className="space-y-1">
                        <Link href="/" className={`flex items-center gap-3 ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-3'} py-2 text-xs text-neutral-500 hover:text-white transition-colors group rounded-md hover:bg-neutral-900/50 cursor-pointer`}>
                            <FiHome className="w-3.5 h-3.5 group-hover:scale-105 transition-transform shrink-0" />
                            {!isSidebarCollapsed && <span className="animate-in fade-in duration-300">View Site</span>}
                        </Link>
                        <button
                            onClick={(e) => { e.stopPropagation(); localStorage.removeItem('admin_key'); window.location.reload(); }}
                            className={`w-full flex items-center gap-3 ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-3'} py-2 text-xs text-red-500/60 hover:text-red-500 transition-colors group rounded-md hover:bg-red-950/20 cursor-pointer`}
                        >
                            <FiLogOut className="w-3.5 h-3.5 shrink-0" />
                            {!isSidebarCollapsed && <span className="animate-in fade-in duration-300">Logout</span>}
                        </button>
                    </nav>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-neutral-950 scroll-smooth">
                <div className="max-w-5xl mx-auto py-8 px-1">
                    <div className="mb-6 flex justify-between items-end border-b border-neutral-900 pb-4">
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-white mb-1 capitalize flex items-center gap-2">
                                {isEditing && type === 'post' ? 'Edit Post' : (type === 'comment' ? 'Comment Management' : `New ${type}`)}

                                <span className="text-neutral-600 font-normal text-sm">/</span>
                                <span className="text-neutral-500 font-mono text-xs uppercase normal-case tracking-wider font-normal">
                                    {type === 'post' && viewMode === 'list' ? 'Library' : 'Editor'}
                                </span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            {(type === 'post' || type === 'daily' || type === 'moment') && (
                                <Button
                                    onClick={() => setViewMode(viewMode === 'edit' ? 'list' : 'edit')}
                                    variant="outline"
                                    size="sm"
                                    className="h-7 border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 font-mono text-[9px] uppercase tracking-widest px-3"
                                >
                                    {viewMode === 'edit' ? <FiList className="mr-2 w-3 h-3" /> : <FiPlus className="mr-2 w-3 h-3" />}
                                    {viewMode === 'edit' ? 'Library' : `New_${type}`}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="bg-neutral-950">
                        {viewMode === 'list' ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="grid grid-cols-1 gap-3">
                                    {existingPosts.length === 0 ? (
                                        <div className="py-12 text-center border border-dashed border-neutral-900 rounded-lg bg-neutral-900/20">
                                            <p className="text-neutral-600 font-mono text-xs uppercase tracking-widest">Empty_Registry</p>
                                        </div>
                                    ) : (
                                        existingPosts.map((post) => (
                                            <div
                                                key={post.filename}
                                                className="group flex items-center justify-between p-5 rounded-xl border border-neutral-900 bg-neutral-950 hover:bg-neutral-900 hover:border-neutral-800 transition-all cursor-pointer shadow-sm hover:shadow-md"
                                            >
                                                <div
                                                    className="flex-1 min-w-0 pr-6"
                                                    onClick={() => handleEditPost(post)}
                                                >
                                                    <div className="flex items-center gap-3 mb-1.5">
                                                        <h3 className="text-sm font-bold text-neutral-200 truncate group-hover:text-white transition-colors">
                                                            {type === 'daily' ? post.date : (type === 'comment' ? post.content : post.title)}
                                                        </h3>
                                                        <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 uppercase tracking-tighter shrink-0">{post.date || (post as any).created_at}</span>
                                                        {type === 'comment' && (
                                                            <span className="text-[9px] font-mono text-green-500/60 bg-green-500/5 px-2 py-0.5 rounded border border-green-500/10 uppercase tracking-tighter shrink-0">
                                                                @{post.nickname} {post.contact && `(${post.contact})`}
                                                            </span>
                                                        )}
                                                        {type === 'comment' && (post as any).articleTitle && (
                                                            <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-tighter shrink-0 truncate max-w-[250px]">
                                                                FROM: {(post as any).articleTitle}
                                                            </span>
                                                        )}


                                                    </div>
                                                    <p className="text-xs text-neutral-500 truncate font-mono">
                                                        {type === 'post' ? (post.description || '...') : (type === 'comment' ? '' : (post.content ? post.content.substring(0, 60) : '...'))}
                                                    </p>

                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {type === 'comment' && (
                                                        <button
                                                            onClick={(e) => handleReply(e, post)}
                                                            className="p-2 text-neutral-600 hover:text-blue-400 hover:bg-blue-950/30 rounded-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                                            title="Reply"
                                                        >
                                                            <FiCornerUpLeft className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => handleDelete(e, type, post.filename)}
                                                        className="p-2 text-neutral-600 hover:text-red-400 hover:bg-red-950/30 rounded-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                    <div
                                                        className="p-2 text-neutral-600 hover:text-white transition-colors"
                                                        onClick={() => handleEditPost(post)}
                                                    >
                                                        <FiChevronRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {type === 'post' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        {isEditing && (
                                            <div className="bg-blue-900/10 border border-blue-900/20 rounded-md px-3 py-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FiEdit3 className="text-blue-500 w-3 h-3" />
                                                    <p className="text-[10px] uppercase tracking-wider text-blue-400 font-mono">Editing: <span className="text-white">{currentFilename}</span></p>
                                                </div>
                                                <Button type="button" onClick={handleNewPost} variant="ghost" size="sm" className="h-6 text-[9px] uppercase font-mono tracking-wider text-blue-400/60 hover:text-blue-300 p-0 hover:bg-transparent">
                                                    Close
                                                </Button>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label htmlFor="post-title" className="text-[10px] text-neutral-500 font-semibold px-0.5 uppercase tracking-wider">Title</Label>
                                                <Input id="post-title" placeholder="New Entry..." value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} className="bg-neutral-900/50 border-neutral-800 h-9 text-xs focus:bg-neutral-900 text-white placeholder:text-neutral-700" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="post-date" className="text-[10px] text-neutral-500 font-semibold px-0.5 uppercase tracking-wider">Date</Label>
                                                <Input id="post-date" type="date" value={postData.date} onChange={(e) => { const val = e.target.value; setPostData(prev => ({ ...prev, date: val, slug: isSlugModified ? prev.slug : dateToSlug(val) })); }} className="bg-neutral-900/50 border-neutral-800 h-9 text-xs focus:bg-neutral-900 text-white [&::-webkit-calendar-picker-indicator]:invert" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="post-desc" className="text-[10px] text-neutral-500 font-semibold px-0.5 uppercase tracking-wider">Description</Label>
                                            <Input id="post-desc" value={postData.description} onChange={(e) => setPostData({ ...postData, description: e.target.value })} className="bg-neutral-900/50 border-neutral-800 h-9 text-xs focus:bg-neutral-900 text-neutral-300" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label htmlFor="post-slug" className="text-[10px] text-neutral-500 font-semibold px-0.5 uppercase tracking-wider">Slug</Label>
                                                <Input id="post-slug" value={postData.slug} onChange={(e) => { setPostData({ ...postData, slug: e.target.value }); setIsSlugModified(true); }} className="bg-neutral-900/50 border-neutral-800 h-9 text-xs font-mono text-neutral-400 focus:bg-neutral-900" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="post-category" className="text-[10px] text-neutral-500 font-semibold px-0.5 uppercase tracking-wider">Category</Label>
                                                <Input id="post-category" value={postData.category} onChange={(e) => setPostData({ ...postData, category: e.target.value })} className="bg-neutral-900/50 border-neutral-800 h-9 text-xs focus:bg-neutral-900 text-neutral-300" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="post-content" className="text-[10px] text-neutral-500 font-semibold px-0.5 uppercase tracking-wider">Content</Label>
                                            <Textarea id="post-content" rows={25} value={postData.content} onChange={(e) => setPostData({ ...postData, content: e.target.value })} className="bg-neutral-900/50 border-neutral-800 min-h-[550px] resize-none leading-relaxed p-4 text-xs font-mono text-neutral-300 focus:bg-neutral-900" />
                                        </div>
                                    </div>
                                )}

                                {type === 'daily' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="daily-date" className="text-[10px] text-neutral-500 font-semibold px-0.5 uppercase tracking-wider">Date</Label>
                                            <Input id="daily-date" type="date" className="max-w-[150px] bg-neutral-900/50 border-neutral-800 h-9 text-xs text-white [&::-webkit-calendar-picker-indicator]:invert" value={dailyData.date} onChange={(e) => setDailyData({ ...dailyData, date: e.target.value })} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="daily-url" className="text-[10px] text-neutral-500 font-semibold px-0.5 uppercase tracking-wider">Image URL (Optional)</Label>
                                            <Input id="daily-url" value={dailyData.imageUrl} onChange={(e) => setDailyData({ ...dailyData, imageUrl: e.target.value })} className="bg-neutral-900/50 border-neutral-800 h-9 font-mono text-[10px] text-neutral-400 focus:bg-neutral-900" placeholder="https://..." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="daily-content" className="text-[10px] text-neutral-500 font-semibold px-0.5 uppercase tracking-wider">Log</Label>
                                            <Textarea id="daily-content" rows={10} value={dailyData.content} onChange={(e) => setDailyData({ ...dailyData, content: e.target.value })} className="bg-neutral-900/50 border-neutral-800 min-h-[200px] resize-none leading-normal p-4 text-xs font-mono text-neutral-300 focus:bg-neutral-900" />
                                        </div>
                                    </div>
                                )}

                                {type === 'moment' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label htmlFor="moment-title" className="text-[10px] text-neutral-500 font-semibold px-0.5 uppercase tracking-wider">Title</Label>
                                                <Input id="moment-title" value={momentData.title} onChange={(e) => setMomentData({ ...momentData, title: e.target.value })} className="bg-neutral-900/50 border-neutral-800 h-9 text-xs focus:bg-neutral-900 text-white" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="moment-date" className="text-[10px] text-neutral-500 font-semibold px-0.5 uppercase tracking-wider">Date</Label>
                                                <Input id="moment-date" type="date" value={momentData.date} onChange={(e) => setMomentData({ ...momentData, date: e.target.value })} className="bg-neutral-900/50 border-neutral-800 h-9 text-xs focus:bg-neutral-900 text-white [&::-webkit-calendar-picker-indicator]:invert" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="moment-url" className="text-[10px] text-neutral-500 font-semibold px-0.5 uppercase tracking-wider">Image URL</Label>
                                            <Input id="moment-url" value={momentData.imageUrl} onChange={(e) => setMomentData({ ...momentData, imageUrl: e.target.value })} className="bg-neutral-900/50 border-neutral-800 h-9 font-mono text-[10px] text-neutral-400 focus:bg-neutral-900" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="moment-content" className="text-[10px] text-neutral-500 font-semibold px-0.5 uppercase tracking-wider">Caption</Label>
                                            <Textarea id="moment-content" rows={4} value={momentData.content} onChange={(e) => setMomentData({ ...momentData, content: e.target.value })} className="bg-neutral-900/50 border-neutral-800 min-h-[100px] resize-none leading-normal p-3 text-xs focus:bg-neutral-900 text-neutral-300" />
                                        </div>
                                    </div>
                                )}

                                {message && (
                                    <div className={`p-3 rounded-md text-[10px] font-mono leading-tight border transition-all duration-300 ${message.isError ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-1.5 w-1.5 rounded-full ${message.isError ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
                                            {message.text}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-neutral-900">
                                    <Button disabled={loading} type="submit" size="sm" className="w-full md:w-auto min-w-[120px] bg-white text-black hover:bg-neutral-200 transition-all font-bold tracking-widest text-[10px] h-9 shadow-lg shadow-white/5 active:scale-95 cursor-pointer">
                                        {loading ? (
                                            <div className="flex items-center gap-2 italic">
                                                <div className="animate-spin h-2.5 w-2.5 border-2 border-current border-t-transparent rounded-full" />
                                                SAVING...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <FiSave className="w-3.5 h-3.5" />
                                                {isEditing ? 'UPDATE' : 'PUBLISH'}
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
            {/* Delete Confirmation Dialog */}
            <CustomAlertDialog
                isOpen={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                description={`Are you sure you want to permanently delete "${deleteTarget?.filename}"? This action cannot be undone.`}
                loading={loading}
            />
        </div>
    );
}
