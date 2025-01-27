import { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UploadThingError } from "uploadthing/server";

const ImageUploader = ({ form }: { form: any }) => {
  const [images, setImages] = useState<string[]>(
    form.getValues("images") || []
  );
  const [isUploading, setIsUploading] = useState(false);

  // Handle image reordering with drag-and-drop
  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);

    setImages(reorderedImages);
    form.setValue("images", reorderedImages); // Update form state
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    form.setValue("images", updatedImages); // Update form state
  };

  // Handle file drag-and-drop
  const handleFileDrop = async (files: FileList) => {
    if (isUploading) return;

    setIsUploading(true);
    const fileArray = Array.from(files);
    try {
      const uploadedImages = await Promise.all(
        fileArray.map(async (file) => {
          // Mock upload process for demonstration
          // Replace this with your UploadThing logic if needed
          return URL.createObjectURL(file);
        })
      );

      const updatedImages = Array.from(new Set([...images, ...uploadedImages])); // Deduplicate
      setImages(updatedImages);
      form.setValue("images", updatedImages);
      toast({ description: "Images uploaded successfully!" });
    } catch (error) {
      toast({
        variant: "destructive",
        description: `ERROR! ${UploadThingError}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 md:flex-row">
      <FormField
        control={form.control}
        name="images"
        render={() => (
          <FormItem className="w-full">
            <FormLabel>Images</FormLabel>
            <Card>
              <CardContent className="space-y-4 mt-2 min-h-48">
                {/* Drag-and-drop area */}
                <div
                  className="border-2 border-dashed border-gray-300 p-4 rounded-md hover:border-gray-400 flex justify-center items-center cursor-pointer"
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileDrop(e.dataTransfer.files);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {isUploading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImagePlus className="mx-auto mb-2" size={32} />
                      <p>
                        Drag & Drop your images here or click below to upload
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Preview and Drag-and-Drop Reordering */}
                {images.length > 0 && (
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="images" direction="horizontal">
                      {(provided) => (
                        <div
                          className="flex items-center gap-3 overflow-x-auto"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {images.map((image, index) => (
                            <Draggable
                              key={image}
                              draggableId={image}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className="relative group"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Image
                                    src={image}
                                    alt="product image"
                                    className="w-20 h-20 object-cover object-center rounded-md shadow-md"
                                    width={100}
                                    height={100}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 hidden group-hover:block"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}

                {/* Upload Button */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-500">
                    You can upload up to 6 images (max: 512KB each).
                  </span>
                  <FormControl>
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        const uploadedImages = res.map((file) => file.url);
                        const updatedImages = Array.from(
                          new Set([...images, ...uploadedImages])
                        ); // Deduplicate
                        setImages(updatedImages);
                        form.setValue("images", updatedImages); // Update form state
                        toast({
                          description: "Images uploaded successfully!",
                        });
                      }}
                      onUploadError={(error: Error) => {
                        toast({
                          variant: "destructive",
                          description: `ERROR! ${error.message}`,
                        });
                      }}
                    />
                  </FormControl>
                </div>
              </CardContent>
            </Card>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ImageUploader;
