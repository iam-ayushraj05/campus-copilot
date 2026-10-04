import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UploadNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadNotesModal: React.FC<UploadNotesModalProps> = ({ isOpen, onClose }) => {
  const { uploadMaterial } = useApp();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Data Structures');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));

      const reader = new FileReader();
      reader.onload = event => {
        const text = event.target?.result as string;
        setContent(text || `Extracted lecture notes from ${file.name}. Key topics: concepts, definitions, sample problems.`);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      uploadMaterial(
        title || 'Untitled Notes',
        subject,
        fileName || `${title || 'notes'}.pdf`,
        content || `Course notes for ${subject}. Details: Unit notes and exam review material.`
      );
      setProcessing(false);
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setTitle('');
        setContent('');
        setFileName('');
        onClose();
      }, 800);
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          position: 'relative',
          padding: '28px',
          border: '1px solid rgba(6, 182, 212, 0.4)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', color: '#06B6D4' }}>
            <Upload size={22} />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Upload Study Material (PDF/Notes)
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Materials uploaded here are chunked and indexed for Grounded RAG search in StudyBuddy.
        </p>

        {done ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#10B981' }}>
            <CheckCircle2 size={48} style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Notes Processed & Grounded!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
              StudyBuddy is now ready to answer questions from this material.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Document Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Operating Systems Unit 4 Notes"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Subject
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                }}
              >
                <option value="Data Structures">Data Structures & Algorithms</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="DBMS">Database Management Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Software Engineering">Software Engineering</option>
              </select>
            </div>

            <div
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '24px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.01)',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <input
                type="file"
                accept=".pdf,.txt,.md,.doc,.docx"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                }}
              />
              <FileText size={32} color="#06B6D4" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {fileName ? fileName : 'Click or Drag PDF/Text file here'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Supports PDF, TXT, Markdown up to 25MB
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Text / Paste Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Or paste key text highlights directly..."
                value={content}
                onChange={e => setContent(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  resize: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '12px' }}
            >
              {processing ? 'Reading & Indexing Notes...' : 'Upload & Ground Notes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
