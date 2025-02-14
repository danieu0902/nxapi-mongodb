import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function OPTIONS() {
    return new Response(null, { status: 204 });
}

export async function GET(request, { params }) {
    try {
        const { database } = await connectToDatabase();
        const collection = database.collection(process.env.MONGODB_COLLECTION);
        
        const { id } = params;
        if (!ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ message: "ID inválido" }), { status: 400 });
        }

        const results = await collection.find({ _id: new ObjectId(id) }).toArray();
        return new Response(JSON.stringify(results[0]), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error en GET:", error);
        return new Response(JSON.stringify({ message: "Error interno del servidor" }), { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const content = request.headers.get("content-type");
        if (content !== "application/json") {
            return new Response(JSON.stringify({ message: "Debes proporcionar datos JSON" }), { status: 400 });
        }

        const { database } = await connectToDatabase();
        const collection = database.collection(process.env.MONGODB_COLLECTION);
        
        const { id } = params;
        if (!ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ message: "ID inválido" }), { status: 400 });
        }

        const { nombre, precio, stock, imagen_url } = await request.json();
        const results = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { nombre, precio, stock, imagen_url } }
        );

        return new Response(JSON.stringify(results), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error en PUT:", error);
        return new Response(JSON.stringify({ message: "Error interno del servidor" }), { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { database } = await connectToDatabase();
        const collection = database.collection(process.env.MONGODB_COLLECTION);

        const { id } = params;
        if (!ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ message: "ID inválido" }), { status: 400 });
        }

        const results = await collection.deleteOne({ _id: new ObjectId(id) });

        return new Response(JSON.stringify(results), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error en DELETE:", error);
        return new Response(JSON.stringify({ message: "Error interno del servidor" }), { status: 500 });
    }
}