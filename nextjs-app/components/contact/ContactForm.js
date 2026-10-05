'use client';

import { useRef, useState } from 'react';

const EMPTY = { name: '', email: '', phone: '', projectType: '', timeline: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form. Posts the same payload as before to the existing endpoint
 * (POST {NEXT_PUBLIC_API_URL}/contact: name, email, phone, projectType,
 * timeline, message). Required fields match the backend (name, email,
 * message). Visible labels, errors as text (never colour alone), linked to
 * the fields with aria-describedby; focus moves to the first invalid field.
 */
export default function ContactForm({ copy, privacyHref, email }) {
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef(null);
  const doneRef = useRef(null);

  const set = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!data.name.trim()) er.name = copy.errName;
    if (!data.email.trim()) er.email = copy.errEmail;
    else if (!EMAIL_RE.test(data.email.trim())) er.email = copy.errEmailInvalid;
    if (!data.message.trim()) er.message = copy.errMessage;
    return er;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    const firstInvalid = ['name', 'email', 'message'].find((k) => er[k]);
    if (firstInvalid) {
      formRef.current?.elements[firstInvalid]?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, name: data.name.trim(), email: data.email.trim() }),
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success) {
        setDone(true);
        setData(EMPTY);
        requestAnimationFrame(() => doneRef.current?.focus());
      } else {
        setErrors({ submit: true });
      }
    } catch {
      setErrors({ submit: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="form-done" role="status">
        <h2 className="t-h3" ref={doneRef} tabIndex={-1}>{copy.successTitle}</h2>
        <p>{copy.successText}</p>
        <button type="button" className="btn btn--ghost" onClick={() => setDone(false)}>{copy.another}</button>
      </div>
    );
  }

  const field = (name, label, { type = 'text', required = false, autoComplete, hint, as = 'input', children } = {}) => {
    const err = errors[name];
    const describedBy = [hint && `${name}-hint`, err && `${name}-err`].filter(Boolean).join(' ') || undefined;
    const common = {
      id: `cf-${name}`,
      name,
      value: data[name],
      onChange: set,
      'aria-invalid': err ? 'true' : undefined,
      'aria-describedby': describedBy,
      ...(required ? { 'aria-required': 'true' } : {}),
    };
    return (
      <div className="field">
        <label htmlFor={`cf-${name}`}>
          {label}
          {!required && <span className="opt-hint"> {copy.optional}</span>}
        </label>
        {hint && <p id={`${name}-hint`} className="t-meta">{hint}</p>}
        {as === 'textarea' && <textarea {...common} rows={7} />}
        {as === 'select' && <select {...common}>{children}</select>}
        {as === 'input' && <input {...common} type={type} autoComplete={autoComplete} />}
        {err && <p id={`${name}-err`} className="err">{err}</p>}
      </div>
    );
  };

  const errorCount = Object.keys(errors).filter((k) => k !== 'submit' && errors[k]).length;

  return (
    <form ref={formRef} className="form" noValidate onSubmit={onSubmit}>
      <h2 className="t-h2">{copy.title}</h2>
      <p className="form-note">{copy.required}</p>
      {errorCount > 0 && <p className="form-alert" role="alert">{copy.summary}</p>}
      <div className="row2">
        {field('name', copy.name, { required: true, autoComplete: 'name' })}
        {field('email', copy.email, { required: true, type: 'email', autoComplete: 'email' })}
      </div>
      <div className="row2">
        {field('phone', copy.phone, { type: 'tel', autoComplete: 'tel' })}
        {field('projectType', copy.projectType, {
          as: 'select',
          children: [
            <option key="" value="">{copy.select}</option>,
            ...Object.entries(copy.types).map(([value, label]) => <option key={value} value={value}>{label}</option>),
          ],
        })}
      </div>
      {field('timeline', copy.timeline, { hint: copy.timelineHint })}
      {field('message', copy.message, { required: true, as: 'textarea', hint: copy.messageHint })}
      <p className="form-note">
        {copy.privacy} <a className="link" href={privacyHref}>{copy.privacyLink}</a>.
      </p>
      {errors.submit && (
        <p className="form-alert" role="alert">
          {copy.errSubmit} <a className="link" href={`mailto:${email}`}>{email}</a>.
        </p>
      )}
      <div>
        <button type="submit" className="btn" disabled={submitting} aria-disabled={submitting}>
          {submitting ? copy.sending : copy.submit}
        </button>
      </div>
    </form>
  );
}
