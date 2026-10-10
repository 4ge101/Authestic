import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Clock,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Sparkles,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { Card } from '../components/Card.tsx';
import { stories } from '../data.ts';
import type { Story, Category } from '../lib/types.ts';
import {
  loadProgress,
  loadSettings,
  toggleStoryBookmark,
  recordStoryCompleted
} from '../lib/storage.ts';
import { calmSound } from '../lib/audio.ts';

export const Stories: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [readerFontSize, setReaderFontSize] = useState<'normal' | 'large'>('normal');

  const [progress, setProgress] = useState(loadProgress());
  const settings = loadSettings();

  const categories: (Category | 'All')[] = ['All', 'Emotions', 'Friendship', 'Bravery', 'Daily Life'];

  // Filter stories
  const filteredStories = stories.filter((story) => {
    const matchesCategory = selectedCategory === 'All' || story.category === selectedCategory;
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleBookmark = (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    const updated = toggleStoryBookmark(storyId);
    setProgress(updated);
    if (settings.soundEffects) {
      calmSound.playTap(true);
    }
  };

  const handleOpenStory = (story: Story) => {
    setActiveStory(story);
    setCurrentPageIndex(0);
    if (settings.soundEffects) {
      calmSound.playTap(true);
    }
  };

  const handleCloseReader = () => {
    setActiveStory(null);
    setCurrentPageIndex(0);
  };

  const handleNextPage = () => {
    if (!activeStory) return;
    if (currentPageIndex < activeStory.pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
      if (settings.soundEffects) {
        calmSound.playTap(true);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      if (settings.soundEffects) {
        calmSound.playTap(true);
      }
    }
  };

  const handleFinishStory = () => {
    if (!activeStory) return;
    const updated = recordStoryCompleted(activeStory.id);
    setProgress(updated);
    if (settings.soundEffects) {
      calmSound.playSuccess(true);
    }
    handleCloseReader();
  };

  const handleReadAloud = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // gentle, slower pace for kids
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="stories-page">
      {/* Header and intro */}
      <section className="page-header">
        <h2 className="page-title">Story Library</h2>
        <p className="page-description">
          Gentle, illustrated stories that explore emotions, change, friendships, and peaceful routines.
        </p>
      </section>

      {/* Filter and Search Bar */}
      <section style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }} role="tablist" aria-label="Story categories">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelectedCategory(cat);
                    if (settings.soundEffects) calmSound.playTap(true);
                  }}
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.75rem',
              minWidth: '240px'
            }}
          >
            <Search size={15} style={{ color: 'var(--text-subtle)' }} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.85rem',
                color: 'var(--text-main)'
              }}
              aria-label="Filter stories by title"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} aria-label="Clear filter">
                <X size={14} style={{ color: 'var(--text-subtle)' }} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section>
        {filteredStories.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <BookOpen size={36} style={{ color: 'var(--text-subtle)', margin: '0 auto 0.75rem' }} aria-hidden="true" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              No stories match your search
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Try searching for "otter", "brave", or choose "All" categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn btn-secondary btn-sm"
            >
              Reset Filters
            </button>
          </Card>
        ) : (
          <div className="grid-3">
            {filteredStories.map((story) => {
              const isBookmarked = progress.bookmarkedStories.includes(story.id);
              const isCompleted = progress.completedStories.includes(story.id);

              return (
                <Card
                  key={story.id}
                  accent="default"
                  interactive
                  onClick={() => handleOpenStory(story)}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  {/* Card Cover Accent Top Strip */}
                  <div
                    style={{
                      height: '80px',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '0.85rem',
                      backgroundColor:
                        story.coverAccent === 'teal'
                          ? 'var(--teal-surface)'
                          : story.coverAccent === 'sage'
                          ? 'var(--sage-surface)'
                          : story.coverAccent === 'blue'
                          ? 'var(--blue-surface)'
                          : 'var(--orange-surface)',
                      border: `1px solid ${
                        story.coverAccent === 'teal'
                          ? 'var(--teal-border)'
                          : story.coverAccent === 'sage'
                          ? 'var(--sage-border)'
                          : story.coverAccent === 'blue'
                          ? 'var(--blue-border)'
                          : 'var(--orange-border)'
                      }`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <BookOpen
                      size={28}
                      style={{
                        color:
                          story.coverAccent === 'teal'
                            ? 'var(--teal-primary)'
                            : story.coverAccent === 'sage'
                            ? 'var(--sage-primary)'
                            : story.coverAccent === 'blue'
                            ? 'var(--blue-primary)'
                            : 'var(--orange-primary)'
                      }}
                      aria-hidden="true"
                    />

                    {/* Bookmark icon toggle */}
                    <button
                      onClick={(e) => handleToggleBookmark(e, story.id)}
                      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
                      title={isBookmarked ? 'Bookmarked' : 'Add bookmark'}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isBookmarked ? 'var(--orange-primary)' : 'var(--text-subtle)'
                      }}
                    >
                      {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span
                      className={`badge ${
                        story.coverAccent === 'teal'
                          ? 'badge-teal'
                          : story.coverAccent === 'sage'
                          ? 'badge-sage'
                          : story.coverAccent === 'blue'
                          ? 'badge-blue'
                          : 'badge-orange'
                      }`}
                    >
                      {story.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={12} aria-hidden="true" />
                      <span>{story.readTimeMinutes} min</span>
                    </span>
                    {isCompleted && (
                      <span className="badge badge-teal" style={{ marginLeft: 'auto', textTransform: 'none' }}>
                        <CheckCircle2 size={11} aria-hidden="true" />
                        <span>Read</span>
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {story.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45, flex: 1, marginBottom: '0.75rem' }}>
                    {story.summary}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                      {story.ageRange}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--teal-primary)' }}>
                      Read &rarr;
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Working Story Reader Modal */}
      {activeStory && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reader-story-title"
          onClick={handleCloseReader}
        >
          <div
            className="modal-container"
            style={{ maxWidth: '640px', padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Reader Bar */}
            <div className="modal-header" style={{ marginBottom: '1rem', paddingBottom: '0.75rem' }}>
              <div>
                <span className="badge badge-teal" style={{ marginBottom: '0.25rem' }}>
                  {activeStory.category}
                </span>
                <h3 id="reader-story-title" className="modal-title" style={{ fontSize: '1.15rem' }}>
                  {activeStory.title}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Font Size Toggle */}
                <button
                  className="icon-btn"
                  onClick={() => setReaderFontSize((prev) => (prev === 'normal' ? 'large' : 'normal'))}
                  title="Toggle reader font size"
                  aria-label="Toggle reader font size"
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    {readerFontSize === 'normal' ? 'A+' : 'A-'}
                  </span>
                </button>

                {/* Read Aloud Helper */}
                <button
                  className="icon-btn"
                  onClick={() => handleReadAloud(activeStory.pages[currentPageIndex].text)}
                  title="Read page aloud"
                  aria-label="Read this page out loud"
                >
                  <Volume2 size={16} />
                </button>

                {/* Bookmark Toggle */}
                <button
                  className="icon-btn"
                  onClick={(e) => handleToggleBookmark(e, activeStory.id)}
                  title={progress.bookmarkedStories.includes(activeStory.id) ? 'Bookmarked' : 'Add bookmark'}
                  aria-label="Bookmark this story"
                >
                  {progress.bookmarkedStories.includes(activeStory.id) ? (
                    <BookmarkCheck size={16} style={{ color: 'var(--orange-primary)' }} />
                  ) : (
                    <Bookmark size={16} />
                  )}
                </button>

                {/* Close Button */}
                <button className="icon-btn" onClick={handleCloseReader} aria-label="Close reader">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Reading Progress Indicator */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.35rem' }}>
                <span>Page {currentPageIndex + 1} of {activeStory.pages.length}</span>
                <span>{Math.round(((currentPageIndex + 1) / activeStory.pages.length) * 100)}% completed</span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${((currentPageIndex + 1) / activeStory.pages.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Story Page Content Box */}
            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                border: '1px solid var(--border-light)',
                minHeight: '180px',
                marginBottom: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <p
                style={{
                  fontSize: readerFontSize === 'large' ? '1.25rem' : '1.05rem',
                  lineHeight: 1.7,
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-line'
                }}
              >
                {activeStory.pages[currentPageIndex].text}
              </p>

              {activeStory.pages[currentPageIndex].highlightWords && (
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                    Key concepts:
                  </span>
                  {activeStory.pages[currentPageIndex].highlightWords?.map((word) => (
                    <span
                      key={word}
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: 'var(--bg-surface)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        color: 'var(--teal-primary)',
                        fontWeight: 500
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Reflection question if on the final page */}
            {currentPageIndex === activeStory.pages.length - 1 && (
              <div
                style={{
                  backgroundColor: 'var(--teal-surface)',
                  border: '1px solid var(--teal-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--teal-text)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <HelpCircle size={15} aria-hidden="true" />
                  <span>Gentle Reflection Question</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                  {activeStory.reflectionQuestion}
                </p>
              </div>
            )}

            {/* Page Navigation Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                style={{ opacity: currentPageIndex === 0 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} aria-hidden="true" />
                <span>Previous Page</span>
              </button>

              {currentPageIndex === activeStory.pages.length - 1 ? (
                <button className="btn btn-primary btn-sm" onClick={handleFinishStory}>
                  <Sparkles size={16} aria-hidden="true" />
                  <span>Finish & Record Progress</span>
                </button>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={handleNextPage}>
                  <span>Next Page</span>
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
