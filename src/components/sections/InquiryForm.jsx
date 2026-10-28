import { useRef, useState } from 'react';
import { contact, inquiryForm, businessTypes } from '../../data/contact.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FIELD_ORDER = ['name', 'businessType', 'email', 'details'];

const EMPTY = { name: '', businessType: '', email: '', details: '' };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please tell us your name.';
  if (!values.businessType) errors.businessType = 'Choose the closest business type.';
  if (!values.email.trim()) errors.email = 'We need an email address to reply to.';
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = 'That email address doesn’t look right.';
  if (!values.details.trim()) errors.details = 'Share a few details about your project.';
  else if (values.details.trim().length < 12)
    errors.details = 'A little more detail helps — at least 12 characters.';
  return errors;
}

function Field({ id, label, error, children, required = true, full = false }) {
  return (
    <div className={`field${full ? ' field--full' : ''}${error ? ' has-error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required && (
          <span className="req" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      <p className="field__error" id={`${id}-error`}>
        {error ? (
          <>
            <span aria-hidden="true">—</span> {error}
          </>
        ) : (
          ''
        )}
      </p>
    </div>
  );
}

export function InquiryForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverMessage, setServerMessage] = useState('');
  const formRef = useRef(null);

  const hasEndpoint = Boolean(inquiryForm.endpoint);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const submitViaMailto = (submitted) => {
    const body = [
      `Name: ${submitted.name}`,
      `Business type: ${submitted.businessType}`,
      `Email: ${submitted.email}`,
      '',
      'Project details & goals:',
      submitted.details,
    ].join('\n');

    const url =
      `mailto:${contact.email.address}` +
      `?subject=${encodeURIComponent(inquiryForm.subject(submitted))}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = url;
    setStatus('success');
    setServerMessage(
      `Your email app should open with the message pre-filled — just press send. If nothing opened, email ${contact.email.address} directly or message us on WhatsApp.`
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setStatus('idle');
      const firstInvalid = FIELD_ORDER.find((key) => found[key]);
      formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus('loading');
    setServerMessage('');

    if (!hasEndpoint) {
      // No backend configured: hand off to the visitor's mail app (honest fallback).
      window.setTimeout(() => submitViaMailto(values), 150);
      return;
    }

    try {
      const response = await fetch(inquiryForm.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      setStatus('success');
      setServerMessage('Thank you — your inquiry has reached the studio. We reply within 24–48 hours.');
      setValues(EMPTY);
    } catch (error) {
      console.error('[QUINTIX] Inquiry submission failed:', error);
      setStatus('error');
      setServerMessage(
        `Something went wrong on the sending side. Please email ${contact.email.address} or use WhatsApp — we’ll pick it up from there.`
      );
    }
  };

  return (
    <div className="inquiry">
      <div className="inquiry__head">
        <h3 className="inquiry__title">Start an inquiry</h3>
        <p className="inquiry__subtitle">
          Tell us about the brand and where you want it to be seen. We reply to every serious
          inquiry within 24–48 hours.
        </p>
      </div>

      <form className="inquiry__form" ref={formRef} onSubmit={handleSubmit} noValidate>
        <Field id="name" label="Your Name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Alex Mercer"
            value={values.name}
            onChange={update}
            aria-invalid={Boolean(errors.name)}
            aria-describedby="name-error"
            required
          />
        </Field>

        <Field id="businessType" label="Business Type" error={errors.businessType}>
          <select
            id="businessType"
            name="businessType"
            value={values.businessType}
            onChange={update}
            aria-invalid={Boolean(errors.businessType)}
            aria-describedby="businessType-error"
            required
          >
            <option value="" disabled>
              Select your industry…
            </option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field id="email" label="Your Email" error={errors.email} full>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@brand.com"
            value={values.email}
            onChange={update}
            aria-invalid={Boolean(errors.email)}
            aria-describedby="email-error"
            required
          />
        </Field>

        <Field id="details" label="Project Details & Goals" error={errors.details} full>
          <textarea
            id="details"
            name="details"
            rows={5}
            placeholder="What do you sell, who do you want to reach, and what should social media do for the business?"
            value={values.details}
            onChange={update}
            aria-invalid={Boolean(errors.details)}
            aria-describedby="details-error"
            required
          />
        </Field>

        <div className="inquiry__footer">
          <p className="inquiry__hint">
            Required fields are marked with *. No spam, no mailing lists — your details are only
            used to reply to this inquiry.
          </p>
          <button type="submit" className="btn" disabled={status === 'loading'}>
            {status === 'loading' ? (
              <>
                <span className="spinner" aria-hidden="true" />
                <span>Opening email…</span>
              </>
            ) : (
              <span>Send Inquiry</span>
            )}
          </button>
        </div>

        {status === 'success' && (
          <div className="inquiry__status inquiry__status--success" role="status" aria-live="polite">
            <strong>Inquiry ready to send.</strong>
            {serverMessage}
          </div>
        )}

        {status === 'error' && (
          <div className="inquiry__status inquiry__status--error" role="alert">
            <strong>Delivery failed.</strong>
            {serverMessage}
          </div>
        )}

        <p className="inquiry__backend-note">
          {hasEndpoint ? (
            <>This form delivers submissions directly to the studio inbox.</>
          ) : (
            <>
              How this form works: no backend is configured, so submitting opens your email app
              with everything pre-filled (sent from your account to{' '}
              <code>{contact.email.address}</code>). To collect submissions automatically in a
              dashboard, set <code>endpoint</code> in <code>src/data/contact.js</code> to a form
              service URL (e.g. Formspree) — the form will then post to it instead.
            </>
          )}
        </p>
      </form>
    </div>
  );
}
