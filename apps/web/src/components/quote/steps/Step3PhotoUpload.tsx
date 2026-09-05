'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, X, Upload } from 'lucide-react'
import type { QuoteFormData } from '../QuoteWizard'

const PHOTO_GUIDES = [
  '설치 예정 위치 전경',
  '설치 예정 위치 전체',
  '설치 위치 클로즈업',
]

export function Step3PhotoUpload() {
  const { setValue, formState: { errors } } = useFormContext<QuoteFormData>()
  const photos: File[] = useWatch({ name: 'photos' }) ?? []
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const newFiles = Array.from(files).filter(
        (f) => f.type.startsWith('image/') && f.size < 20 * 1024 * 1024,
      )
      setValue('photos', [...photos, ...newFiles].slice(0, 10))
    },
    [photos, setValue],
  )

  const removePhoto = (idx: number) => {
    setValue('photos', photos.filter((_, i) => i !== idx))
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-1 text-label font-semibold text-wk-ink">
          현장 사진 <span className="font-medium text-wk-ink3">(선택)</span>
        </p>
        <p className="wk-cap">
          지금 사진이 없으셔도 됩니다. 넣어주시면 견적 범위를 더 좁혀 드릴 수 있습니다.
          최대 10장 · JPG/PNG/HEIC · 장당 20MB 이하.
        </p>
      </div>

      {/* 권장 사진 가이드 */}
      <div className="grid grid-cols-3 gap-2">
        {PHOTO_GUIDES.map((g, i) => (
          <div key={g} className="flex items-center gap-2 rounded-lg border border-wk-line bg-white p-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-wk-cta/20 text-caption font-bold text-wk-cta">
              {i + 1}
            </span>
            <span className="text-caption text-wk-ink3">{g}</span>
          </div>
        ))}
      </div>

      {/* 드롭존 (키보드 접근 가능) */}
      <div
        role="button"
        tabIndex={0}
        aria-label="사진 선택 또는 드래그하여 업로드"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-wk-line2 p-8 text-center transition-all hover:border-wk-cta/50 hover:bg-wk-blue/5"
      >
        <Upload size={28} className="mx-auto mb-3 text-wk-ink3" aria-hidden="true" />
        <p className="text-sm text-wk-ink2">클릭하거나 사진을 여기에 드래그하세요</p>
        <p className="mt-1 text-xs text-wk-ink3">스마트폰 사진도 바로 업로드 가능합니다</p>
      </div>

      {/* 모바일 우선: 사진 촬영 / 앨범 선택 버튼 (엄지 영역, 큰 탭 타깃) */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-xl border border-wk-line2 py-3 text-sm font-semibold text-wk-ink2 transition-all hover:bg-wk-bgFaint active:scale-95"
        >
          <Camera size={16} className="text-wk-cta" />
          사진 촬영
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-xl border border-wk-line2 py-3 text-sm font-semibold text-wk-ink2 transition-all hover:bg-wk-bgFaint active:scale-95"
        >
          <Upload size={16} className="text-wk-cta" />
          앨범에서 선택
        </button>
      </div>

      {/* 앨범 다중 선택 */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {/* 모바일 후면 카메라 즉시 촬영 (데스크톱에선 파일 선택으로 폴백) */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* 미리보기 */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((file, idx) => (
            <div key={idx} className="group relative aspect-square">
              <PhotoPreview file={file} alt={`사진 ${idx + 1}`} />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-100 transition-opacity focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label={`사진 ${idx + 1} 삭제`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {photos.length < 10 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-wk-line text-wk-ink3 hover:border-wk-line2"
            >
              <Camera size={20} />
            </button>
          )}
        </div>
      )}

      <p className={`wk-cap ${photos.length > 0 ? '!text-wk-ok' : ''}`}>
        {photos.length > 0
          ? `${photos.length}장 첨부됨`
          : '사진 없이 다음 단계로 넘어가셔도 됩니다.'}
      </p>

      {errors.photos && (
        <p role="alert" className="text-label text-wk-bad">{errors.photos.message as string}</p>
      )}
    </div>
  )
}

function PhotoPreview({ file, alt }: { file: File; alt: string }) {
  const [src, setSrc] = useState<string>()

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    setSrc(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  if (!src) {
    return <div className="h-full w-full rounded-xl bg-wk-bg" />
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full rounded-xl object-cover"
    />
  )
}
