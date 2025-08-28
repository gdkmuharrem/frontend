'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from '@/components/Contact.module.css';
import { ContactService } from '@/services/contactService';
import { ContactMessageInput } from '@/types/contact';
import { AxiosError } from 'axios';

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

  useEffect(() => {
    
    // Scroll animasyonları için
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.animate);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(`.${styles.fadeIn}`);
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

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
    setSuccess(
      lang === 'tr' 
        ? 'Mesajınız başarıyla gönderildi!' 
        : 'Your message has been sent!'
    );
    setFormData({ name: '', email: '', phone: '', message: '' });
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      // Axios üzerinden gelen hata
      setError(
        err.response?.data?.message || 
        (lang === 'tr' ? 'Bir hata oluştu' : 'An error occurred')
      );
    } else if (err instanceof Error) {
      // Normal JS hatası
      setError(err.message);
    } else {
      // Diğer bilinmeyen hatalar
      setError(lang === 'tr' ? 'Bir hata oluştu' : 'An error occurred');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <section className={styles.contact}>
      {/* Yüzen şekiller */}
      <div className={styles.contactFloatingShapes}>
        <div className={styles.contactShape1}></div>
        <div className={styles.contactShape2}></div>
        <div className={styles.contactShape3}></div>
        <div className={styles.contactShape4}></div>
        <div className={styles.contactShape5}></div>
        <div className={styles.contactShape6}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.contactContent}>
          <h2 className={`${styles.sectionTitle} ${styles.fadeIn}`}>
            {lang === 'tr' ? 'Birlikte Çalışalım' : "Let's Work Together"}
          </h2>
          <p className={styles.fadeIn}>
            {lang === 'tr' 
              ? 'Hazır mısınız? Harika bir şeyler yaratmak için görüşelim. Yeni projelerde işbirliği yapmak için her zaman heyecanlıyım.' 
              : "Ready to bring your vision to life? Let's discuss how we can create something amazing together. I'm always excited to take on new challenges and collaborate on innovative projects."}
          </p>
          
          <form onSubmit={handleSubmit} className={`${styles.contactForm} ${styles.fadeIn}`}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">{lang === 'tr' ? 'İsim' : 'Name'}</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder={lang === 'tr' ? 'Adınız soyadınız' : 'Your full name'} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">{lang === 'tr' ? 'E-posta' : 'Email'}</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="your.email@example.com" 
                  required 
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">{lang === 'tr' ? 'Telefon' : 'Phone'}</label>
              <input 
                type="text" 
                id="phone" 
                name="phone" 
                value={formData.phone || ''} 
                onChange={handleChange} 
                placeholder={lang === 'tr' ? 'Telefon numaranız' : 'Your phone number'} 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message">{lang === 'tr' ? 'Mesaj' : 'Message'}</label>
              <textarea 
                id="message" 
                name="message" 
                rows={6} 
                value={formData.message} 
                onChange={handleChange} 
                placeholder={lang === 'tr' ? 'Projeniz hakkında bana bilgi verin...' : 'Tell me about your project...'} 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={loading}
              style={{
                background: loading ? 'linear-gradient(135deg, #94a3b8, #64748b)' : '',
              }}
            >
              {loading
                ? lang === 'tr' ? 'Gönderiliyor...' : 'Sending...'
                : lang === 'tr' ? 'Mesaj Gönder' : 'Send Message'}
            </button>
          </form>

          {success && <p className={styles.successMsg}>{success}</p>}
          {error && <p className={styles.errorMsg}>{error}</p>}
        </div>
      </div>
    </section>
  );
}