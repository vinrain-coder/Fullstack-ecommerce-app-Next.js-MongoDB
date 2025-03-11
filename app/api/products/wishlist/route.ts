import { connectToDatabase } from "@/lib/db";
import Product from "@/lib/db/models/product.model";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await connectToDatabase(); // Connect to MongoDB

        const { searchParams } = new URL(req.url);
        const ids = searchParams.get("ids");

        if (!ids) {
            return NextResponse.json({ error: "Missing product IDs" }, { status: 400 });
        }

        const productIds = ids.split(",");

        const products = await Product.find({ _id: { $in: productIds } });

        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
