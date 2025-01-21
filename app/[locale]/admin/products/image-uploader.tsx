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
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const ImageUploader = ({ form }: { form: any }) => {
  const [images, setImages] = useState<string[]>(
    form.getValues("images") || []
  );

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
                {images.length > 0 && (
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="images" direction="horizontal">
                      {(provided) => (
                        <div
                          className="flex items-center gap-3"
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
                                  className="relative"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Image
                                    src={image}
                                    alt="product image"
                                    className="w-20 h-20 object-cover object-center rounded-sm"
                                    width={100}
                                    height={100}
                                  />
                                  {/* Remove Icon */}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
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
                    You can upload multiple images (max: 4MB each).
                  </span>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2 px-4 py-2"
                    >
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
                        multiple // Enable multiple file selection
                      />
                      <ImagePlus size={16} />
                      <span>Upload Images</span>
                    </Button>
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
