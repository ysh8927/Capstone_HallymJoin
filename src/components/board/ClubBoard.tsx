'use client';

import { useState, useMemo } from 'react';
import { Pin, Eye, Heart, MessageSquare, Search, X } from 'lucide-react';
import { Post, PostCategory, POST_CATEGORY_LABEL } from '@/types';
import { cn } from '@/lib/utils';

interface ClubBoardProps {
  posts: Post[];
  pinnedPost?: Post;
  clubId: string;
}

const CAT_TABS: { key: PostCategory | 'all'; label: string }[] = [
  { key: 'all',    label: '전체' },
  { key: 'notice', label: '공지' },
  { key: 'free',   label: '자유' },
  { key: 'photo',  label: '사진' },
  { key: 'qna',    label: 'Q&A' },
];

const CAT_STYLE: Record<PostCategory, string> = {
  notice: 'bg-indigo-50 text-indigo-600',
  free:   'bg-gray-100 text-gray-500',
  photo:  'bg-teal-50 text-teal-600',
  qna:    'bg-purple-50 text-purple-600',
};

export default function ClubBoard({ posts: initialPosts, pinnedPost, clubId }: ClubBoardProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [cat,    setCat]    = useState<PostCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort,   setSort]   = useState<'latest' | 'popular' | 'comment'>('latest');
  const [openId, setOpenId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    let list = posts.filter((p) => !p.isPinned);
    if (cat !== 'all') list = list.filter((p) => p.category === cat);
    if (search.trim()) list = list.filter((p) => p.title.includes(search) || p.author.includes(search));
    if (sort === 'popular') list = [...list].sort((a, b) => b.likes - a.likes);
    if (sort === 'comment') list = [...list].sort((a, b) => b.comments.length - a.comments.length);
    return list;
  }, [posts, cat, search, sort]);

  const openPost = posts.find((p) => p.id === openId);

  async function handleCommentSubmit() {
    if (!newComment.trim() || !openId || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${openId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment }),
      });
      if (res.ok) {
        const comment = await res.json();
        setPosts((prev) => prev.map((p) =>
          p.id === openId
            ? { ...p, comments: [...p.comments, {
                id: comment.id,
                author: comment.author.name,
                authorColor: '#6366F1',
                text: comment.text,
                time: '방금 전',
                likes: 0,
              }] }
            : p
        ));
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  }

  async function handleCommentLike(postId: string, commentId: string) {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      });
      if (res.ok) {
        setPosts((prev) => prev.map((p) =>
          p.id === postId
            ? { ...p, comments: p.comments.map((c) =>
                c.id === commentId ? { ...c, likes: c.likes + 1 } : c
              )}
            : p
        ));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handlePostLike(postId: string) {
    if (likedPosts.has(postId)) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      });
      if (res.ok) {
        setLikedPosts((s) => new Set(s).add(postId));
        setPosts((prev) => prev.map((p) =>
          p.id === postId ? { ...p, likes: p.likes + 1 } : p
        ));
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (openPost) {
    return (
      <PostDetail
        post={openPost}
        liked={likedPosts.has(openPost.id)}
        onToggleLike={() => handlePostLike(openPost.id)}
        onCommentLike={(commentId) => handleCommentLike(openPost.id, commentId)}
        newComment={newComment}
        onCommentChange={setNewComment}
        onBack={() => setOpenId(null)}
        onCommentSubmit={handleCommentSubmit}
        submitting={submitting}
      />
    );
  }

  return (
    <div>
      {pinnedPost && (
        <div onClick={() => setOpenId(pinnedPost.id)}
          className="mx-1 mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 cursor-pointer hover:border-amber-400 transition-colors">
          <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
            <Pin size={14} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-0.5">고정 공지</p>
            <p className="text-sm font-semibold text-amber-900 truncate">{pinnedPost.title}</p>
            <p className="text-xs text-amber-700 mt-0.5 opacity-70">{pinnedPost.author} · {pinnedPost.date}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {CAT_TABS.map((t) => (
          <button key={t.key} onClick={() => setCat(t.key)}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors cursor-pointer',
              cat === t.key
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-[var(--bg2)] text-[var(--txt2)] border-[var(--bdr)] hover:bg-[var(--bg3)]',
            )}>
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[var(--bg2)] border border-[var(--bdr)] rounded-lg px-3 py-1.5">
            <Search size={11} className="text-[var(--txt3)]" />
            <input className="bg-transparent text-xs text-[var(--txt)] placeholder:text-[var(--txt3)] outline-none w-28"
              placeholder="검색..." value={search} onChange={(e) => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch('')} className="cursor-pointer"><X size={10} className="text-[var(--txt3)]" /></button>}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
            className="text-xs bg-[var(--bg2)] border border-[var(--bdr)] rounded-lg px-2 py-1.5 text-[var(--txt2)] cursor-pointer outline-none">
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="comment">댓글순</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-[var(--txt3)]">
          <span className="text-4xl mb-3 opacity-30">📭</span>
          <p className="text-sm text-[var(--txt2)]">게시글이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((post, i) => (
            <div key={post.id} onClick={() => setOpenId(post.id)}
              className={cn(
                'bg-[var(--bg)] border border-[var(--bdr)] rounded-2xl p-4 flex gap-3 cursor-pointer',
                'hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-150 animate-fade-up',
                post.category === 'notice' && 'border-l-2 border-l-indigo-400',
                post.category === 'photo'  && 'border-l-2 border-l-teal-400',
              )}
              style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', CAT_STYLE[post.category])}>
                    {POST_CATEGORY_LABEL[post.category]}
                  </span>
                  {post.likes > 20 && <span className="text-[10px] text-rose-500 font-medium">🔥 인기</span>}
                </div>
                <p className="text-sm font-semibold text-[var(--txt)] truncate mb-1">{post.title}</p>
                <p className="text-xs text-[var(--txt2)] line-clamp-1 mb-2 opacity-80">
                  {post.body.replace(/<[^>]*>/g, '').slice(0, 60)}...
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                    style={{ background: post.authorColor }}>
                    {post.author[0]}
                  </div>
                  <span className="text-[11px] text-[var(--txt2)]">{post.author}</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded-full">{post.authorRole}</span>
                  <span className="ml-auto flex items-center gap-3 text-[11px] text-[var(--txt3)]">
                    <span className="flex items-center gap-1"><Eye size={10} />{post.views}</span>
                    <span className="flex items-center gap-1"><Heart size={10} />{post.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={10} />{post.comments.length}</span>
                  </span>
                  <span className="text-[11px] text-[var(--txt3)]">{post.date}</span>
                </div>
              </div>
              {post.hasImage && (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-300 to-teal-500 flex items-center justify-center text-xl flex-shrink-0">
                  🌸
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface PostDetailProps {
  post: Post;
  liked: boolean;
  onToggleLike: () => void;
  onCommentLike: (commentId: string) => void;
  newComment: string;
  onCommentChange: (v: string) => void;
  onBack: () => void;
  onCommentSubmit: () => void;
  submitting: boolean;
}

function PostDetail({ post, liked, onToggleLike, onCommentLike, newComment, onCommentChange, onBack, onCommentSubmit, submitting }: PostDetailProps) {
  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-[var(--txt2)] hover:text-[var(--txt)] mb-4 cursor-pointer">
        ← 목록으로
      </button>
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', CAT_STYLE[post.category])}>
            {POST_CATEGORY_LABEL[post.category]}
          </span>
          <span className="text-xs text-[var(--txt3)]">조회 {post.views}</span>
        </div>
        <h2 className="text-xl font-serif font-bold text-[var(--txt)] mb-3 leading-snug">{post.title}</h2>
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--bdr)]">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${post.authorColor}, ${post.authorColor}aa)` }}>
            {post.author[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--txt)]">{post.author}</p>
            <p className="text-xs text-[var(--txt2)]">{post.authorRole} · {post.authorGrade}</p>
          </div>
          <span className="ml-auto text-xs text-[var(--txt3)]">{post.date}</span>
        </div>
      </div>

      <div className="text-sm text-[var(--txt)] leading-relaxed mb-6 pb-6 border-b border-[var(--bdr)]
          [&_.notice-box]:bg-indigo-50 [&_.notice-box]:border-l-4 [&_.notice-box]:border-indigo-500
          [&_.notice-box]:rounded-r-lg [&_.notice-box]:px-4 [&_.notice-box]:py-3
          [&_.notice-box]:my-3 [&_.notice-box]:text-indigo-700 [&_.notice-box]:text-sm
          [&_p]:mb-3 [&_strong]:font-semibold"
        dangerouslySetInnerHTML={{ __html: post.body }} />

      <div className="flex items-center justify-center gap-3 mb-8">
        <button onClick={onToggleLike}
          className={cn(
            'flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer',
            liked ? 'bg-rose-50 text-rose-500 border-rose-200' : 'bg-[var(--bg2)] text-[var(--txt2)] border-[var(--bdr)] hover:bg-[var(--bg3)]',
          )}>
          <Heart size={15} className={liked ? 'fill-rose-500' : ''} />
          {post.likes}
        </button>
        <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-[var(--bdr)] bg-[var(--bg2)] text-sm text-[var(--txt2)] font-medium cursor-pointer hover:bg-[var(--bg3)] transition-colors">
          <MessageSquare size={15} />
          댓글 {post.comments.length}
        </button>
      </div>

      <div>
        <p className="text-sm font-semibold text-[var(--txt)] mb-4 flex items-center gap-2">
          댓글 <span className="text-xs font-normal text-[var(--txt2)]">{post.comments.length}개</span>
        </p>
        <div className="space-y-4 mb-5">
          {post.comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 mt-0.5"
                style={{ background: c.authorColor }}>
                {c.author[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[var(--txt)]">{c.author}</span>
                  {c.authorRole && (
                    <span className="text-[9px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded-full font-medium">{c.authorRole}</span>
                  )}
                  <span className="text-[11px] text-[var(--txt3)]">{c.time}</span>
                </div>
                <div className="text-sm text-[var(--txt)] bg-[var(--bg2)] px-3 py-2.5 rounded-r-2xl rounded-bl-2xl leading-relaxed">
                  {c.text}
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <button
                    onClick={() => onCommentLike(c.id)}
                    className="text-[11px] text-[var(--txt3)] hover:text-rose-500 flex items-center gap-1 cursor-pointer transition-colors">
                    <Heart size={10} /> {c.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <textarea
            className="flex-1 bg-[var(--bg2)] border border-[var(--bdr)] rounded-xl px-3 py-2.5 text-sm text-[var(--txt)] placeholder:text-[var(--txt3)] outline-none focus:border-indigo-400 resize-none transition-colors"
            placeholder="댓글을 입력하세요..."
            rows={2}
            value={newComment}
            onChange={(e) => onCommentChange(e.target.value)}
          />
          <button
            onClick={onCommentSubmit}
            disabled={submitting || !newComment.trim()}
            className="flex-shrink-0 self-end bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50">
            {submitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}