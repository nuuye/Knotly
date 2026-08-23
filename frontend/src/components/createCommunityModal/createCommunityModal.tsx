import { X, Upload, Gamepad2, Music, Code, BookOpen, Heart, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import styles from './CreateCommunityModal.module.scss';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_OPTIONS = [
  { id: "gaming", name: "Gaming", icon: Gamepad2 },
  { id: "music", name: "Music", icon: Music },
  { id: "tech", name: "Tech", icon: Code },
  { id: "culture", name: "Culture", icon: BookOpen },
  { id: "health", name: "Health", icon: Heart },
  { id: "trending", name: "Trending", icon: TrendingUp },
  { id: "other", name: "Other", icon: Users },
];

export function CreateCommunityModal({ isOpen, onClose }: CreateCommunityModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "gaming",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle community creation logic
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Create Community</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Community Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter community name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="What is your community about?"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Community Icon (Optional)</label>
            <div className={styles.uploadArea}>
              <Upload />
              <p>Click to upload</p>
              <span>SVG, PNG, JPG (max. 2MB)</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
