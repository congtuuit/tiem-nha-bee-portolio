"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Globe,
  Type,
  Save,
  Eye,
  Send,
  Image as ImageIcon,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { updatePost } from "../../actions";
import { toast } from "sonner";

interface PostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  status: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
}

export function EditPostForm({ post }: { post: PostData }) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  // AI State
  const [aiUrl, setAiUrl] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Post State
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [coverImage, setCoverImage] = useState(post.cover_image);
  const [seoTitle, setSeoTitle] = useState(post.seo_title);
  const [seoDescription, setSeoDescription] = useState(post.seo_description);
  const [seoKeywords, setSeoKeywords] = useState(post.seo_keywords);
  const [saving, setSaving] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // AI Generate
  const handleAiGenerate = async () => {
    if (!aiUrl && !aiPrompt) {
      toast.error("Vui lòng nhập URL tham khảo hoặc mô tả chủ đề.");
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch("/api/admin/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: aiUrl || undefined,
          prompt: aiPrompt || undefined,
          mode: aiUrl ? "rewrite" : "prompt",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Lỗi khi tạo nội dung.");
        return;
      }

      const ai = data.data;
      if (ai.title) setTitle(ai.title);
      if (ai.content) {
        setContent(ai.content);
        if (contentRef.current) {
          contentRef.current.innerHTML = ai.content;
        }
      }
      if (ai.excerpt) setExcerpt(ai.excerpt);
      if (ai.seo_title) setSeoTitle(ai.seo_title);
      if (ai.seo_description) setSeoDescription(ai.seo_description);
      if (ai.seo_keywords) setSeoKeywords(ai.seo_keywords);

      toast.success("🎉 AI đã tạo nội dung mới! Hãy review trước khi lưu.");
    } catch {
      toast.error("Đã xảy ra lỗi khi kết nối AI.");
    } finally {
      setAiLoading(false);
    }
  };

  // Save Post
  const handleSave = async (status: string) => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết.");
      return;
    }

    const currentContent = contentRef.current?.innerHTML || content;

    setSaving(true);
    try {
      const result = await updatePost(post.id, {
        title,
        content: currentContent,
        excerpt,
        cover_image: coverImage || undefined,
        status,
        seo_title: seoTitle || undefined,
        seo_description: seoDescription || undefined,
        seo_keywords: seoKeywords || undefined,
      });

      if (result.success) {
        toast.success(
          status === "published" ? "Đã xuất bản bài viết!" : "Đã lưu bản nháp!"
        );
        router.push("/admin/posts");
      } else {
        toast.error(result.error || "Lỗi khi lưu bài viết.");
      }
    } catch {
      toast.error("Đã xảy ra lỗi.");
    } finally {
      setSaving(false);
    }
  };

  // Toolbar commands
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const insertLink = () => {
    const url = window.prompt("Nhập URL:");
    if (url) execCommand("createLink", url);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/posts"
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Chỉnh sửa bài viết</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Lưu nháp
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="px-5 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-amber-600/20 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Xuất bản
          </button>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border border-violet-200 p-6 space-y-4">
        <div className="flex items-center gap-2 text-violet-700 font-bold">
          <Sparkles className="w-5 h-5" />
          <span>AI Trợ lý Viết bài</span>
        </div>
        <p className="text-sm text-violet-600/80">
          Dán link bài viết tham khảo hoặc mô tả chủ đề, AI sẽ viết lại nội dung chuẩn SEO.
        </p>

        <div className="space-y-3">
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
            <input
              type="url"
              placeholder="Dán URL bài viết tham khảo..."
              value={aiUrl}
              onChange={(e) => setAiUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-violet-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Type className="absolute left-3 top-3 w-4 h-4 text-violet-400" />
            <textarea
              placeholder="Hoặc mô tả chủ đề bạn muốn viết..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={2}
              className="w-full pl-10 pr-4 py-3 bg-white border border-violet-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all resize-none"
            />
          </div>

          <button
            onClick={handleAiGenerate}
            disabled={aiLoading}
            className="w-full py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI đang viết bài...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Sinh nội dung bằng AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <input
          type="text"
          placeholder="Tiêu đề bài viết..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-bold text-slate-800 placeholder:text-slate-300 outline-none border-none bg-transparent"
        />

        {/* Cover Image */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Ảnh bìa (URL)
          </label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
          {coverImage && (
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">
            Tóm tắt (excerpt)
          </label>
          <textarea
            placeholder="Mô tả ngắn cho bài viết..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
          />
        </div>
      </div>

      {/* Rich Text Editor */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 bg-slate-50 flex-wrap">
          <button type="button" onClick={() => execCommand("bold")} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 cursor-pointer" title="In đậm"><Bold className="w-4 h-4" /></button>
          <button type="button" onClick={() => execCommand("italic")} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 cursor-pointer" title="In nghiêng"><Italic className="w-4 h-4" /></button>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button type="button" onClick={() => execCommand("formatBlock", "h2")} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 cursor-pointer" title="Heading 2"><Heading2 className="w-4 h-4" /></button>
          <button type="button" onClick={() => execCommand("formatBlock", "h3")} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 cursor-pointer" title="Heading 3"><Heading3 className="w-4 h-4" /></button>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button type="button" onClick={() => execCommand("insertUnorderedList")} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 cursor-pointer" title="Danh sách"><List className="w-4 h-4" /></button>
          <button type="button" onClick={() => execCommand("insertOrderedList")} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 cursor-pointer" title="Danh sách đánh số"><ListOrdered className="w-4 h-4" /></button>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button type="button" onClick={insertLink} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600 cursor-pointer" title="Chèn link"><LinkIcon className="w-4 h-4" /></button>
          <div className="ml-auto">
            <button type="button" onClick={() => setShowPreview(!showPreview)} className={`p-2 rounded-lg transition-colors cursor-pointer ${showPreview ? "bg-amber-100 text-amber-700" : "hover:bg-slate-200 text-slate-600"}`} title="Xem trước"><Eye className="w-4 h-4" /></button>
          </div>
        </div>

        {showPreview ? (
          <div
            className="p-8 prose prose-neutral max-w-none min-h-[400px]"
            dangerouslySetInnerHTML={{
              __html: contentRef.current?.innerHTML || content,
            }}
          />
        ) : (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className="p-8 min-h-[400px] outline-none text-slate-700 leading-relaxed prose prose-neutral max-w-none [&:empty]:before:content-['Viết_nội_dung_bài_viết_ở_đây...'] [&:empty]:before:text-slate-300"
            onInput={() => {
              if (contentRef.current) {
                setContent(contentRef.current.innerHTML);
              }
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>

      {/* SEO Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSeo(!showSeo)}
          className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <span className="font-semibold text-slate-700">⚙️ Cài đặt SEO</span>
          {showSeo ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {showSeo && (
          <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">SEO Title</label>
              <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Tiêu đề SEO..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
              <p className="text-xs text-slate-400">{seoTitle.length}/60 ký tự</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Meta Description</label>
              <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Mô tả meta..." rows={3} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none" />
              <p className="text-xs text-slate-400">{seoDescription.length}/160 ký tự</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Từ khóa</label>
              <input type="text" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="từ khóa 1, từ khóa 2" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all" />
            </div>
            {(seoTitle || title) && (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Xem trước trên Google</p>
                <div className="space-y-1">
                  <p className="text-blue-700 text-lg font-medium line-clamp-1">{seoTitle || title}</p>
                  <p className="text-green-700 text-sm">tiemnhabee.store/blog/{post.slug}</p>
                  <p className="text-sm text-slate-600 line-clamp-2">{seoDescription || excerpt || "Chưa có mô tả..."}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
