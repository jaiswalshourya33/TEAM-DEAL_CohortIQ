import { useEffect, useState } from 'react';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  onAddNote: (note: string) => void;
}

export function AddNoteModal({ isOpen, onClose, candidateName, onAddNote }: AddNoteModalProps) {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setNote('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmed = note.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#534439] bg-[#1c1815] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#e9e1dc]">Add Interview Note</h3>
          <button type="button" onClick={onClose} className="text-[#a08d80] hover:text-[#e9e1dc] text-xl">
            ×
          </button>
        </div>

        <p className="mb-3 text-xs text-[#a08d80]">
          Add a recruiter note for {candidateName}.
        </p>

        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={5}
          placeholder="Capture a hiring signal, concern, or follow-up question..."
          className="w-full rounded-xl border border-[#383430] bg-[#161310] p-3 text-sm text-[#e9e1dc] placeholder-[#a08d80] focus:border-[#ffc499] focus:outline-none"
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#383430] bg-[#221f1c] px-4 py-2 text-xs font-semibold text-[#e9e1dc]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-[#f4a261] px-4 py-2 text-xs font-bold text-[#161310]"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
