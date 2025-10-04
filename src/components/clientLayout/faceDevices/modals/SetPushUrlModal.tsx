'use client'
import React, { FC, useState, useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useLocale, useTranslations } from 'next-intl'
import { z } from 'zod'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { setPushUrlSchema } from '@/schemas/setPushUrlSchema'
import { SetPushUrlRequest, FaceDevice } from '@/types/faceDevicesTypes'
import { usePushUrlModalStore } from '@/hooks/useModalStore'
import { setFaceDevicePushUrl } from '@/app/[locale]/actions/(faceDevices)/setFaceDevicePushUrl'

interface SetPushUrlModalProps {
  faceDevice: FaceDevice
}

const SetPushUrlModal: FC<SetPushUrlModalProps> = ({ faceDevice }) => {
  const locale = useLocale()
  const t = useTranslations('FaceDevices.PushUrlModal')
  const { open, closeModal, onSuccess } = usePushUrlModalStore()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, handleSubmit, reset, setValue } = useForm<z.infer<typeof setPushUrlSchema>>({
    resolver: zodResolver(setPushUrlSchema),
    mode: 'onChange',
    defaultValues: {
      url: faceDevice.push_url?.url || '',
      protocol_type: faceDevice.push_url?.protocol_type || 'HTTP',
      addressing_format_type: faceDevice.push_url?.addressing_format_type || 'hostname',
      host_name: faceDevice.push_url?.host_name || '',
      port_no: faceDevice.push_url?.port_no || ''
    }
  })

  // Pre-fill form with face device push_url data when modal opens
  useEffect(() => {
    if (open && faceDevice) {
      // Use push_url data if available, otherwise fallback to device IP/port
      setValue('url', faceDevice.push_url?.url || '')
      setValue('protocol_type', faceDevice.push_url?.protocol_type || 'HTTP')
      setValue('addressing_format_type', faceDevice.push_url?.addressing_format_type || 'hostname')
      setValue('host_name', faceDevice.push_url?.host_name || '')
      setValue('port_no', faceDevice.push_url?.port_no || '')
    }
  }, [open, faceDevice, setValue])

  const handleCancel = () => {
    reset()
    closeModal()
  }

  const onSubmit: SubmitHandler<z.infer<typeof setPushUrlSchema>> = async (data) => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      const submitData: SetPushUrlRequest = {
        url: data.url,
        protocol_type: data.protocol_type,
        addressing_format_type: data.addressing_format_type,
        host_name: data.host_name,
        port_no: data.port_no
      }

      await setFaceDevicePushUrl(submitData, faceDevice.id, locale)

      toast.success(t('messages.success'))
      if (typeof onSuccess === 'function') {
        onSuccess()
      }
      closeModal()
      reset()
    } catch (error: unknown) {
      console.error('Set push URL error:', error)

      // Handle validation errors specifically
      if (error && typeof error === 'object' && 'status' in error && 'data' in error) {
        const errorWithStatus = error as { status: number; data: { errors?: Record<string, string | string[]>; message?: string } }
        if (errorWithStatus.status === 422 && errorWithStatus.data?.errors) {
          // Show specific field errors
          Object.keys(errorWithStatus.data.errors).forEach(field => {
            const fieldErrors = errorWithStatus.data.errors![field]
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach(errorMsg => {
                toast.error(errorMsg)
              })
            } else {
              toast.error(fieldErrors)
            }
          })
        } else {
          // Show the backend error message
          toast.error(errorWithStatus.data?.message || t('messages.error'))
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        // Handle Error objects
        toast.error((error as Error).message)
      } else {
        // Fallback error message
        toast.error(t('messages.error'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t('title', { deviceName: faceDevice.name })}
          </DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* URL Field */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {t('labels.url')} <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="url"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    value={String(field.value || '')}
                    placeholder={t('placeholders.url')}
                    className={`h-11 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {fieldState.error && (
                    <span className="text-destructive text-xs">{fieldState.error.message}</span>
                  )}
                </>
              )}
            />
          </div>

          {/* Protocol Type and Addressing Format Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Protocol Type Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {t('labels.protocolType')} <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="protocol_type"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={`h-11 w-full ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
                        <SelectValue placeholder={t('placeholders.protocolType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HTTP">HTTP</SelectItem>
                        <SelectItem value="HTTPS">HTTPS</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <span className="text-destructive text-xs">{fieldState.error.message}</span>
                    )}
                  </>
                )}
              />
            </div>

            {/* Addressing Format Type Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {t('labels.addressingFormat')} <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="addressing_format_type"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={`h-11 w-full ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
                        <SelectValue placeholder={t('placeholders.addressingFormat')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hostname">{t('options.hostname')}</SelectItem>
                        <SelectItem value="ipaddress">{t('options.ipaddress')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <span className="text-destructive text-xs">{fieldState.error.message}</span>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Host Name and Port Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Host Name Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {t('labels.hostName')} <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="host_name"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      value={String(field.value || '')}
                      placeholder={t('placeholders.hostName')}
                      className={`h-11 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {fieldState.error && (
                      <span className="text-destructive text-xs">{fieldState.error.message}</span>
                    )}
                  </>
                )}
              />
            </div>

            {/* Port Number Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {t('labels.portNo')} <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="port_no"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      value={String(field.value || '')}
                      placeholder={t('placeholders.portNo')}
                      className={`h-11 ${fieldState.error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {fieldState.error && (
                      <span className="text-destructive text-xs">{fieldState.error.message}</span>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {t('buttons.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  {t('buttons.updating')}
                </div>
              ) : (
                t('buttons.update')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SetPushUrlModal
