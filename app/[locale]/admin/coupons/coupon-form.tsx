"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { CouponInputSchema, DiscountType } from "@/lib/validator";
import { createCoupon, updateCoupon } from "@/lib/actions/coupon.actions";
import { ICouponInput } from "@/types";

const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};

const couponDefaultValues: ICouponInput = {
  code: "",
  discountType: DiscountType.PERCENTAGE,
  discountValue: 0,
  minPurchase: 0,
  expiryDate: undefined,
  maxUsage: 0,
  isActive: true,
};

const CouponForm = ({
  type,
  coupon,
  couponId,
}: {
  type: "Create" | "Update";
  coupon?: ICouponInput;
  couponId?: string;
}) => {
  const router = useRouter();

  const form = useForm<ICouponInput>({
    resolver: zodResolver(CouponInputSchema),
    defaultValues: coupon && type === "Update" ? coupon : couponDefaultValues,
  });

  async function onSubmit(values: ICouponInput) {
    const formattedValues = {
      ...values,
      expiryDate: values.expiryDate ? new Date(values.expiryDate) : undefined,
    };

    if (type === "Create") {
      const res = await createCoupon(formattedValues);
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success("Coupon Created Successfully!");
        router.push(`/admin/coupons`);
      }
    }
    if (type === "Update") {
      if (!couponId) {
        router.push(`/admin/coupons`);
        return;
      }
      const res = await updateCoupon({ ...formattedValues, _id: couponId });
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success("Coupon Updated Successfully!");
        router.push(`/admin/coupons`);
      }
    }
  }

  return (
    <FormProvider {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Coupon Code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter coupon code"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Discount Type */}
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <FormControl>
                  <select {...field} className="w-full p-2 border rounded-lg">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (KES)</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Discount Value */}
          <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter discount value"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Minimum Purchase */}
          <FormField
            control={form.control}
            name="minPurchase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Purchase (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter minimum purchase"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Expiry Date */}
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      field.value ? field.value.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : undefined
                      )
                    }
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Usage Limit */}
          <FormField
            control={form.control}
            name="maxUsage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usage Limit (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter usage limit"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Is Active */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Is Active?</FormLabel>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Coupon`}
        </Button>
      </form>
    </FormProvider>
  );
};

export default CouponForm;
