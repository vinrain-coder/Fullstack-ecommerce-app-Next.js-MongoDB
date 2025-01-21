"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { IProduct } from "@/lib/db/models/product.model";
import { UploadButton } from "@/lib/uploadthing";
import { ProductInputSchema, ProductUpdateSchema } from "@/lib/validator";
import { Checkbox } from "@/components/ui/checkbox";
import { toSlug } from "@/lib/utils";
import { IProductInput } from "@/types";
import { ImagePlus, Trash, Upload, X } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";

const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent form submission on Enter key press
  }
};

const productDefaultValues: IProductInput =
  process.env.NODE_ENV === "development"
    ? {
        name: "Sample Product",
        slug: "sample-product",
        category: "Sample Category",
        images: ["/images/p11-1.jpg"],
        brand: "Sample Brand",
        description: "This is a sample description of the product.",
        price: 99.99,
        listPrice: 0,
        countInStock: 15,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }
    : {
        name: "",
        slug: "",
        category: "",
        images: [],
        brand: "",
        description: "",
        price: 0,
        listPrice: 0,
        countInStock: 0,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      };

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: IProduct;
  productId?: string;
}) => {
  const router = useRouter();

  const form = useForm<IProductInput>({
    resolver:
      type === "Update"
        ? zodResolver(ProductUpdateSchema)
        : zodResolver(ProductInputSchema),
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  });

  const { toast } = useToast();
  async function onSubmit(values: IProductInput) {
    if (type === "Create") {
      const res = await createProduct(values);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        toast({
          description: res.message,
        });
        router.push(`/admin/products`);
      }
    }
    if (type === "Update") {
      if (!productId) {
        router.push(`/admin/products`);
        return;
      }
      const res = await updateProduct({ ...values, _id: productId });
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
      } else {
        router.push(`/admin/products`);
      }
    }
  }
  const images = form.watch("images");

  const ImageGallery = ({
    onSelect,
  }: {
    onSelect: (selectedImages: string[]) => void;
  }) => {
    // Logic for opening the gallery and selecting multiple images
    return (
      <div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              const selectedImages = Array.from(files).map((file) =>
                URL.createObjectURL(file)
              );
              onSelect(selectedImages); // Send selected images back to parent component
            }
          }}
        />
      </div>
    );
  };

  const ImageUploader = () => {
    const { control, setValue, getValues } = useFormContext();
    const [images, setImages] = useState<string[]>(getValues("images") || []);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const handleOnDragEnd = (result: any) => {
      if (!result.destination) return;
      const reorderedImages = Array.from(images);
      const [movedImage] = reorderedImages.splice(result.source.index, 1);
      reorderedImages.splice(result.destination.index, 0, movedImage);
      setImages(reorderedImages);
      setValue("images", reorderedImages);
    };

    const handleRemoveImage = (index: number) => {
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      setValue("images", updatedImages);
    };

    const handleUploadComplete = (res: { url: string }[]) => {
      const uploadedImages = res.map((file) => file.url);
      const updatedImages = [...images, ...uploadedImages];
      setImages(updatedImages);
      setValue("images", updatedImages);
    };

    const handleOpenGallery = () => {
      setIsGalleryOpen(true);
    };

    const handleGalleryClose = () => {
      setIsGalleryOpen(false);
    };

    const handleImageSelection = (selectedImages: string[]) => {
      const updatedImages = [...images, ...selectedImages];
      setImages(updatedImages);
      setValue("images", updatedImages);
      setIsGalleryOpen(false); // Close gallery after selecting images
    };

    return (
      <Controller
        name="images"
        control={control}
        render={() => (
          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="space-y-4 p-4 min-h-[150px]">
                {images.length > 0 && (
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable
                      droppableId="images"
                      direction="horizontal"
                      isDropDisabled={false} // Ensure this is a boolean
                    >
                      {(provided) => (
                        <div
                          className="flex space-x-2"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {images.map((image, index) => (
                            <Draggable
                              key={image}
                              draggableId={image}
                              index={index}
                              isDragDisabled={false} // Ensure this is also a boolean
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
                                    alt={`Image ${index}`}
                                    width={100}
                                    height={100}
                                    className="rounded"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 text-red-500"
                                  >
                                    <X />
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

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent form submission
                      handleOpenGallery(); // Open gallery on click
                    }}
                  >
                    <ImagePlus className="mr-2 w-4 h-4" /> Add Images
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isGalleryOpen && <ImageGallery onSelect={handleImageSelection} />}
          </div>
        )}
      />
    );
  };

  return (
    <FormProvider {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        className="space-y-8"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>

                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter product slug"
                      className="pl-8"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue("slug", toSlug(form.getValues("name")));
                      }}
                      className="absolute right-2 top-2.5"
                    >
                      Generate
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product brand" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="listPrice"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>List Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product list price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Net Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="countInStock"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Count In Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter product count in stock"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tags Input */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {field.value?.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg p-2"
                    >
                      <Input
                        autoFocus={index === field.value.length - 1}
                        className="w-full bg-transparent focus:outline-none focus:ring-2 rounded-lg"
                        value={tag}
                        onChange={(e) => {
                          const updatedTags = [...field.value];
                          updatedTags[index] = e.target.value;
                          field.onChange(updatedTags);
                        }}
                        placeholder="Enter a tag"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.preventDefault(); // Prevent form submission on Enter
                        }}
                      />
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          const updatedTags = field.value?.filter(
                            (_, i) => i !== index
                          );
                          field.onChange(updatedTags);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const updatedTags = [...(field.value || []), ""];
                    field.onChange(updatedTags);
                  }}
                  className="mt-2 w-full"
                >
                  Add Tag
                </Button>
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-5 md:flex-row items-center justify-between">
          {/* Colors Input */}
          <FormField
            control={form.control}
            name="colors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colors</FormLabel>
                <div className="space-y-2 grid grid-cols-2">
                  {field.value?.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg p-2"
                    >
                      <Input
                        autoFocus={index === field.value.length - 1} // Focus on the last added color
                        className="w-full rounded-lg"
                        value={color}
                        onChange={(e) => {
                          const updatedColors = [...field.value];
                          updatedColors[index] = e.target.value;
                          field.onChange(updatedColors);
                        }}
                        placeholder="Enter a color"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.preventDefault(); // Prevent form submission on Enter
                        }}
                      />
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          const updatedColors = field.value?.filter(
                            (_, i) => i !== index
                          );
                          field.onChange(updatedColors);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const updatedColors = [...(field.value || []), ""];
                      field.onChange(updatedColors);
                    }}
                    className="mt-2 w-full"
                  >
                    Add Color
                  </Button>
                </div>
              </FormItem>
            )}
          />

          {/* Sizes Input */}
          <FormField
            control={form.control}
            name="sizes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sizes</FormLabel>
                <div className="space-y-2 grid grid-cols-2">
                  {field.value?.map((size, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg p-2"
                    >
                      <Input
                        autoFocus={index === field.value.length - 1} // Focus on the last added size
                        className="w-full rounded-lg"
                        value={size}
                        onChange={(e) => {
                          const updatedSizes = [...field.value];
                          updatedSizes[index] = e.target.value;
                          field.onChange(updatedSizes);
                        }}
                        placeholder="Enter a size"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.preventDefault(); // Prevent form submission on Enter
                        }}
                      />
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          const updatedSizes = field.value?.filter(
                            (_, i) => i !== index
                          );
                          field.onChange(updatedSizes);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const updatedSizes = [...(field.value || []), ""];
                      field.onChange(updatedSizes);
                    }}
                    className="mt-2 w-full"
                  >
                    Add Size
                  </Button>
                </div>
              </FormItem>
            )}
          />
        </div>

        <ImageUploader />
        <div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add the product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> other users and organizations to
                  link to them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="space-x-2 items-center">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Is Published?</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting ? "Submitting..." : `${type} Product `}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProductForm;
