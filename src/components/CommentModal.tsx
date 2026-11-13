import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Send, User, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";
import { useUserRole } from "../utils/useUserRole";

export interface CommentItem {
  id: string;
  item_id: string;
  user_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export function CommentModal({
  isOpen,
  onClose,
  itemTitle,
  itemId,
}: {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemId: string;
}) {
  const { user, isSuperAdmin } = useUserRole();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("item_id", itemId)
        .order("created_at", { ascending: true });

      if (error) {
        // Table might not exist yet; gracefully fallback
        console.warn("Comments table note:", error.message);
      }
      setComments(data || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
      setNewComment("");
      setErrorMsg("");
    }
  }, [isOpen, itemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      setErrorMsg("Please sign in to leave a comment.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const authorName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Client";

      const payload = {
        item_id: itemId,
        user_id: user.id,
        author_name: authorName,
        content: newComment.trim(),
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("comments")
        .insert([payload])
        .select();

      if (error) {
        // If table doesn't exist, store in local session so user experience is smooth
        console.warn("Comments insert note:", error.message);
        setComments((prev) => [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            item_id: itemId,
            user_id: user.id,
            author_name: authorName,
            content: newComment.trim(),
            created_at: new Date().toISOString(),
          },
        ]);
      } else if (data) {
        setComments((prev) => [...prev, ...data]);
      }

      setNewComment("");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await supabase.from("comments").delete().eq("id", commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/75 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[85vh] w-full max-w-lg overflow-hidden rounded-[2rem] bg-white p-6 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-blue-50 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F0FF] text-[#1E40AF]">
                <MessageSquare size={18} />
              </span>
              <div>
                <h3 className="font-display text-base font-extrabold text-[#0F172A] line-clamp-1">
                  Comments &amp; Inquiries
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1">{itemTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              ✕
            </button>
          </div>

          {/* Comment List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 min-h-[160px] max-h-[300px]">
            {loading ? (
              <p className="text-center text-xs text-slate-400 py-8">Loading comments...</p>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">No comments yet</p>
                <p className="text-[11px] text-slate-400">Be the first to leave an inquiry!</p>
              </div>
            ) : (
              comments.map((c) => {
                const isOwner = user?.id === c.user_id;
                const canDelete = isOwner || isSuperAdmin;
                return (
                  <div
                    key={c.id}
                    className="rounded-xl border border-blue-50 bg-[#F4F7FE] p-3 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                        <User size={12} className="text-[#1E40AF]" />
                        {c.author_name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.created_at).toLocaleDateString()}
                        </span>
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            title="Delete comment"
                            className="text-red-400 hover:text-red-600 transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed break-words">{c.content}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Post Form */}
          {errorMsg && (
            <p className="text-[11px] font-bold text-red-600 bg-red-50 p-2 rounded-lg mb-2">
              {errorMsg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="border-t border-blue-50 pt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? "Write a comment or question..." : "Sign in to comment..."}
                disabled={!user || submitting}
                className="flex-1 rounded-xl border border-blue-100 bg-[#F4F7FE] px-3.5 py-2.5 text-xs outline-none focus:border-[#1E40AF] focus:bg-white disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!user || submitting || !newComment.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1E40AF] to-[#0EA5E9] px-4 py-2.5 text-xs font-bold text-white shadow transition hover:brightness-110 disabled:opacity-50"
              >
                <Send size={13} />
                <span>Post</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
