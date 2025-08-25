'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import styles from '@/components/Contact.module.css';
import { ContactService } from '@/services/contactService';
import { ContactMessageInput } from '@/types/contact';

const contactService = new ContactService();

export default function ContactPage() {
  const { lang } = useParams(); // "tr" veya "en"

  const [formData, setFormData] = useState<ContactMessageInput>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await contactService.createMessage(formData);
      setSuccess(lang === 'tr' ? 'Mesajınız başarıyla gönderildi!' : 'Your message has been sent!');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        // Axios tarzı hataları al
        // @ts-expect-error response tipi bilinmiyor
        setError(err.response?.data?.message || (lang === 'tr' ? 'Bir hata oluştu' : 'An error occurred'));
      } else {
        setError(lang === 'tr' ? 'Bir hata oluştu' : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.contactContainer}>
      <h2>{lang === 'tr' ? 'İletişim' : 'Contact Us'}</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>{lang === 'tr' ? 'İsim' : 'Name'}</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>{lang === 'tr' ? 'E-posta' : 'Email'}</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className={styles.formGroup}>
          <label>{lang === 'tr' ? 'Telefon' : 'Phone'}</label>
          <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label>{lang === 'tr' ? 'Mesaj' : 'Message'}</label>
          <textarea name="message" value={formData.message} onChange={handleChange} required />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading
            ? lang === 'tr' ? 'Gönderiliyor...' : 'Sending...'
            : lang === 'tr' ? 'Gönder' : 'Send'}
        </button>
      </form>

      {success && <p className={styles.successMsg}>{success}</p>}
      {error && <p className={styles.errorMsg}>{error}</p>}
    </section>
  );
}
