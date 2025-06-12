'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Image, User, X } from "lucide-react"
import ReactCrop, {
    Crop,
    PixelCrop,
    centerCrop,
    makeAspectCrop
} from "react-image-crop"
import 'react-image-crop/dist/ReactCrop.css'

interface UploadImgBlockProps {
    onImageSelect: (file: File | null) => void
    selectedFile: File | null
}

const ASPECT_RATIO = 16 / 9
const MIN_DIMENSION = 150

export default function UploadCourseBannerBlock({ onImageSelect, selectedFile }: UploadImgBlockProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [dialogOpen, setDialogOpen] = useState(false)
    const imgRef = useRef<HTMLImageElement | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    // При изменении selectedFile обновляем preview
    useEffect(() => {
        if (selectedFile) {
            setPreviewUrl(URL.createObjectURL(selectedFile))
        } else {
            setPreviewUrl(null)
        }
    }, [selectedFile])

    const openFileDialog = () => fileInputRef.current?.click()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPreviewUrl(URL.createObjectURL(file))
            setDialogOpen(true)
        }
    }

    const onImageLoaded = (img: HTMLImageElement) => {
        imgRef.current = img
        const { width, height } = img
        const crop = makeAspectCrop({ unit: '%', width: 90 }, ASPECT_RATIO, width, height)
        setCrop(centerCrop(crop, width, height))
        return false
    }

    const cropImage = async () => {
        const image = imgRef.current
        const crop = completedCrop
        if (!image || !crop?.width || !crop?.height) return

        const canvas = document.createElement('canvas')
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        )

        canvas.toBlob(blob => {
            if (blob) {
                const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' })
                onImageSelect(file)
                setDialogOpen(false)
            }
        }, 'image/jpeg')
    }

    // Сброс выбранного файла
    const handleReset = () => {
        setPreviewUrl(null)
        onImageSelect(null)
        setCrop(undefined)
        setCompletedCrop(undefined)
        imgRef.current = null
        setDialogOpen(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // Открытие модалки при клике на превью
    const handleImageClick = () => {
        setDialogOpen(true)
    }

    return (
        <div className="w-full flex flex-col items-center gap-4">
            {previewUrl ? (
                <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden shadow-lg cursor-pointer ring-2 ring-primary hover:ring-primary transition"
                    onClick={handleImageClick}
                    title="Click to edit image"
                >
                    <img
                        src={previewUrl}
                        alt="Course Banner"
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div
                    className="w-full max-w-2xl aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400 cursor-pointer hover:border-primary transition"
                    onClick={openFileDialog}
                    title="Click to upload image"
                >
                    <Image className="w-16 h-16 text-muted-foreground" />
                </div>
            )}

            <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader className="flex justify-between items-center">
                        <DialogTitle>Crop Image</DialogTitle>
                    </DialogHeader>

                    <div className="p-4 flex flex-col gap-4 items-center border-dashed border-2 rounded-lg">
                        {previewUrl ? (
                            <ReactCrop
                                crop={crop}
                                onChange={setCrop}
                                onComplete={c => setCompletedCrop(c)}
                                aspect={ASPECT_RATIO}
                                minWidth={MIN_DIMENSION}
                            >
                                <img
                                    src={previewUrl}
                                    ref={imgRef}
                                    onLoad={(e) => onImageLoaded(e.currentTarget)}
                                    alt="Crop me"
                                />
                            </ReactCrop>
                        ) : (
                            <div
                                className="bg-secondary rounded-full max-h-64 w-64 h-64 flex flex-col justify-center items-center cursor-pointer"
                                onClick={handleImageClick}
                            >
                                <User className="h-3/5 w-3/5" />
                            </div>
                        )}
                        <Input type="file" accept="image/*" id="file-input" onChange={handleFileChange} className="hidden" />
                    </div>

                    <Button onClick={cropImage} className="mt-4">
                        Crop & Save
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}
