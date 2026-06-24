'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applySchema, ApplyFormData } from '@/lib/validations';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ApplyFormProps {
  locale: 'es' | 'en';
}

/**
 * ApplyForm Component
 *
 * Producer application form with React Hook Form + Zod validation.
 * Includes honeypot, server-side error handling, and success redirect.
 *
 * Features:
 * - Client-side validation with Zod schema
 * - All fields with error display
 * - Honeypot field for anti-spam
 * - Success message with auto-redirect
 * - Rate limit and server error handling
 * - Loading state during submission
 *
 * @example
 * <ApplyForm locale="es" />
 */
export function ApplyForm({ locale }: ApplyFormProps) {
  const t = useTranslations('form.apply');
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formIsSubmitting },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
    mode: 'onBlur',
    defaultValues: {
      _gotcha: '',
    },
  });

  const onSubmit = async (data: ApplyFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setServerError(t('errors.rateLimit'));
        } else if (response.status === 400) {
          // Field validation errors already shown by React Hook Form
          setServerError(null);
        } else {
          setServerError(result.error || t('errors.serverError'));
        }
        return;
      }

      // Success - redirect to success page after short delay
      setTimeout(() => {
        router.push(locale === 'en' ? '/en/apply/success' : '/apply/success');
      }, 500);
    } catch (error) {
      console.error('Form submission error:', error);
      setServerError(t('errors.serverError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Server Error Message */}
      {serverError && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 bg-naranja-soft border-l-4 border-naranja text-naranja rounded-card"
        >
          <p className="font-semibold">{t('errors.title')}</p>
          <p className="text-sm mt-1">{serverError}</p>
        </div>
      )}

      {/* Full Name */}
      <Input
        id="fullName"
        label={t('label.fullName')}
        placeholder={t('placeholder.fullName')}
        required
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      {/* Email */}
      <Input
        id="email"
        type="email"
        label={t('label.email')}
        placeholder={t('placeholder.email')}
        required
        error={errors.email?.message}
        {...register('email')}
      />

      {/* Phone */}
      <Input
        id="phone"
        type="tel"
        label={t('label.phone')}
        placeholder={t('placeholder.phone')}
        required
        error={errors.phone?.message}
        {...register('phone')}
      />

      {/* Craft Description */}
      <TextArea
        id="craftDescription"
        label={t('label.craftDescription')}
        placeholder={t('placeholder.craftDescription')}
        maxLength={500}
        required
        error={errors.craftDescription?.message}
        showCharCount
        {...register('craftDescription')}
      />

      {/* Category */}
      <Select
        id="category"
        label={t('label.category')}
        placeholder={t('placeholder.category')}
        options={[
          { value: 'moda', label: t('options.category.moda') },
          { value: 'cuero', label: t('options.category.cuero') },
          { value: 'alpargatas', label: t('options.category.alpargatas') },
          { value: 'joyeria', label: t('options.category.joyeria') },
          { value: 'ceramica', label: t('options.category.ceramica') },
          { value: 'cosmetica', label: t('options.category.cosmetica') },
          { value: 'hogar', label: t('options.category.hogar') },
          { value: 'otra', label: t('options.category.otra') },
        ]}
        required
        error={errors.category?.message}
        {...register('category')}
      />

      {/* Country */}
      <Select
        id="country"
        label={t('label.country')}
        placeholder={t('placeholder.country')}
        options={[
          { value: 'ES', label: t('options.country.ES') },
          { value: 'PT', label: t('options.country.PT') },
          { value: 'FR', label: t('options.country.FR') },
          { value: 'IT', label: t('options.country.IT') },
          { value: 'DE', label: t('options.country.DE') },
          { value: 'NL', label: t('options.country.NL') },
          { value: 'BE', label: t('options.country.BE') },
          { value: 'PL', label: t('options.country.PL') },
          { value: 'SE', label: t('options.country.SE') },
          { value: 'DK', label: t('options.country.DK') },
          { value: 'AT', label: t('options.country.AT') },
          { value: 'FI', label: t('options.country.FI') },
          { value: 'GR', label: t('options.country.GR') },
          { value: 'HU', label: t('options.country.HU') },
          { value: 'CZ', label: t('options.country.CZ') },
          { value: 'RO', label: t('options.country.RO') },
          { value: 'EU', label: t('options.country.EU') },
        ]}
        required
        error={errors.country?.message}
        {...register('country')}
      />

      {/* Website */}
      <Input
        id="website"
        type="url"
        label={t('label.website')}
        placeholder={t('placeholder.website')}
        error={errors.website?.message}
        {...register('website')}
      />

      {/* Instagram */}
      <Input
        id="instagram"
        label={t('label.instagram')}
        placeholder={t('placeholder.instagram')}
        error={errors.instagram?.message}
        {...register('instagram')}
      />

      {/* Referral Source */}
      <Select
        id="referral"
        label={t('label.referral')}
        placeholder={t('placeholder.referral')}
        options={[
          { value: 'instagram', label: t('options.referral.instagram') },
          { value: 'google', label: t('options.referral.google') },
          { value: 'recommendation', label: t('options.referral.recommendation') },
          { value: 'press', label: t('options.referral.press') },
          { value: 'event', label: t('options.referral.event') },
          { value: 'other', label: t('options.referral.other') },
        ]}
        error={errors.referral?.message}
        {...register('referral')}
      />

      {/* Honeypot (hidden anti-spam field) */}
      <input
        id="_gotcha"
        type="text"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
        }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        {...register('_gotcha')}
      />

      {/* Privacy Policy Checkbox */}
      <Checkbox
        id="privacyAccepted"
        label={
          <span>
            {t('label.privacy')}{' '}
            <a
              href={locale === 'en' ? '/en/privacy' : '/privacy'}
              className="text-naranja underline hover:text-naranja-papaya font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('label.privacyLink')}
            </a>
          </span>
        }
        required
        error={errors.privacyAccepted?.message}
        {...register('privacyAccepted')}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary-orange"
        size="md"
        disabled={isSubmitting || formIsSubmitting}
        isLoading={isSubmitting || formIsSubmitting}
        className="w-full"
      >
        {t('submit')}
      </Button>
    </form>
  );
}
