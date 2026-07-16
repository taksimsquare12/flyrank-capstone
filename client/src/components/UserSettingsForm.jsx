import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

const themeOptions = ['Light', 'Dark'];

const userSettingsResolver = async (values) => {
  const errors = {};
  const normalizedUsername = values.username?.trim() ?? '';
  const normalizedEmail = values.email?.trim() ?? '';

  if (!normalizedUsername) {
    errors.username = { type: 'required', message: 'Username is required.' };
  } else if (normalizedUsername.length < 3) {
    errors.username = { type: 'minLength', message: 'Username must be at least 3 characters.' };
  } else if (!/^[a-zA-Z0-9]+$/.test(normalizedUsername)) {
    errors.username = { type: 'pattern', message: 'Username may only contain letters and numbers.' };
  }

  if (!normalizedEmail) {
    errors.email = { type: 'required', message: 'Email is required.' };
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    errors.email = { type: 'pattern', message: 'Please enter a valid email address.' };
  }

  if (!themeOptions.includes(values.theme)) {
    errors.theme = { type: 'validate', message: 'Please select a valid theme preference.' };
  }

  return {
    values: Object.keys(errors).length ? {} : {
      username: normalizedUsername,
      email: normalizedEmail,
      theme: values.theme,
      newsletter: Boolean(values.newsletter),
    },
    errors,
  };
};

const UserSettingsForm = () => {
  const [submittedData, setSubmittedData] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      theme: themeOptions[0],
      newsletter: false,
    },
    resolver: userSettingsResolver,
  });

  const onSubmit = (data) => {
    setSubmittedData(data);
  };

  return (
    <div style={{ maxWidth: 540, margin: '0 auto', padding: 24 }}>
      <h2>User Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="username">Username</label>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <input
                id="username"
                type="text"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                aria-invalid={errors.username ? 'true' : 'false'}
              />
            )}
          />
          {errors.username && (
            <p style={{ color: '#c53030', marginTop: 6 }}>{errors.username.message}</p>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label htmlFor="email">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                id="email"
                type="email"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
            )}
          />
          {errors.email && (
            <p style={{ color: '#c53030', marginTop: 6 }}>{errors.email.message}</p>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label htmlFor="theme">Theme Preference</label>
          <Controller
            name="theme"
            control={control}
            render={({ field }) => (
              <select
                id="theme"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                aria-invalid={errors.theme ? 'true' : 'false'}
              >
                {themeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.theme && (
            <p style={{ color: '#c53030', marginTop: 6 }}>{errors.theme.message}</p>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <Controller
            name="newsletter"
            control={control}
            render={({ field }) => (
              <label htmlFor="newsletter" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  id="newsletter"
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  onBlur={field.onBlur}
                />
                Newsletter Subscription
              </label>
            )}
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          style={{ padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Save Settings
        </button>
      </form>

      {submittedData && (
        <div
          role="alert"
          style={{ marginTop: 24, padding: 16, backgroundColor: '#ecfccb', borderRadius: 8 }}
        >
          <strong>Settings saved successfully!</strong>
          <pre style={{ marginTop: 12, overflowX: 'auto' }}>
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default UserSettingsForm;
